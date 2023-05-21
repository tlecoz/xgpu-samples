import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { TexturedCube } from "./TexturedCube";

export class TexturedCube_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const image: ImageBitmap = this.medias.bmp;
        const cube = new TexturedCube(renderer, image);
        const transform = cube.transform;
        transform.z = 700;
        transform.scaleX = transform.scaleY = transform.scaleZ = 100 * Math.min(window.innerWidth, window.innerHeight) / 512;
        cube.onDrawBegin = () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        }
        renderer.addPipeline(cube)
    }
}