import { BuiltIns, Float, GPURenderer, ImageTexture, RenderPipeline, ShaderType, TextureSampler } from "xgpu";
import { Cube } from "../ColorCube/Cube";
import { SoundSpectrumBuffer } from "./SoundSpectrumBuffer";

export class CubeGridSpectrum extends Cube {


    constructor(renderer: GPURenderer, image: ImageBitmap) {

        const gridSize: number = 32;
        const spectrumBuffer = new SoundSpectrumBuffer("amplitude", gridSize * gridSize);
        spectrumBuffer.init("../../../../assets/audio.wav", () => {
            spectrumBuffer.volume = 1.;
            spectrumBuffer.play();
        })

        super(renderer, {
            cullMode: "back",
            instanceCount: spectrumBuffer.length,
            gridSize: new Float(gridSize),
            spectrumBuffer,
            instanceId: BuiltIns.vertexInputs.instanceIndex,
            textureSampler: new TextureSampler({ magFilter: "nearest", minFilter: "nearest" }),
            image: new ImageTexture({ source: image }),
            vertexShader: {
                outputs: {
                    fragUV: ShaderType.Vec2,
                    dist: ShaderType.Float,
                },
                constants: `
                fn createMatrix( x:f32,y:f32,z:f32, sx:f32, sy:f32, sz:f32)->mat4x4<f32> {
                    let matrix = mat4x4<f32>(
                        sx, 0.0, 0.0, 0.0,
                        0.0, sy, 0.0, 0.0,
                        0.0, 0.0, sz, 0.0,
                        x, y, z, 1.0);
                    return matrix;
                }
                `,
                main: `
                let id = f32(instanceId);
                let idx = id % gridSize;
                let idy = floor(id / gridSize);
               
                var px = -0.5 + idx / (gridSize-1.0) ;
                var py = -0.5 + idy / (gridSize-1.0) ;

                let pct = amplitude / 256.0;
                
                let size =  200 + 200.0  * pct ;
                let quadSize = size / gridSize;// -10.0*pct;
                let depthMax = 100.0 * sin(pct * 1.5708)*0.5;
                
                output.position = camera * transform * createMatrix(px*size,py*size,0.0, quadSize,quadSize,depthMax)  *  position;
                output.fragUV = vec2(0.5+ position.xy/size*quadSize);
                output.fragUV += vec2(px,py);

                //cheap light effect 
                output.dist = 1.0-distance(output.position, vec4(0.0,0.0,size*2.0,1.0))/(size * 3.0 * ${(renderer.width / 512).toFixed(2)});
               
            `}
            , fragmentShader: `output.color = vec4( textureSample(image, textureSampler, fragUV).rgb * dist * 2.0  , 1.0);`
        })
    }


}