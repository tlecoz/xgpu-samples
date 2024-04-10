
import { GPURenderer, RenderPipeline, Vec2Buffer } from "xgpu";
import { Sample } from "./Sample";


export class HelloTriangle_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {

        const pipeline: RenderPipeline = new RenderPipeline();
        pipeline.initFromObject({
            position: new Vec2Buffer([
                [0.0, 0.5],
                [-0.5, -0.5],
                [0.5, -0.5]
            ]),
            vertexShader: `output.position = vec4(position,0.0,1.0);`,
            fragmentShader: `output.color = vec4(1.0,0.0,0.0,1.0);`
        })
        renderer.addPipeline(pipeline);
    }
}