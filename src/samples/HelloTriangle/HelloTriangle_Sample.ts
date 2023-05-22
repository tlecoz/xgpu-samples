
import { GPURenderer, RenderPipeline, VertexAttribute } from "xgpu";
import { Sample } from "./Sample";
import { ResizableRenderPipeline } from "./ResizableRenderPipeline";

export class HelloTriangle_Sample extends Sample {

    /*
    XGPU is a library that allows for manipulation of WebGPU using high-level code.
    It is not a rendering engine like Three.js or Babylon.js; 
    it does not contain pre-made classes such as Camera, ProjectionMatrix, Cube, etc.

    Therefore, I will gradually introduce these classes in the samples. 
 
    The code may look a bit long during the first samples then I'll re-use them later.  
    These are only examples to expose how to work with XGPU.
    The GPURenderer class is just a "helper" that allows for quick rendering testing.
    
    Feel free to modify the code according to your needs!
    */

    protected async start(renderer: GPURenderer): Promise<void> {

        const pipeline: RenderPipeline = new ResizableRenderPipeline(renderer);
        pipeline.initFromObject({
            position: VertexAttribute.Vec2([
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