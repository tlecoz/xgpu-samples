import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Ribbon } from "./Ribbon";

export class Ribbon_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {


        var ribbon = new Ribbon(renderer);
        renderer.addPipeline(ribbon);


    }

}