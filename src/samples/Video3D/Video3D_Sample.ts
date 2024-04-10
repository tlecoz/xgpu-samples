import { BuiltIns, ComputePipeline, Float, GPURenderer, ImageTexture, Matrix4x4, RenderPipeline, TextureSampler, Vec4, Vec4Buffer, VertexBufferIO, XGPU } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { TexturedQuad } from "../ComputeTexture/TexturedQuad";
import { Camera } from "../ColorCube/Camera";
import { MouseControler } from "../MouseToy/MouseControler";


export class Video3D_Sample extends Sample {

    constructor() {
        super();
        this.video = null;
        /*
        you can't use a video directly in a computeShader, you must draw it in a texture before. 
        BUT you can use a texture as input of a computeShader only with a particular textureFormat. 

        You can't have different kind of texture-output-format , all must share the same. 

        So, if you run into this case, define the default format to "rgba8unorm" like this, once for all. 

        if you want to keep it simple, use "rgba8unorm" as preferedCanvasFormat all the time, 
        I suppose it's a bit less optimized but I don't even know 😅
        */

        XGPU.setPreferredCanvasFormat("rgba8unorm");
    }

    private video: HTMLVideoElement;

    public destroy(): void {
        if (this.video) {
            this.video.src = "";
        }

        super.destroy();
    }

    protected async start(renderer: GPURenderer): Promise<void> {

        const nbDepthLevel: Float = new Float(255);
        const smoothFrame: Float = new Float(0.1);
        const depthMax: Float = new Float(127);

        this.params = [
            { name: "nbDepthLevel", min: 1, max: 255, object: nbDepthLevel, round: true },
            { name: "depthMax", min: 1, max: 255, object: depthMax, round: true },
            { name: "smoothFrame", min: 0.01, max: 1, object: smoothFrame },
        ]


        const getVideo = async (url: string) => {
            const video = document.createElement("video");
            video.src = url;
            video.loop = true;
            video.muted = true;
            await video.play();
            return video;
        }

        this.video = await getVideo("../../assets/video.webm")
        //this.video = await getVideo("../../assets/fire.mp4")

        const scale = 0.5;
        const videoW = this.video.videoWidth * scale;
        const videoH = this.video.videoHeight * scale;

        const textureSampler: TextureSampler = new TextureSampler();
        const videoQuad = new TexturedQuad(this.video, textureSampler);

        //-----

        const nb = Math.floor(videoW * videoH);
        const buffer: VertexBufferIO = new VertexBufferIO({ pixel: new Vec4Buffer() })
        buffer.datas = new Float32Array(nb * 4);

        const mouse = new MouseControler();
        mouse.initCanvas(renderer.canvas);
        const image: ImageTexture = new ImageTexture({ source: videoQuad.renderPass });

        console.log("video size = ", this.video.videoWidth, this.video.videoHeight)



        const screen = new Vec4(videoW, videoH);
        const computePipeline = new ComputePipeline();
        computePipeline.useRenderPipeline = true;
        computePipeline.initFromObject({
            buffer,
            image,
            textureSampler,
            screen,
            smoothFrame,
            nbDepthLevel,
            depthMax,
            global_id: BuiltIns.computeInputs.globalInvocationId,
            computeShader: `
            let index = global_id.x ;
            var p = buffer[index].pixel;
            
            var id = f32(index);
            let ratio = screen.y / screen.x;
            let invRatio = (1 - ratio) * 0.5;

            var idx = (id % screen.x);
            var idy = floor(id / screen.x);
            let px = invRatio + (idx / screen.x) * ratio ;
            let py = (idy / screen.y) ;
            
            var col = textureSampleLevel(image,textureSampler,vec2(px  , py),0.0);
            p.z -= (p.z - (- (0.5 + ceil( distance(col.rgb,vec3(0.5)) * nbDepthLevel) / nbDepthLevel) * depthMax) ) * smoothFrame;
            
            buffer_out[index].pixel.x = screen.x * invRatio + idx * ratio; 
            buffer_out[index].pixel.y = idy ;
            buffer_out[index].pixel.z = p.z;
            `
        })

        computePipeline.nextFrame();

        /*
        buffer.onOutputData = (data) => {
            console.log(data.byteLength);
        }
        */

        const modelMatrix = new Matrix4x4();
        const viewMatrix = new Matrix4x4();
        const renderPipeline = new RenderPipeline();
        const projection = new Camera(renderer.width, renderer.height, 45, 0.1, 100000);

        renderPipeline.initFromObject({
            depthTest: true,
            antiAliasing: true,
            buffer,
            topology: "point-list",
            image,
            vertexCount: 1,

            textureSampler,
            modelMatrix,
            viewMatrix,
            screen,
            projection,
            instanceCount: nb,

            keepRendererAspectRatio: false,
            instanceId: BuiltIns.vertexInputs.instanceIndex,
            uv: BuiltIns.vertexOutputs.Vec2,
            vertexShader: `
           
            output.position = projection * viewMatrix * modelMatrix * vec4(pixel.xyz,1.0);
            output.uv = vec2(pixel.x/screen.x,pixel.y/screen.y) ;
            `,
            fragmentShader: `
            output.color = textureSample(image,textureSampler,uv) ;
            output.color = vec4(output.color.rgb ,1.0);
            `
        })

        renderer.addPipeline(renderPipeline);


        viewMatrix.scaleY = videoH / videoW
        viewMatrix.scaleX = -1 / (renderer.width / renderer.height)
        viewMatrix.scaleZ = -1;

        renderPipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {

            const smooth = 0.05;
            modelMatrix.rotationY -= (modelMatrix.rotationY - (mouse.x * Math.PI * 0.35)) * smooth;
            modelMatrix.rotationX -= (modelMatrix.rotationX - (mouse.y * Math.PI * 0.35)) * smooth;
            modelMatrix.rotationX += 0.001;
            modelMatrix.rotationY += 0.002;


            modelMatrix.x = -videoW * 0.5;
            modelMatrix.y = -screen.y * 0.5;
            modelMatrix.z = depthMax.x;
            projection.z = -550;

            //textureRenderer.update();
            computePipeline.nextFrame();
        });

    }

}