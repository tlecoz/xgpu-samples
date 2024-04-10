import { BuiltIns, RenderPipeline, Vec4Buffer, VertexAttribute } from "xgpu";
import { cubeVertexArray, cubeVertexSize, cubePositionOffset } from "../../meshes/CubeMesh";
import { Camera } from "./Camera";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";

export class Cube extends RenderPipeline {

    constructor(options?: any) {
        super();
        const resources = this.initFromObject({
            //cullMode: "back",
            depthTest: true,
            antiAliasing: true,
            position: new Vec4Buffer(cubePositionOffset),
            transform: new ModelViewMatrix(),
            camera: new Camera(),
            fragPosition: BuiltIns.vertexOutputs.Vec4,
            vertexShader: `
            output.position = camera * transform * position;
            output.fragPosition = 0.5 * (position + vec4<f32>(1.0));
            `,
            fragmentShader: `output.color = fragPosition;`,
            ...options
        });


        (resources.position as VertexAttribute).vertexBuffer.setComplexDatas(cubeVertexArray, cubeVertexSize);

        const removeListenerAfterDistpatch: boolean = true;
        this.addEventListener(RenderPipeline.ON_ADDED_TO_RENDERER, () => {
            const camera: Camera = resources.camera as Camera;
            camera.screenW = this.renderer.width;
            camera.screenH = this.renderer.height;
        }, removeListenerAfterDistpatch)
    }



}
