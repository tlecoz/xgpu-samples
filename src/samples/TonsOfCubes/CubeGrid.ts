import { BuiltIns, Float, GPURenderer, RenderPipeline, ShaderType, Vec3, VertexAttribute, WgslUtils } from "xgpu";
import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset } from "../../meshes/CubeMesh";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";
import { Camera } from "../ColorCube/Camera";
export class CubeGrid extends RenderPipeline {

    public camera: Camera;
    public transform: ModelViewMatrix = new ModelViewMatrix();
    public time: Float = new Float(0);

    constructor(renderer: GPURenderer, descriptor: { grid: Vec3, gridSize: Float, cubeSize: Float, time: Float }) {
        super(renderer)

        const { grid, gridSize, cubeSize } = descriptor;
        const instanceCount = grid.x * grid.y * grid.z;
        this.camera = new Camera(renderer.width, renderer.height, 60, 0.1, 10000000);

        const resources = this.initFromObject({

            depthTest: true,
            antiAliasing: true,
            instanceCount,
            instanceId: BuiltIns.vertexInputs.instanceIndex,
            position: VertexAttribute.Vec4(cubePositionOffset),
            //uv: VertexAttribute.Vec2(cubeUVOffset),

            grid,
            time: new Float(0),
            gridSize,
            cubeSize,
            modelView: this.transform,
            camera: this.camera,

            vertexShader: {
                outputs: {
                    fragPosition: ShaderType.Vec4
                },
                main: `
                let id = f32(instanceId);
                let idx = id % grid.x;
                let idy = floor(id / grid.x) % grid.y;
                let idz = floor(id / (grid.x * grid.y));

                let offset = vec3(gridSize / grid.x , gridSize / grid.y , gridSize / grid.z) * 0.05;
                
                var pos = vec4(offset,0.0) * vec4((position.xyz / grid.xyz) * cubeSize , 1.0) ;
                pos.x += (-0.5 + idx / grid.x) * gridSize;
                pos.y += (-0.5 + idy / grid.y) * gridSize;
                pos.z += (-0.5 + idz / grid.z) * gridSize;

                output.position = uniforms.camera * uniforms.modelView * vec4(pos.xyz,1.0);
                output.fragPosition = vec4(0.5 + 0.5 * position.xyz,1.0 );
                `
            },
            fragmentShader: `output.color = fragPosition;`
        });

        (resources.position as VertexAttribute).vertexBuffer.setComplexDatas(cubeVertexArray, cubeVertexSize)
    }


}