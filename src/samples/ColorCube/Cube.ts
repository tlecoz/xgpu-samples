import { BuiltIns, RenderPipeline, VertexAttribute } from "xgpu";
import { cubeVertexArray, cubeVertexSize, cubePositionOffset } from "../../meshes/CubeMesh";
import { Camera } from "./Camera";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";

export class Cube extends RenderPipeline {

    constructor(renderer, options?: any) {
        super(renderer);
        this.initFromObject({
            cullMode: "back",
            depthTest: true,
            antiAliasing: true,
            position: VertexAttribute.Vec4(cubePositionOffset),
            transform: new ModelViewMatrix(),
            camera: new Camera(this.renderer.width, this.renderer.height, 30),
            fragPosition: BuiltIns.vertexOutputs.Vec4,
            vertexShader: `
            output.position = camera * transform * position;
            output.fragPosition = 0.5 * (position + vec4<f32>(1.0));
            `,
            fragmentShader: `output.color = fragPosition;`,
            ...options
        });

        (this.resources.position as VertexAttribute).vertexBuffer.setComplexDatas(cubeVertexArray, cubeVertexSize);


    }

    public get camera(): Camera { return this.resources.camera; }
    public get transform(): ModelViewMatrix { return this.resources.transform; }

}
