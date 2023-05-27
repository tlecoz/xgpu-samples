import { BuiltIns, Float, GPURenderer, Matrix2x2, Matrix2x3, Matrix3x3, Matrix4x4, RenderPipeline, TextureSampler, UniformGroup, UniformGroupArray, Vec2, Vec3, Vec4, Vec4Array } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { vec3 } from "gl-matrix";
import { ImageTextureArray } from "xgpu/src/xGPU/shader/resources/ImageTextureArray";


class Mouse extends Vec3 {

    constructor(canvas: HTMLCanvasElement | any) {
        super(0, 0, 0);
        this.initStruct(["x", "y", "down"]);

        document.body.addEventListener("mousemove", (e) => {

            const r = canvas.getBoundingClientRect();
            const px = e.clientX - r.x;
            const py = e.clientY - r.y;

            this.x = -1.0 + (px / canvas.width) * 2.0;
            this.y = 1.0 - (py / canvas.height) * 2.0;
        })
        document.body.addEventListener("mousedown", () => { this.z = 1; })
        document.body.addEventListener("mouseup", () => { this.z = 0; })

    }

    public get down(): boolean { return this.z === 1 }
    public set down(b: boolean) {
        if (b) this.z = 1;
        else this.z = 0;
    }


}









export class TestAlignment_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {



        /*
        const classes = [Float, Vec2, Vec3, Vec4, Matrix4x4, Matrix2x2, Matrix2x3, Matrix3x3];
        const alphabet = "abcdefghijklmnopqrstuvwxyz";

        const getChar = () => {
            return alphabet[Math.floor(Math.random() * alphabet.length)];
        }

        const o = {};
        let test = "";
        for (let i = 0; i < 100; i++) {
            const n = Math.floor((Math.random() * 100) / (100 / classes.length))
            const name = getChar() + getChar() + getChar() + "_" + Math.floor(Math.random() * 1000);
            o[name] = new classes[n]();
            if (i === 50) test = name;
        }

        o[test] = new Vec3(1.0, 0.0, 1.0);

        var myGroup = new UniformGroup(o);
        */



        var otherObj = {
            aaa: new Float(1),
            bbb: new Vec2(1.0, 1.0),
            ccc: new Vec3(0.0, 1.0, 0.0),
            ddd: new Vec4(4.0, 4.0, 4.0, 4.0)
        }


        const test = "ee.ccc";
        var myGroup = new UniformGroup({
            aa: new Float(1),
            bb: new Vec2(1.0, 1.0),
            cc: new Vec3(1.0, 0.0, 1.0),
            dd: new Vec4(4.0, 4.0, 4.0, 4.0),
            ee: new UniformGroup(otherObj),
        })


        const groupArray = new UniformGroupArray([
            myGroup,
            new UniformGroup({ aaaaaaaaaaa: new Float(123) })
        ])

        const images = new ImageTextureArray({
            source: [this.medias.bmp, this.medias.bmp2],
            size: [this.medias.bmp.width, this.medias.bmp.height, 2]
        })

        const pipeline = new RenderPipeline(renderer);
        pipeline.initFromObject({
            //obj,
            //myGroup,
            imgSampler: new TextureSampler(),
            images,
            groupArray,
            a: new Float(0.25),
            mouse: new Mouse(renderer.canvas),
            b: new Vec2(0.5, 0.0),
            c: new Float(0.75),
            //tab:new Vec2Array()
            vertexId: BuiltIns.vertexInputs.vertexIndex,
            vertexCount: 6,
            uv: BuiltIns.vertexOutputs.Vec2,
            textureId: BuiltIns.vertexOutputs.Float,
            vertexShader: {
                constants: `
                const pos = array<vec2<f32>,6>(
                    vec2(-1.0, -1.0),
                    vec2(1.0, -1.0),
                    vec2(-1.0, 1.0),
                    vec2(1.0, -1.0),
                    vec2(1.0, 1.0),
                    vec2(-1.0, 1.0),
                 );
                `,
                main: `
                output.position = vec4(pos[vertexId],0.0,1.0);
                output.uv = (pos[vertexId] + 1.0) * 0.5;
                output.textureId = 1;
                `
            },
            fragmentShader: `
                //output.color = vec4(a,a,a,1.0);
                //output.color = vec4(mouse.x,mouse.y,mouse.x*mouse.y,1.0);
                //output.color = vec4(groupArray[0].${test},1.0);
                output.color = textureSample(images,imgSampler,uv,i32(textureId));
            `
        })

        renderer.addPipeline(pipeline);


    }


}