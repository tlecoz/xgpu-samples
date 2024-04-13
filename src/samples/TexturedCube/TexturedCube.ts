import { TextureSampler, ImageTexture, BuiltIns, RenderPassTexture, Vec2Buffer } from "xgpu";
import { Cube } from "../ColorCube/Cube";
import { cubeUVOffset } from "../../meshes/CubeMesh";

export class TexturedCube extends Cube {

    constructor(image: ImageBitmap | GPUTexture | RenderPassTexture, options?: any) {
        super({

            imageSampler: new TextureSampler(),
            image: new ImageTexture({ source: image }),
            fragUV: BuiltIns.vertexOutputs.Vec2,
            uv: new Vec2Buffer(cubeUVOffset),
            //uv: VertexAttribute.Vec2(cubeUVOffset),
            fragmentShader: `output.color = textureSample(image, imageSampler, fragUV );`,
            ...options
        })
        this.vertexShader.main.createNode(`
            output.fragUV = uv;
        `)
    }
}