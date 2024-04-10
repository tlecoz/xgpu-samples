import { Bindgroup, BuiltIns, GPURenderer, ImageTexture, IndexBuffer, Matrix4x4, RenderPipeline, TextureSampler, Vec2Buffer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";
import { Camera } from "../ColorCube/Camera";

export class PolygonInstances_Sample extends Sample {

    public async start(renderer: GPURenderer): Promise<void> {

        const createCanvas = (val) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = canvas.height = 256;
            ctx.fillStyle = "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")";
            ctx.fillRect(0, 0, 256, 256);
            ctx.fillStyle = "#ffffff";
            ctx.font = "100px Verdana";
            ctx.fillText("" + val, 100, 160)
            return canvas
        }

        const createPolygon = async (posx: number, posy: number, nbSide: number) => {

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
            matrix.x = posx;
            matrix.y = posy;

            return {
                position: new Vec2Buffer(pos),
                matrix,
                indexBuffer: new IndexBuffer({ nbPoint: indices.length, datas: new Uint32Array(indices) }),
                img: new ImageTexture({ source: createCanvas(nbSide) }),
                imgSampler: new TextureSampler(),
            };
        }

        const polygons = [];
        for (let i = 0; i < 9; i++) {
            polygons[i] = await createPolygon(-250 + (i % 3) * 250, -(renderer.height - 400) * 0.5 + Math.floor(i / 3) * 250, 3 + i);
        }
        const polygonBindgroup = new Bindgroup(polygons);

        const pipeline = new RenderPipeline();
        pipeline.initFromObject({
            polygonBindgroup,
            camera: new Camera(renderer.width, renderer.height, 45),
            uv: BuiltIns.vertexOutputs.Vec2,
            vertexShader: `
                output.position = camera * matrix * vec4(position,0.0,1.0);
                output.uv = position*0.5 + 0.5;
            `,
            fragmentShader: `
                output.color = textureSample(img, imgSampler, uv) * vec4(uv*2.0,1.0,1.0);
            `
        })

        pipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            let matrix: Matrix4x4;
            let speed: number;
            for (let i = 0; i < polygons.length; i++) {
                speed = 0.01 + i / 300;
                matrix = polygons[i].matrix;
                matrix.rotationX += speed;
                matrix.rotationY += speed;
                matrix.rotationZ += speed;
            }
        })
        renderer.addPipeline(pipeline);
    }
}