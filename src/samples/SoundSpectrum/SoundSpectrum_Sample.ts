import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { CubeGridSpectrum } from "./CubeGridSpectrum";

export class SoundSpectrum_Sample extends Sample {

    private started: boolean = false;
    protected async start(renderer: GPURenderer): Promise<void> {
        if (this.started) return;
        this.started = true;

        const cube = new CubeGridSpectrum(renderer, this.medias.bmp);
        const transform = cube.transform;
        transform.z = 400;
        transform.scaleX = transform.scaleY = transform.scaleZ = renderer.width / 512;

        cube.onDrawBegin = () => {

            transform.rotationX += 0.003;
            transform.rotationY = 0.3;
            transform.rotationZ += 0.003;
        }

        renderer.addPipeline(cube)


    }
}