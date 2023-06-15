import { Bindgroup, BuiltIns, GPURenderer, ImageTexture, IndexBuffer, TextureSampler, UniformBuffer, VertexAttribute, VertexBuffer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { createSphereMesh, SphereLayout } from "../../meshes/Sphere";
import { ResizableRenderPipeline } from "../HelloTriangle/ResizableRenderPipeline";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";
import { Camera } from "../ColorCube/Camera";


export class RenderBundle_Sample extends Sample {

    public async start(renderer: GPURenderer): Promise<void> {

        const createCanvas = (val) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = canvas.height = 256;
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(0, 0, 256, 256);
            ctx.fillStyle = "#ffffff";
            ctx.font = "100px Verdana";
            ctx.fillText("" + val, 100, 160)
            return canvas
        }


        const createPolygon = async (posx: number, nbSide: number) => {

            const pos = [];
            let indices = [];

            for (let i = 0; i < nbSide; i++) {
                let angle = ((Math.PI * 2) / nbSide) * i;
                pos.push(Math.cos(angle), Math.sin(angle));
                indices.push(nbSide, (i + 0) % (nbSide), (i + 1) % (nbSide))
            }

            pos.push(0, 0);

            const matrix = new ModelViewMatrix();
            matrix.scaleX = matrix.scaleY = 100;
            matrix.x = posx

            return {
                vertexBuffer: new VertexBuffer({ position: VertexAttribute.Vec2(pos) }),
                properties: new UniformBuffer({ matrix }),
                indexBuffer: new IndexBuffer({ nbPoint: indices.length, datas: new Uint32Array(indices) }),
                img: new ImageTexture({ source: createCanvas(nbSide) }),
                imgSampler: new TextureSampler(),
            };
        }




        const polygons = [];
        for (let i = 0; i < 3; i++) {
            polygons[i] = await createPolygon(-250 + i * 250, 3 + i);
        }



        const poly = polygons[0];
        const bindgroup = new Bindgroup();
        bindgroup.initFromObject(poly);

        for (let i = 0; i < 3; i++) {
            bindgroup.createInstance(polygons[i])
        }


        const pipeline = new ResizableRenderPipeline(renderer);
        pipeline.initFromObject({
            bindgroups: {
                poly: bindgroup
            },

            camera: new Camera(renderer.width, renderer.height, 45),
            indexBuffer: (poly as any).indexBuffer,
            uv: BuiltIns.vertexOutputs.Vec2,
            vertexShader: `
                output.position = camera * properties.matrix * vec4(position,0.0,1.0);
                output.uv = position*0.5 + 0.5;
            `,
            fragmentShader: `
                output.color = textureSample(img, imgSampler, uv) + vec4(uv,0.5,1.0);
            `
        })



        renderer.addPipeline(pipeline);


    }



}