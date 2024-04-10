import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Dragon } from "../Light/Dragon";
import { LightShadowPlugin } from "./LightShadowPlugin";
import { Light } from "../Light/Light";


export class Shadow_Sample extends Sample {

    private started: boolean = false;
    protected async start(renderer: GPURenderer): Promise<void> {
        if (this.started) return;
        this.started = true;

        const dragon = new Dragon();
        dragon.debug = "dragon";

        dragon.model.scaleXYZ = 600;
        renderer.addPipeline(dragon)

        const plugin = new LightShadowPlugin(dragon, {
            position: dragon.position,
            normal: dragon.normal,
            modelMatrix: dragon.model,
            cameraMatrix: dragon.camera
        }).apply() as LightShadowPlugin;

        const light: Light = plugin.light;
        light.y = light.z = renderer.canvas.width * 0.9;

        const now = new Date().getTime();
        dragon.camera.eyePosition.y = renderer.canvas.height * 0.4;
        dragon.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            const time = (new Date().getTime() - now) / 1000;
            dragon.camera.rotationY += 0.01;

            light.r = Math.abs(Math.sin(time))
            light.g = Math.abs(Math.cos(1 + time * 0.66))
            light.b = Math.abs(Math.sin(2 + time * 0.33))
        });
    }

}