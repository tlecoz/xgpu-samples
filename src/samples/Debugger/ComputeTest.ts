import { BuiltIns, ComputePipeline, Float, IVec4, IVec4Array, UVec4, UVec4Array, Vec2, Vec4, Vec4Array, VertexAttribute, VertexBuffer, VertexBufferIO } from "xgpu";

export class ComputeTest extends ComputePipeline {


    constructor() {
        super();

        this.debug = "ComputeTest";
        const bufferIO = new VertexBufferIO({
            machin: VertexAttribute.Vec4(),
            bidule: VertexAttribute.Vec2(),
            truc: VertexAttribute.Vec3()

        })
        bufferIO.createVertexInstances(2, () => {
            return {
                machin: [0, 0, 0, 0],
                bidule: [0, 0],
                truc: [0, 0, 0]
            }

        })


        const propNames = ["machin", "bidule", "truc"];
        const nbValueByProp = [4, 2, 3]

        let computeShader = `
            let nbResult = arrayLength(&bufferIO);
            let index = globalId.x;
            if(index >= nbResult){
                return;
            }
            var computeResult = bufferIO[index];
            `;

        const components = "xyzw";
        for (let i = 0; i < propNames.length; i++) {
            computeShader += `
                    for(var i=0u;i<${nbValueByProp[i]};i++){
                        computeResult.${propNames[i]} =  shader_${propNames[i]}[i].${components.slice(0, nbValueByProp[i])} ; 
                    }

                `;
        }

        computeShader += `bufferIO_out[index] = computeResult ;`


        const resource = this.initFromObject({
            bindgroups: {
                io: {
                    bufferIO,
                },
                default: {
                    shader_machin: new Vec4Array([new Vec4(0, 1, 2, 3), new Vec4(4, 5, 6, 7)]),
                    shader_bidule: new Vec4Array([new Vec4(10, 11, 0, 0), new Vec4(12, 13, 0, 0)]),
                    shader_truc: new Vec4Array([new Vec4(20, 21, 22, 0), new Vec4(23, 24, 25, 0)]),
                    temp: new VertexBuffer({ pos: VertexAttribute.Vec2([1, 1]) }),
                }
            },


            globalId: BuiltIns.computeInputs.globalInvocationId,
            computeShader: computeShader
        });

        console.log(resource)


        let nb = 0;
        bufferIO.onOutputData = (data) => {
            const result = new Float32Array(data);

            bufferIO.getVertexInstances(result, (o) => {

                let result = {};
                for (let z in o) result[z] = { ...o[z] };

                console.log("RESULT = ", result);


            })


            //if (nb++ < 5) this.nextFrame();
        }


        this.nextFrame();


    }



}