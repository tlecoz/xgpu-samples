import { AlphaBlendMode, BuiltIns, Float, GPURenderer, UniformBuffer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { MouseToy } from "../MouseToy/MouseToy";

export class RibbonMouseToy extends MouseToy {

    protected time: Float;
    protected startTime: number = new Date().getTime();

    constructor(options?: any) {
        super(options);

        this.vertexShader.addOutputVariable("dist", BuiltIns.vertexOutputs.Float);

        const uniformBuffer: UniformBuffer = this.bindGroups.getGroupByName("default").get("uniforms") as UniformBuffer;



        const createLocalVariable: boolean = true;
        this.time = uniformBuffer.add("time", new Float(0.0), createLocalVariable) as Float;
        this.blendMode = new AlphaBlendMode();
        this.grid.x = this.grid.y = 3236;
        this.instanceCount = 1618;

        this.grid.z = 0.001;


        this.vertexShader.main.createNode(`
            let dist = -0.5+ distance(output.position.xy,vec2(mouse.x,mouse.y));
            output.position = vec4( output.position.xy * dist*7.236 , 0.0 , 1.0);
            output.dist = dist;
            var newPos = vec2(
                 cos(time+a)  *cos(output.position.x - a),
                 sin(time+a) *sin(output.position.y - a)
            );
            output.position = vec4( newPos + (1.0-dist)*0.5, 0.0 , 1.0);
        `)



        this.vertexShader.main.executeSubNodeAfterCode = true; // true by default

        this.fragmentShader.main.text = "output.color = vec4(dist,abs(sin(time)),1.0,0.05);"
    }

    public update(): void {
        super.update();
        this.time.x = (new Date().getTime() - this.startTime) / 1000;
    }

}


export class RibbonMouseToy_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {
        renderer.addPipeline(new RibbonMouseToy());
    }

}