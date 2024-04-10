
import { BuiltIns, IndexBuffer, RenderPipeline, Vec2Buffer, Vec4 } from "xgpu";
import { MouseControler } from "./MouseControler";


export class MouseToy extends RenderPipeline {

    public grid: Vec4 = new Vec4(32, 32, 0.05, 1);

    constructor(options?: any) {
        super();

        this.initFromObject({

            antiAliasing: true,
            instanceCount: this.grid.x * this.grid.y,
            instanceIndex: BuiltIns.vertexInputs.instanceIndex,
            grid: this.grid,
            mouse: new MouseControler(),

            pos: new Vec2Buffer([
                [-0.5, -0.5],
                [+0.5, -0.5],
                [-0.5, +0.5],
                [+0.5, +0.5]
            ]),
            indexBuffer: new IndexBuffer({ nbPoint: 6, datas: new Uint32Array([0, 1, 2, 1, 3, 2]) }),

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

        this.addEventListener(RenderPipeline.ON_ADDED_TO_RENDERER, () => {

            (this.resources.mouse as MouseControler).initCanvas(this.renderer.canvas)
        })
    }

}
