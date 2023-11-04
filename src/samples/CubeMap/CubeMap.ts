import { GPURenderer, CubeMapTexture, TextureSampler } from "xgpu";
import { Cube } from "../ColorCube/Cube";

export class CubeMap extends Cube {

    constructor(renderer: GPURenderer, sides: ImageBitmap[]) {
        super(renderer, {
            cullMode: "front",
            textureSampler: new TextureSampler(),
            cubeMap: new CubeMapTexture({
                size: [1024, 1024, 6],
                source: sides
            }),
            fragmentShader: `
            var cubemapVec = fragPosition.xyz - vec3(0.5);
            output.color = textureSample(cubeMap, textureSampler, cubemapVec);
            `
        })


        this.camera.zFar = 100000;
    }
} 