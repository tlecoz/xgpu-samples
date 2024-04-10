import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { VideoCube } from "./VideoCube";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";

export class VideoCube_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const getVideo = async (url: string) => {
            const video = document.createElement("video");
            video.src = url;
            video.loop = true;
            video.muted = true;
            await video.play();
            return video;
        }

        const video = await getVideo("../../assets/video.webm")

        const cube = new VideoCube(video);
        const transform: ModelViewMatrix = cube.resources.transform;

        transform.scaleX = transform.scaleY = transform.scaleZ = 150;
        cube.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        });
        renderer.addPipeline(cube)
    }
}