
import { BuiltIns, GPURenderer, IndexBuffer, Matrix4x4Array, RenderPipeline, Vec2Buffer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Camera } from "../ColorCube/Camera";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";
import { Panel } from "./Panel";


export class DebuggingVertexShader_Sample extends Sample {

    private panel: Panel;

    protected async start(renderer: GPURenderer): Promise<void> {

        this.panel = new Panel(650, 630);


        const matrixArrays: ModelViewMatrix[] = [];
        let m: ModelViewMatrix;
        let k: number = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                m = new ModelViewMatrix();
                m.x = (-0.25 + i * 0.25) * renderer.width;
                m.y = (-0.25 + j * 0.25) * renderer.height;
                m.scaleX = m.scaleY = 150;
                matrixArrays[k++] = m;
            }
        }

        const pipeline: RenderPipeline = new RenderPipeline({ r: 0, g: 0, b: 0, a: 1 });
        pipeline.initFromObject({

            position: new Vec2Buffer([
                -0.5, -0.5,
                +0.5, -0.5,
                -0.5, +0.5,
                +0.5, +0.5,
            ]),

            indexBuffer: new IndexBuffer({ nbPoint: 6, datas: new Uint32Array([0, 1, 2, 1, 3, 2]) }),
            camera: new Camera(renderer.width, renderer.height, 60, 0.1, 1000),
            matrixs: new Matrix4x4Array(matrixArrays),
            instanceCount: 9,
            instanceId: BuiltIns.vertexInputs.instanceIndex,

            //------------debug------------------

            debugVertexCount: 2,

            quadPos0: BuiltIns.vertexDebug.Vec4(0, 0),  //without parameter means vertexId:0,instanceId:0
            quadMatrix4: BuiltIns.vertexDebug.Matrix4x4(4),
            quadPos4: BuiltIns.vertexDebug.Vec4(4),
            quadPos8_vertex2: BuiltIns.vertexDebug.Vec4(8, 2),
            twoMatrix: BuiltIns.vertexDebug.Matrix4x4Array(2),//the 2 first matrixs of the array 

            //-----------------------------------

            vertexShader: `
                var pos = vec4(position,0.0,1.0);

                debug.quadPos0 = pos; //=> a first log  with the position before the matrix pass
                output.position = camera * matrixs[instanceId] * pos;
                debug.quadPos0 = output.position; //=> a second log using the same name with the position after the matrix pass
                
                debug.quadMatrix4 = matrixs[instanceId];
                debug.quadPos4 = output.position;
                debug.quadPos8_vertex2 = output.position;
                debug.twoMatrix = matrixs;
            `,
            fragmentShader: `
                output.color = vec4(1.0);
            `,
        })

        pipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            matrixArrays[0].rotationZ += 0.01;
            matrixArrays[4].scaleX = Math.sin(new Date().getTime() * 0.001) * 150;
        })

        pipeline.addEventListener(RenderPipeline.ON_LOG, (pipeline: RenderPipeline, data: any) => {
            //@ts-ignore
            pipeline;


            showLogs(data);
        });

        renderer.addPipeline(pipeline);

        /*

            HOW TO USE : 

            //Every kind of data can be logged : 
            BuiltIns.vertexDebug.Float
            BuiltIns.vertexDebug.Vec2
            BuiltIns.vertexDebug.Vec3
            BuiltIns.vertexDebug.Vec4
            BuiltIns.vertexDebug.Int
            BuiltIns.vertexDebug.IVec2
            BuiltIns.vertexDebug.IVec3
            BuiltIns.vertexDebug.IVec4
            BuiltIns.vertexDebug.Uint
            BuiltIns.vertexDebug.UVec2
            BuiltIns.vertexDebug.UVec3
            BuiltIns.vertexDebug.UVec4
            BuiltIns.vertexDebug.Matrix3x3
            BuiltIns.vertexDebug.Matrix4x4
            BuiltIns.vertexDebug.Vec4Array
            BuiltIns.vertexDebug.IVec4Array
            BuiltIns.vertexDebug.UVec4Array
            BuiltIns.vertexDebug.Matrix4x4Array

            a) Each value contained in BuiltIns.vertexDebug is a function defined like that 
            
            (instanceId:number, vertexId:number)=>{//...}
            
                or 

            (len:number,instanceId:number=0, vertexId:number=0)=>{//...}  
            for the arrays. 
            
            
            when you write , for example, 
            
            pos:BuiltIns.vertexDebug.Vec4(4,2) , it means you want to log the vertex with the index 2 of the instance 4 

            //###########################################################################################################

            b) the debug values you defined in 'initFromObject' can be used for multiple logs
            It's designed to be used as if you called console.log.
            For example, let's say I defined 

            test:BuiltIns.vertexDebug.Int;

            in my shader , if I write 
            debug.test = 123;
            debug.test = 456;

            I will receive the 2 logs with the values (123 and 456)
            
             //###########################################################################################################
           
            
            c) you can define a property 'debugVertexCount' in RenderPipeline.initFromObject 
            It allow you to log automaticly multiple vertex starting from the one defined the value you want to debug. 
            
            For example, to log every vertex of a quad , I can write 

            vertexPos_0:BuiltIns.vertexDebug.Vec4(0,0);
            vertexPos_1:BuiltIns.vertexDebug.Vec4(0,1);
            vertexPos_2:BuiltIns.vertexDebug.Vec4(0,2);
            vertexPos_3:BuiltIns.vertexDebug.Vec4(0,3);

            or I can simply write 

            debugVertexCount:4,
            vertexPos:BuiltIns.vertexDebug.Vec4(0,0);

            debugVertexCount will be applyed to every values. 
            
            The object received from RenderPipeline.onLog contains an array called "results". 
            Each entry refeers to a pass processed by debugVertexCount 
            
             //###########################################################################################################

            d) You can write 
            BuiltIns.vertexDebug.Float (for example) , without parenthesis , it's the equivalent of BuiltIns.vertexDebug.Float(0,0); 
            For the arrays , BuiltIns.vertexDebug.UVec4Array (for exemple) is the equivalent to BuiltIns.vertexDebug.UVec4Array(1,0,0);


            //###########################################################################################################

            e) you can assign a computation to debug value , for example 

            debug.test = matrix * vec4(position,1.0); 

            but you can't use the debug.value in a computation. 
            The keyword "debug" must be the first word of a line.

            
            f) For now (I'll try to fix it soon) , it doesn't work with a renderPipeline that use a buffer computed in a ComputePipeline 
            */


        //=====================================================



        const components = ["x", "y", "z", "w"];
        const structureTextResult = (name: string, obj: any, nbValue: number, nbStep) => {

            let result = name + " : {";
            if (nbStep) result = name + "#" + nbStep + ": {";

            for (let i = 0; i < nbValue; i++) {
                if (i != 0) result += ",";
                result += components[i] + ":" + obj[components[i]].toFixed(4);
            }
            result += "}\n";
            return result;
        }

        const showLogs = (o) => {
            let text: string = "";
            let results = o.results;
            let resultLen: number = results.length
            let fieldName: string;
            let nbStep: number;
            let t: string[];
            let logName: string;
            for (let i = 0; i < resultLen; i++) {
                text += "debugVertexCount " + i + " / " + (resultLen - 1) + " : \n";

                for (let z in results[i]) {

                    t = z.split("__");
                    fieldName = logName = t[0];
                    if (isNaN(Number(t[1]))) {
                        nbStep = 0;
                        logName += t[1].slice(1);
                    } else {
                        nbStep = Number(t[1]);
                    }
                    //console.log(t[1])

                    // console.log(z, o.nbValueByFieldName[fieldName])
                    text += structureTextResult(logName, results[i][z], o.nbValueByFieldName[fieldName], nbStep)
                }
                text += "---------\n\n";

            }

            this.panel.innerText = text;
        }






    }


    public destroy(): void {
        if (this.panel) {
            this.panel.destroy();
            super.destroy();
        }

    }


}