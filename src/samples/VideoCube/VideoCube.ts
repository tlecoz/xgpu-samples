import { VideoTexture } from "xgpu";
import { TexturedCube } from "../TexturedCube/TexturedCube";

export class VideoCube extends TexturedCube {

    constructor(video: HTMLVideoElement) {
        super(null, {
            image: new VideoTexture({ source: video }),
            fragmentShader: `output.color = textureSampleBaseClampToEdge(image, imageSampler, fragUV);`
        })
    }

}