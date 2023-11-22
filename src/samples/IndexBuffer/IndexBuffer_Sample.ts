import { GPURenderer, VertexBuffer, IndexBuffer, BuiltIns, RenderPipeline, Vec2Buffer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";


export class IndexBuffer_Sample extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {


        const buffer = new VertexBuffer({
            position: new Vec2Buffer([
                -1, -1,
                +1, -1,
                -1, +1,
                +1, +1
            ])
        })


        const indices = new Uint32Array([0, 1, 2, 1, 3, 2])
        const indexBuffer = new IndexBuffer({ nbPoint: indices.length })
        indexBuffer.datas = indices;

        const pipeline = new RenderPipeline();
        pipeline.initFromObject({
            buffer,
            indexBuffer,
            uv: BuiltIns.vertexOutputs.Vec2,
            vertexShader: `
                output.position = vec4(position,0.0,1.0);
                output.uv = position*0.5 + 0.5;
            `,
            fragmentShader: `
                output.color = vec4(uv,0.5,1.0);
            `
        })



        renderer.addPipeline(pipeline);

    }


}