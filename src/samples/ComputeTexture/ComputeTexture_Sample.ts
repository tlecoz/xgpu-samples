import { BuiltIns, ComputePipeline, Float, GPURenderer, ImageTextureIO, RenderPipeline, TextureSampler } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { TexturedQuad } from "./TexturedQuad";

export class ComputeTexture_Sample extends Sample {

    protected time: Float;


    protected async start(renderer: GPURenderer): Promise<void> {

        /*
        In this sample, we use a texture as input/output of a computePipeline.
        and we draw this texture in a renderPipeline.
        */

        const getImageBitmap = async (url: string) => {
            const img: any = await fetch(url);
            const blob = await img.blob();
            return await createImageBitmap(blob);
        }
        const bitmap: ImageBitmap = await getImageBitmap("../../../public/assets/leaf.png");

        const time: Float = this.time = new Float(0);
        const image: ImageTextureIO = new ImageTextureIO({ source: bitmap });
        const textureSampler: TextureSampler = new TextureSampler();

        const computePipeline = new ComputePipeline();
        computePipeline.useRenderPipeline = true;
        computePipeline.initFromObject({
            image,
            textureSampler,
            time,
            workgroupId: BuiltIns.computeInputs.workgroupId,
            computeShader: `
            //in a computeShader based on a texture, workgroup.xy represents the width/height of the texture by default
            let id = vec2<i32>(workgroupId.xy);

            let dim = vec2<f32>(textureDimensions(image));
            var col = textureSampleLevel(image, textureSampler, (0.5+vec2<f32>(id)) / dim,0.0);

            if(floor(time) % 2 == 0) { 

                /*
                I pause the motion for one second every 2 second in order to show that
                it's not the exact same behaviour than a fragmentShader.
                In a fragmentShader, if we don't pass in the 'if',
                we should see the original source image as result.
                
                But it's not the case here because the texture computed by the computePipeline
                is send back to the computePipeline as source-input for the next frame
                
                (computePipeline works the same way with VertexBuffer. 
                 you keeo in memory the last "output" and re-use it as "input")
                */ 

                col.r = 0.5 + sin( time) * 0.5;
                col.g = 0.5 + cos( time + col.b) * 0.5;
            }
            
            textureStore(image_out, id, col);
            `
        })



        computePipeline.nextFrame();




        const renderPipeline = new TexturedQuad(image, textureSampler);
        renderer.addPipeline(renderPipeline);


        let now = new Date().getTime();
        renderPipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            time.x = (new Date().getTime() - now) / 1000;
            computePipeline.nextFrame();
        })

    }
}