import { GPURenderer, TextureSampler, ImageTexture, BuiltIns, VertexAttribute } from "xgpu";
import { Cube } from "../ColorCube/Cube";
import { cubeUVOffset } from "../../meshes/CubeMesh";

export class TexturedCube extends Cube {

    constructor(rennderer: GPURenderer, image: ImageBitmap | GPUTexture, options?: any) {
        super(rennderer, {
            imageSampler: new TextureSampler(),
            image: new ImageTexture({ source: image }),
            fragUV: BuiltIns.vertexOutputs.Vec2,
            uv: VertexAttribute.Vec2(cubeUVOffset),
            fragmentShader: `output.color = textureSample(image, imageSampler, fragUV);`,
            ...options
        })
        this.vertexShader.main.createNode(`
            output.fragUV = uv;
        `)
    }
}