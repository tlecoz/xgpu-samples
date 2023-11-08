
import { GPURenderer, RenderPipeline, VertexAttribute, XGPU } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { MouseToy } from "../MouseToy/MouseToy";
import { VertexShaderDebugger } from "./VertexShaderDebugger";
import { ComputeTest } from "./ComputeTest";
import { DebugPanel } from "./DebugPanel";



export class Debugger_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {


        const pipeline = new MouseToy(renderer);

        const config = {
            nbVertex: 3,
            startVertexId: 0,
            instanceId: 0
        }

        const vertexDebugger = new VertexShaderDebugger(pipeline, config);

        pipeline.onDrawBegin = () => {
            vertexDebugger.nextFrame();
        }

        vertexDebugger.onLog = (results: any[], nbValueByFieldName: any) => {
            DebugPanel.instance.update(config, results, nbValueByFieldName);
            //console.log(results[0].position.x)
        }

        renderer.addPipeline(pipeline);

        //console.log(DebugPanel.instance)

        /*
        const test = new ComputeTest();
        console.log(test);
        */

    }


}