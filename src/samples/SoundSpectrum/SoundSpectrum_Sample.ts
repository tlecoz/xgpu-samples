import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { CubeGridSpectrum } from "./CubeGridSpectrum";

export class SoundSpectrum_Sample extends Sample {

    private started: boolean = false;
    protected async start(renderer: GPURenderer): Promise<void> {
        if (this.started) return;
        this.started = true;

        const getImageBitmap = async (url: string) => {
            const img: any = await fetch(url);
            const blob = await img.blob();
            return await createImageBitmap(blob);
        }
        const image: ImageBitmap = await getImageBitmap("../../../public/assets/leaf.png");


        const cube = new CubeGridSpectrum(image);
        const { transform, camera } = cube.resources;
        camera.fovInDegree = 60;
        transform.scaleX = transform.scaleY = transform.scaleZ = renderer.width / 512;

        cube.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {

            transform.rotationX += 0.003;
            transform.rotationY = 0.3;
            transform.rotationZ += 0.003;
        })

        renderer.addPipeline(cube)


    }
}