import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Cube } from "./Cube";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";

export class ColorCube_Sample extends Sample {



    protected async start(renderer: GPURenderer): Promise<void> {

        const cube = new Cube();
        const transform: ModelViewMatrix = cube.resources.transform; //<= defined in Cube.initFromObject

        transform.scaleX = transform.scaleY = transform.scaleZ = 150;
        cube.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            //console.log(transform.instances)
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        })

        renderer.addPipeline(cube)
    }
}