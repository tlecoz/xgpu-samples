import { GPURenderer, Float, Vec3, RenderPipeline, PrimitiveFloatUniform } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { CubeGrid } from "./CubeGrid";


export class TonsOfCubes_Sample extends Sample {

    private started: boolean = false;
    protected async start(renderer: GPURenderer): Promise<void> {
        if (this.started) return;
        this.started = true;

        const grid: Vec3 = new Vec3(50, 50, 50);
        const gridSize: Float = new Float(400);
        const cubeSize: Float = new Float(40);

        const cube = new CubeGrid({
            grid,
            gridSize,
            cubeSize
        })

        grid.addEventListener(PrimitiveFloatUniform.ON_CHANGED, () => {
            console.log("instanceCount = ", grid.x, grid.y, grid.z);
            cube.instanceCount = grid.x * grid.y * grid.z
        });

        this.params = [
            { name: "grid.x", min: 1, max: 100, object: grid, id: 0, round: true },
            { name: "grid.y", min: 1, max: 100, object: grid, id: 1, round: true },
            { name: "grid.z", min: 1, max: 100, object: grid, id: 2, round: true },
            { name: "gridSize", min: 50, max: 1000, object: gridSize },
            { name: "cubeSize", min: 1, max: 300, object: cubeSize },
        ]


        renderer.addPipeline(cube);

        const transform = cube.resources.transform;
        const now = new Date().getTime();
        cube.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            const t = (new Date().getTime() - now) * 0.01;

            transform.scaleX = transform.scaleY = transform.scaleZ = Math.sin(t * 0.001) * 100;
            transform.rotationX += 0.003;
            transform.rotationY += 0.003;
            transform.rotationZ += 0.003;
        })

    }
}