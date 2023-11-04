import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Cube } from "../ColorCube/Cube";

export class TwoCubes_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const cube = new Cube(renderer)
        const trans = cube.transform;

        trans.z = -1000;
        trans.scaleX = trans.scaleY = trans.scaleZ = 150;

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

            //the word "transform" here is the name used to store this ressource 
            //in Pipeline.initFromObject.

            //=> Pipeline.resource is the value returned by Pipeline.initFromObject ,
            // it contains all the resource défined during its call directly binded 
            // to Pipeline.bindgroups

            transform.x = - renderer.width * 0.4 + renderer.width * 0.8 * id;
            transform.rotationX = transform.rotationY = transform.rotationZ = id + time;
            instances[id].apply()
        }


        renderer.addPipeline(cube);
    }
}