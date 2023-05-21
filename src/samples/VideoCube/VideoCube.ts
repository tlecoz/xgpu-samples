import { GPURenderer, TextureSampler, VideoTexture } from "xgpu";
import { Cube } from "../ColorCube/Cube";
import { TexturedCube } from "../TexturedCube/TexturedCube";

export class VideoCube extends TexturedCube {

    constructor(rennderer: GPURenderer, video: HTMLVideoElement) {
        super(rennderer, null, {
            image: new VideoTexture({ source: video }),
            fragmentShader: `output.color = textureSampleBaseClampToEdge(image, imageSampler, fragUV);`
        })
    }

}