import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { TexturedCube } from "../TexturedCube/TexturedCube";
import { RibbonMouseToy } from "../RibbonMouseToy/RibbonMouseToy_Sample";

export class RenderToTexture_Sample extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {

        const toy = new RibbonMouseToy({ clearColor: { r: 0.0, g: 0, b: 0, a: 1 } });
        const pipeline = new TexturedCube(toy.renderPass, { clearColor: { r: 0.1, g: 0.1, b: 0.1, a: 1 } })

        const { transform } = pipeline.resources;
        transform.scaleXYZ = 150;
        pipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        })

        renderer.addPipeline(pipeline);

    }




}