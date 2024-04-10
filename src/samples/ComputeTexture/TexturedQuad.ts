import { BuiltIns, ImageTexture, ImageTextureIO, RenderPipeline, TextureSampler, VideoTexture } from "xgpu";

export class TexturedQuad extends RenderPipeline {

    public image: ImageTexture | ImageTextureIO | VideoTexture;
    public sampler: TextureSampler;

    constructor(source: ImageBitmap | HTMLVideoElement | GPUTexture | ImageTexture | ImageTextureIO | VideoTexture, textureSampler?: TextureSampler, options?: any) {
        super();

        let image: ImageTexture | ImageTextureIO | VideoTexture = source as any;
        let textureSampleFunc: string = "textureSample";
        if (source instanceof ImageBitmap || source instanceof GPUTexture) {
            image = new ImageTexture({ source })
        } else if (source instanceof HTMLVideoElement) {
            image = new VideoTexture({ source })
            textureSampleFunc = "textureSampleBaseClampToEdge";
        }

        if (!textureSampler) textureSampler = new TextureSampler();

        this.image = image;
        this.sampler = textureSampler;

        this.initFromObject({
            image,
            textureSampler,
            vertexCount: 6,
            vertexId: BuiltIns.vertexInputs.vertexIndex,
            uv: BuiltIns.vertexOutputs.Vec2,
            vertexShader: {
                constants: `
                const pos = array<vec2<f32>,6>(
                    vec2(-1.0, -1.0),
                    vec2(1.0, -1.0),
                    vec2(-1.0, 1.0),
                    vec2(1.0, -1.0),
                    vec2(1.0, 1.0),
                    vec2(-1.0, 1.0),
                 );
                `,
                main: `
                 output.position = vec4(pos[vertexId],0.0,1.0);
                 output.uv = (pos[vertexId] + 1.0) * 0.5;
                `
            },
            fragmentShader: `output.color = ${textureSampleFunc}(image,textureSampler,uv);`,
            ...options
        })

    }



}