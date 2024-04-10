import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { MouseToy } from "./MouseToy";

export class MouseToy_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {
        renderer.addPipeline(new MouseToy(renderer));
    }

}