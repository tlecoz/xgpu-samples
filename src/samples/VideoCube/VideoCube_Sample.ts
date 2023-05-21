import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { VideoCube } from "./VideoCube";

export class VideoCube_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const video: HTMLVideoElement = this.medias.video;
        const cube = new VideoCube(renderer, video);
        const transform = cube.transform;
        transform.z = 700;
        transform.scaleX = transform.scaleY = transform.scaleZ = 125 * renderer.width / 512;
        cube.onDrawBegin = () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        }
        renderer.addPipeline(cube)
    }
}