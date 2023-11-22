import { AlphaBlendMode, BuiltIns, Float, GPURenderer, UniformBuffer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { MouseToy } from "../MouseToy/MouseToy";

export class MouseToy2 extends MouseToy {

    protected time: Float;
    protected startTime: number = new Date().getTime();

    constructor() {
        super();

        this.vertexShader.addOutputVariable("dist", BuiltIns.vertexOutputs.Float);

        const uniformBuffer: UniformBuffer = this.bindGroups.getGroupByName("default").get("uniforms") as UniformBuffer;



        const createLocalVariable: boolean = true;
        this.time = uniformBuffer.add("time", new Float(0.0), createLocalVariable) as Float;
        this.blendMode = new AlphaBlendMode();
        this.grid.x = this.grid.y = 750;
        /*
        750 * 750 = 562 500 quads !!! :)
        Definitly not the most efficient way to do it 😅 
        Anyway, this sample show how to customize a pipeline when RenderPipeline.initFromObject has already been called
        */
        this.grid.z = 0.005;


        this.vertexShader.main.createNode(`
            let dist = -0.5+ distance(output.position.xy,vec2(mouse.x,mouse.y));
            output.position = vec4( output.position.xy * dist*5.236 , 0.0 , 1.0);
            output.dist = dist;
            var newPos = vec2(
                 cos(time+a)  *cos(output.position.x - a),
                 sin(time+a) *sin(output.position.y - a)
            );
            output.position = vec4( newPos + (1.0-dist)*0.5, 0.0 , 1.0);
        `)



        this.vertexShader.main.executeSubNodeAfterCode = true; // true by default

        this.fragmentShader.main.text = "output.color = vec4(dist,abs(sin(time)),1.0,0.015);"
    }

    public update(): void {
        super.update();
        this.time.x = (new Date().getTime() - this.startTime) / 1000;
    }

}


export class MouseToy2_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {
        renderer.addPipeline(new MouseToy2());
    }

}