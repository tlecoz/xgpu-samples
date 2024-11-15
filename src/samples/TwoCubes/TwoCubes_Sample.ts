import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Cube } from "../ColorCube/Cube";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";

export class TwoCubes_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const cube = new Cube()
        const trans: ModelViewMatrix = cube.resources.transform;

        trans.z = -2000;
        trans.scaleX = trans.scaleY = trans.scaleZ = 150;

        //cube.createPipelineInstanceArray allow us to define
        //the resources available per instance during the 'onDraw'.

        const nbCube: number = 2;
        const instances = cube.createPipelineInstanceArray([
            trans
        ], nbCube)

        console.log("instances = ",instances)

        const now = new Date().getTime();
        cube.addEventListener(RenderPipeline.ON_DRAW, (pipelineId: number) => {
            
            console.log("pipelineId = ",pipelineId)

            const time = (new Date().getTime() - now) / 1000;
            const { transform } = instances[pipelineId];

            //the word "transform" here is the name used to store this ressource 
            //in Pipeline.initFromObject.

            //=> Pipeline.resource is the value returned by Pipeline.initFromObject ,
            // it contains all the resource défined during its call directly binded 
            // to Pipeline.bindgroups

            transform.x = - renderer.width * 0.4 + renderer.width * 0.8 * pipelineId;
            transform.rotationX = transform.rotationY = transform.rotationZ = pipelineId + time;
            instances[pipelineId].apply()
        })


        renderer.addPipeline(cube);
    }
}