import { BuiltIns, Float, GPURenderer, Matrix3x3, Matrix4x4, RenderPipeline, UniformGroup, Vec2, Vec3, Vec4 } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";




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

        this.test02(renderer);


    }
    /*
    // @ts-ignore
    private test03(renderer: GPURenderer) {



        const pipeline = new RenderPipeline();
        pipeline.initFromObject({

            col: new IVec4Array([
                new IVec4(100, 0, 0, 255),
                new IVec4(100, 255, 0, 255),
                new IVec4(255, 127, 255, 255),
            ]),
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
               output.textureId = 0;
               `
            },
            fragmentShader: `
               output.color = vec4<f32>(col[2])/255.0;
           `
        })

        renderer.addPipeline(pipeline);

    }*/


    private test02(renderer: GPURenderer) {

        const classes = [Float, Vec2, Vec3, Vec4, Matrix4x4, Matrix3x3];
        const alphabet = "abcdefghijklmnopqrstuvwxyz";

        const getChar = () => {
            return alphabet[Math.floor(Math.random() * alphabet.length)];
        }

        const o = {};
        //let nb = 8000;
        const nb = 20;
        let test = "";
        for (let i = 0; i < nb; i++) {
            const n = Math.floor((Math.random() * 100) / (100 / classes.length))
            const name = getChar() + getChar() + getChar() + "_" + Math.floor(Math.random() * 1000);
            o[name] = new classes[n]();
            if (i === nb - 10) test = name;
        }

        o[test] = new Vec3(1.0, 0.0, 1.0);

        const myGroup = new UniformGroup(o);


        const pipeline = new RenderPipeline();
        pipeline.initFromObject({

            myGroup,

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
               output.textureId = 0;
               `
            },
            fragmentShader: `
               output.color = vec4(myGroup.${test},1.0);
           `
        })

        renderer.addPipeline(pipeline);

    }
    /*
    // @ts-ignore
    private async test01(renderer: GPURenderer) {


        var otherObj = {
            aaa: new Float(1),
            bbb: new Vec2(1.0, 1.0),
            ccc: new Vec3(0.0, 1.0, 0.0),
            ddd: new Vec4(4.0, 4.0, 4.0, 4.0)
        }


        let test = "ee.ccc";
        var myGroup = new UniformGroup({
            aa: new Float(1),
            bb: new Vec2(1.0, 1.0),
            cc: new Vec3(1.0, 0.0, 1.0),
            dd: new Vec4(4.0, 4.0, 4.0, 4.0),
            ee: new UniformGroup(otherObj),
        })

        const getImageBitmap = async (url: string) => {
            const img: any = await fetch(url);
            const blob = await img.blob();
            return await createImageBitmap(blob);
        }
        const bmp1: ImageBitmap = await getImageBitmap("./assets/leaf.png");
        const bmp2: ImageBitmap = await getImageBitmap("./assets/leaf2.png");

        const groupArray = new UniformGroupArray([
            myGroup,
            myGroup,
        ])

        const images = new ImageTextureArray({
            source: [bmp1, bmp2],
            size: [bmp1.width, bmp1.height, 2]
        })

        const pipeline = new RenderPipeline();
        pipeline.initFromObject({
            //obj,
            //myGroup,

            imgSampler: new TextureSampler(),
            images,
            groupArray,
            //myGroup,

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
                output.textureId = 0;
                `
            },
            fragmentShader: `
                //output.color = vec4(a,a,a,1.0);
                //output.color = vec4(mouse.x,mouse.y,mouse.x*mouse.y,1.0);
                
                //output.color = vec4(myGroup.${test},1.0);
                
                //output.color = vec4(groupArray[0].${test},1.0);
                //output.color = textureSample(images,imgSampler,uv,i32(textureId));
            `
        })

        renderer.addPipeline(pipeline);
    }*/
}