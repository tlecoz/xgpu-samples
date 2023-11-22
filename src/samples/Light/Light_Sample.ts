import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Dragon } from "./Dragon";
import { LightPlugin } from "./LightPlugin";

export class Light_Sample extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {

        const dragon = new Dragon();
        dragon.model.scaleXYZ = 600;

        const light = new LightPlugin(dragon, {
            position: dragon.position,
            normal: dragon.normal,
            modelMatrix: dragon.model,
            cameraMatrix: dragon.camera
        }).apply() as LightPlugin;


        light.position.y = 1000;


        const now = new Date().getTime();
        dragon.camera.eyePosition.y = renderer.canvas.height * 0.4;
        dragon.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            const time = (new Date().getTime() - now) / 1000;
            dragon.camera.rotationY += 0.01;
            light.position.z = (Math.sin(time) * 1000);
        })

        renderer.addPipeline(dragon);

        //console.log("nbPipeline = ", renderer.nbPipeline)
    }

}