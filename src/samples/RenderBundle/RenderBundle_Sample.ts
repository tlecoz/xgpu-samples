import { Bindgroup, BuiltIns, GPURenderer, ImageTexture, IndexBuffer, RenderPipeline, TextureSampler, UniformBuffer, VertexAttribute, VertexBuffer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { createSphereMesh, SphereLayout } from "../../meshes/Sphere";
import { ResizableRenderPipeline } from "../HelloTriangle/ResizableRenderPipeline";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";
import { Camera } from "../ColorCube/Camera";


export class RenderBundle_Sample extends Sample {

    public async start(renderer: GPURenderer): Promise<void> {




        const createPolygon = async (posx: number, nbSide: number) => {
            if (nbSide < 3) nbSide = 3;

            const pos = [];
            let angle;
            let addAngle = (Math.PI * 2) / nbSide;
            let indices = [];
            let n = 0;


            for (let i = 0; i < nbSide; i++) {
                angle = -Math.PI / 2 + addAngle * i;
                pos.push(Math.cos(angle), Math.sin(angle));

                indices.push(nbSide, (n + 0) % (nbSide), (n + 1) % (nbSide))
                n++;

            }
            pos.push(0, 0);
            //console.log(nbSide + " :::: ", indices);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = canvas.height = 256;
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(0, 0, 256, 256);
            ctx.fillStyle = "#ffffff";
            ctx.font = "100px Verdana";
            ctx.fillText("" + nbSide, 100, 160)
            const bmp = await createImageBitmap(canvas)



            const matrix = new ModelViewMatrix();
            matrix.scaleX = matrix.scaleY = 100;
            matrix.x = posx

            const desc = { source: bmp, debug: "AZERTY_" + nbSide } as any
            console.log("desc.debug = ", desc.debug);

            const img: any = new ImageTexture(desc);
            img.debug = "nbSide=" + nbSide;

            const indexBuffer = new IndexBuffer({ nbPoint: indices.length });
            indexBuffer.datas = new Uint32Array(indices);
            return {
                vertexBuffer: new VertexBuffer({
                    position: VertexAttribute.Vec2(pos)
                }),
                properties: new UniformBuffer({
                    matrix,

                }),
                indexBuffer,
                img,
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

        /*
        let bool = true;

        pipeline.onDrawEnd = () => {
            if (bool) {
                bool = false;

                polygons[2]._object.apply();
            }
        }
        */

        renderer.addPipeline(pipeline);














        /*
        const buffer = new VertexBuffer({
            position:VertexAttribute.Vec3(SphereLayout.positionsOffset),
            normal:VertexAttribute.Vec3(SphereLayout.normalOffset),
            uv:VertexAttribute.Vec2(SphereLayout.uvOffset)
        });
        buffer.setComplexDatas(sphereMesh.vertice,SphereLayout.vertexStride)


        pipeline.initFromObject({
            
        });
        */


    }



}