import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Pencil } from "./Pencil";

export class Pencil_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {


        var pencil = new Pencil(renderer);
        renderer.addPipeline(pencil);


    }

}