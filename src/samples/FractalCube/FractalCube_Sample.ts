import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { TexturedCube } from "../TexturedCube/TexturedCube";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";

export class FractalCube_Sample extends Sample {

    private started: boolean = false;
    protected async start(renderer: GPURenderer): Promise<void> {
        if (this.started) return;
        this.started = true;

        const cube = new TexturedCube(null)

        cube.fragmentShader.main.executeSubNodeAfterCode = true; //<= default = true;
        cube.fragmentShader.main.createNode(`output.color = vec4( (fragPosition.rgb -output.color.rgb)  , 1.0);`)

        const transform: ModelViewMatrix = cube.resources.transform;
        transform.scaleX = transform.scaleY = transform.scaleZ = 150;


        cube.addEventListener(RenderPipeline.ON_DRAW_END, () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
            cube.resources.image.source = cube.renderPass;
        });

        renderer.addPipeline(cube)

    }

}