import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Cube } from "../ColorCube/Cube";

export class TwoCubes_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const cube = new Cube(renderer)

        cube.transform.z = 1000;
        cube.transform.scaleX = cube.transform.scaleY = cube.transform.scaleZ = 125;

        //cube.createPipelineInstanceArray allow us to define
        //the resources available per instance during the 'onDraw'.

        const nbCube: number = 2;
        const instances = cube.createPipelineInstanceArray([
            cube.resources.transform
        ], nbCube)

        const now = new Date().getTime();
        cube.onDraw = (id: number) => {
            let time = (new Date().getTime() - now) / 1000;
            const { transform } = instances[id];
            transform.x = - renderer.width * 0.4 + renderer.width * 0.8 * id;
            transform.rotationX = transform.rotationY = transform.rotationZ = id + time;
            instances[id].apply()
        }


        renderer.addPipeline(cube);
    }
}