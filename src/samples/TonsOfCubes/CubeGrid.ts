import { BuiltIns, Float, Vec3 } from "xgpu";
import { Cube } from "../ColorCube/Cube";



export class CubeGrid extends Cube {


    constructor(descriptor: { grid: Vec3, gridSize: Float, cubeSize: Float }) {

        const instanceCount: number = descriptor.grid.x * descriptor.grid.y * descriptor.grid.z;
        super({
            ...descriptor,
            instanceCount,
            instanceId: BuiltIns.vertexInputs.instanceIndex,
            vertexShader: `
            let id = f32(instanceId);
            let idx = id % grid.x;
            let idy = floor(id / grid.x) % grid.y;
            let idz = floor(id / (grid.x * grid.y));

            let offset = vec3(gridSize / grid.x , gridSize / grid.y , gridSize / grid.z) * 0.05;
            
            var pos = vec4(offset,0.0) * vec4((position.xyz / grid.xyz) * cubeSize , 1.0) ;
            pos.x += (-0.5 + idx / grid.x) * gridSize;
            pos.y += (-0.5 + idy / grid.y) * gridSize;
            pos.z += (-0.5 + idz / grid.z) * gridSize;

            output.position = camera * transform * vec4(pos.xyz,1.0);
            output.fragPosition = vec4(0.5 + 0.5 * position.xyz,1.0 );
            `
        })

    }



}
