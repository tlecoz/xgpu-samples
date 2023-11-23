import { IndexBuffer, Matrix4x4, RenderPipeline, Vec3Buffer, VertexBuffer } from "xgpu";
import { Camera } from "../ColorCube/Camera";
import { dragonMesh } from "./DragonMesh";

export class Dragon extends RenderPipeline {

    public model: Matrix4x4;
    public camera: Camera;
    public position: Vec3Buffer;
    public normal: Vec3Buffer;

    constructor(options?: any) {
        super();
        this.model = new Matrix4x4();
        this.camera = new Camera(1, 1, 60, 0.1, 100000);

        this.initFromObject({
            cullMode: "back",
            depthTest: true,
            indexBuffer: new IndexBuffer({ nbPoint: dragonMesh.triangles.length, datas: new Uint16Array(dragonMesh.triangles) }),
            position: new Vec3Buffer(dragonMesh.positions),
            normal: new Vec3Buffer(dragonMesh.normals),
            cameraViewProjMatrix: this.camera,
            modelMatrix: this.model,
            vertexShader: `output.position = cameraViewProjMatrix  *  modelMatrix * vec4(position, 1.0);`,
            fragmentShader: `output.color = vec4(1.0);`,
            ...options,
        });


        const vertexBuffer = this.bindGroups.getGroupByName("default").get("buffer") as VertexBuffer;
        this.position = vertexBuffer.attributes.position;
        this.normal = vertexBuffer.attributes.normal;

        this.addEventListener(RenderPipeline.ON_ADDED_TO_RENDERER, () => {
            this.camera.screenW = this.renderer.width;
            this.camera.screenH = this.renderer.height;
        })
    }
}