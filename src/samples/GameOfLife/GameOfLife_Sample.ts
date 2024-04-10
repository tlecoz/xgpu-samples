import { BuiltIns, ComputePipeline, GPURenderer, PrimitiveFloatUniform, RenderPipeline, UVec2, UintBuffer, VertexBufferIO } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";

export class GameOfLife_Sample extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {


        const size: UVec2 = new UVec2(128, 128);
        const nbCells = size.x * size.y


        const cells: VertexBufferIO = new VertexBufferIO({ cell: new UintBuffer() })
        cells.createVertexInstances(nbCells, () => {
            return {
                cell: [Math.random() < 0.25 ? 1 : 0]
            }
        })



        const computePipeline = new ComputePipeline();
        computePipeline.useRenderPipeline = true;
        computePipeline.setWorkgroups(8, 8);
        computePipeline.setDispatchWorkgroup(size.x / 8, size.y / 8)
        computePipeline.initFromObject({
            size,
            cells,
            grid: BuiltIns.computeInputs.globalInvocationId,
            computeShader: {
                constants: `
                fn getIndex(x: u32, y: u32) -> u32 {
                    let h = size.y;
                    let w = size.x;
                    return (y % h) * w + (x % w);
                  }
                  
                  fn getCell(x: u32, y: u32) -> u32 {
                    return cells[getIndex(x, y)].cell;
                  }
                  
                  fn countNeighbors(x: u32, y: u32) -> u32 {
                    return getCell(x - 1, y - 1) + getCell(x, y - 1) + getCell(x + 1, y - 1) + 
                           getCell(x - 1, y) +                         getCell(x + 1, y) + 
                           getCell(x - 1, y + 1) + getCell(x, y + 1) + getCell(x + 1, y + 1);
                  }
                `,
                main: `
                let x = grid.x;
                let y = grid.y;
                let n = countNeighbors(x, y);
                cells_out[getIndex(x, y)].cell = select(u32(n == 3u), u32(n == 2u || n == 3u), getCell(x, y) == 1u); 
                `
            }
        })

        //XGPU.showComputeShader = true;
        //XGPU.showVertexShader = true;






        const renderPipeline = new RenderPipeline();
        renderPipeline.initFromObject({
            size: new UVec2(size.x, size.y),
            cells,
            instanceCount: nbCells,
            vertexCount: 6,
            instanceId: BuiltIns.vertexInputs.instanceIndex,
            vertexId: BuiltIns.vertexInputs.vertexIndex,
            cell: BuiltIns.vertexOutputs.Float,

            vertexShader: {
                constants: `
                const vertexPos = array<vec2<f32>,6>(
                    vec2(-1.0, -1.0),
                    vec2(1.0, -1.0),
                    vec2(-1.0, 1.0),
                    vec2(1.0, -1.0),
                    vec2(1.0, 1.0),
                    vec2(-1.0, 1.0),
                 );

                
                `,
                main: `
                let pos = vertexPos[vertexId];
                let i = f32(instanceId);
               
                let w = f32(size.x);
                let h = f32(size.y);
                let x =  pos.x*0.01 + (i % w ) / w;
                let y =  pos.y*0.01 + floor(i/w) / h; 
               

                output.position = vec4(-1.0+x*2.0,-1.0+y*2.0,0.0,1.0);
                output.cell = f32(cell);

               
               
                                `
            },
            fragmentShader: `output.color = vec4(cell,cell,cell,1.0);`
        })

        let frameId = 0;
        renderPipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            if (frameId++ % 15) {//props.timestep.x) {
                //if (renderer.paused) return
                computePipeline.nextFrame();
            }


        })

        renderer.addPipeline(renderPipeline);

        const resetGrid = (w, h) => {
            //frameId = 1;


            renderPipeline.resources.size.x = size.x;
            renderPipeline.resources.size.y = size.y;
            cells.createVertexInstances(w * h, () => {
                return {
                    cell: [Math.random() < 0.25 ? 1 : 0]
                }
            })



        }

        size.addEventListener(PrimitiveFloatUniform.ON_CHANGED, () => {

            //console.log("a")
            resetGrid(size.x, size.y);



            //XGPU.loseDevice();

        });


        /*
        let nb = 0;

        cells.onOutputData = (data) => {
            //console.log(data.byteLength)
            //console.log("nextFrame ", new Int32Array(data));
            if (nb == 0) {
                //console.log("a")
                computePipeline.nextFrame();
            }


        }*/



        computePipeline.nextFrame();




        setTimeout(() => {
            resetGrid(32, 32);

        }, 500)









        this.params = [
            //{ name: "timestep", min: 1, max: 60, object: props.timestep, round: true },
            { name: "size.x", min: 16, max: 1024, object: size, id: 0, round: true },
            { name: "size.y", min: 16, max: 1024, object: size, id: 1, round: true },
        ];
    }


}