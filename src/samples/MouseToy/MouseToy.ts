import { BuiltIns, GPURenderer, Vec4, VertexAttribute } from "xgpu";
import { MouseControler } from "./MouseControler";
import { ResizableRenderPipeline } from "../HelloTriangle/ResizableRenderPipeline";


export class MouseToy extends ResizableRenderPipeline {

    public grid: Vec4 = new Vec4(32, 32, 0.05, 1);

    constructor(renderer: GPURenderer, options?: any) {
        super(renderer);
        this.initFromObject({

            antiAliasing: true,
            instanceCount: this.grid.x * this.grid.y,
            instanceIndex: BuiltIns.vertexInputs.instanceIndex,
            grid: this.grid,
            mouse: new MouseControler(renderer.canvas),
            pos: VertexAttribute.Vec2([
                [0.0, 0.5],
                [-0.5, -0.5],
                [0.5, -0.5]
            ]),
            vertexShader: `
                var px = 0.05-1.0 + f32(instanceIndex) % grid.x / grid.x * 2.0;
                var py = 0.05-1.0 + floor(f32(instanceIndex) / grid.x) / grid.y * 2.0;
               
                var a = atan2(pos.y,pos.x);
                var d = sqrt(pos.x * pos.x + pos.y * pos.y) * grid.z;
                
                var a2 = atan2(py - mouse.y,px - mouse.x);
                var dx = px - mouse.x;
                var dy = py - mouse.y;
                d *= sqrt(dx*dx + dy*dy) + mouse.wheel*0.5;

                output.position = vec4(px +  cos(a + a2) * d  ,py + sin(a + a2) * d,0.0,1.0);
            `,
            fragmentShader: `
            if(mouse.down == 1.0){
                output.color = vec4(1.0,0.0,0.0,1.0);
            } else {
                output.color = vec4(1.0,1.0,1.0,1.0);
            }
            `,
            ...options
        })
    }

}