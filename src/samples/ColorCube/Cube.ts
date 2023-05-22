import { BuiltIns, VertexAttribute } from "xgpu";
import { cubeVertexArray, cubeVertexSize, cubePositionOffset } from "../../meshes/CubeMesh";
import { Camera } from "./Camera";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";
import { ResizableRenderPipeline } from "../HelloTriangle/ResizableRenderPipeline";

export class Cube extends ResizableRenderPipeline {

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

        this.screenDim.onChange = () => {
            console.log(this.screenDim.width, this.screenDim.height)
            this.resources.camera.screenW = this.screenDim.width;
            this.resources.camera.screenH = this.screenDim.height;
        }
    }

    public get camera(): Camera { return this.resources.camera; }
    public get transform(): ModelViewMatrix { return this.resources.transform; }

}
