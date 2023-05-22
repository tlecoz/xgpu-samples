import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Cube } from "./Cube";

export class ColorCube_Sample extends Sample {



    protected async start(renderer: GPURenderer): Promise<void> {

        const cube = new Cube(renderer);
        const transform = cube.transform;


        transform.scaleX = transform.scaleY = transform.scaleZ = 125 * Math.min(window.innerWidth, window.innerHeight) / 512;
        cube.onDrawBegin = () => {

            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        }
        renderer.addPipeline(cube)


    }
}