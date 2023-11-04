import { GPURenderer, HeadlessGPURenderer, IndexBuffer, Matrix4x4, RenderPipeline, VertexAttribute, VertexBuffer } from "xgpu";
import { Camera } from "../ColorCube/Camera";
import { dragonMesh } from "./DragonMesh";

export class Dragon extends RenderPipeline {

    public model: Matrix4x4;
    public camera: Camera;
    public position: VertexAttribute;
    public normal: VertexAttribute;

    constructor(renderer: GPURenderer | HeadlessGPURenderer) {
        super(renderer);
        this.model = new Matrix4x4();
        this.camera = new Camera(renderer.canvas.width, renderer.canvas.height, 60, 0.1, 100000);

        this.initFromObject({
            cullMode: "back",
            depthTest: true,
            indexBuffer: new IndexBuffer({ nbPoint: dragonMesh.triangles.length, datas: new Uint16Array(dragonMesh.triangles) }),
            position: VertexAttribute.Vec3(dragonMesh.positions),
            normal: VertexAttribute.Vec3(dragonMesh.normals),
            cameraViewProjMatrix: this.camera,
            modelMatrix: this.model,
            vertexShader: `output.position = cameraViewProjMatrix  *  modelMatrix * vec4(position, 1.0);`,
            fragmentShader: `output.color = vec4(1.0);`
        });


        const vertexBuffer = this.bindGroups.getGroupByName("default").get("buffer") as VertexBuffer;
        this.position = vertexBuffer.attributes.position;
        this.normal = vertexBuffer.attributes.normal;
    }
}