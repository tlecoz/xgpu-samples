import { GPURenderer, VideoTexture } from "xgpu";
import { TexturedCube } from "../TexturedCube/TexturedCube";

export class VideoCube extends TexturedCube {

    constructor(rennderer: GPURenderer, video: HTMLVideoElement) {
        super(rennderer, null, {
            image: new VideoTexture({ source: video }),
            fragmentShader: `output.color = textureSampleBaseClampToEdge(image, imageSampler, fragUV);`
        })
    }

}