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

        let now = new Date().getTime();
        this.onDrawEnd = () => {
            let time = (new Date().getTime() - now) / 1000;
            this.transform.scaleX = this.transform.scaleY = this.transform.scaleZ = 10000;
            this.transform.rotationY = Math.sin(time * 0.15 + 1) * Math.PI;
            this.transform.rotationX = 0.25 + Math.cos(time * 0.4) * Math.PI * 0.1;
        }


    }


} 