import { BuiltIns, GPURenderer, Matrix4x4Array, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Cube } from "../ColorCube/Cube";
import { ModelViewMatrix } from "./ModelViewMatrix";

export class InstanceCube_Sample extends Sample {

    protected matrixs: Matrix4x4Array;

    protected async start(renderer: GPURenderer): Promise<void> {


        let k = 0;
        let modelViewArr: ModelViewMatrix[] = [];
        let matrix: ModelViewMatrix;
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                modelViewArr[k++] = matrix = new ModelViewMatrix();
                matrix.x = -256 + 100 * (x + 1);
                matrix.y = -256 + 100 * (y + 1);
                matrix.scaleX = matrix.scaleY = matrix.scaleZ = 20;
                matrix.rotationX = Math.random() * Math.PI * 2;
                matrix.rotationY = Math.random() * Math.PI * 2;
                matrix.rotationZ = Math.random() * Math.PI * 2;
            }
        }

        this.matrixs = new Matrix4x4Array(modelViewArr)


        const cube = new Cube({
            instanceCount: 16,
            matrixs: this.matrixs,
            instanceId: BuiltIns.vertexInputs.instanceIndex,
        })
        cube.vertexShader.main.text = `
        output.position = camera * transform * matrixs[instanceId] * position;
        output.fragPosition = 0.5 * (position + vec4<f32>(1.0));
        `

        const transform: ModelViewMatrix = cube.resources.transform;
        transform.scaleX = transform.scaleY = transform.scaleZ = renderer.width / 512;

        cube.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            let m: ModelViewMatrix;
            for (let i = 0; i < 16; i++) {
                m = this.matrixs.matrixs[i] as ModelViewMatrix;
                m.rotationX += 0.01;
                m.rotationY += 0.01;
                m.rotationZ += 0.01;
            }

            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        });

        renderer.addPipeline(cube);

    }


}