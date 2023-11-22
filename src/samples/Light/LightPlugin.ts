import { BuiltIns, Matrix4x4, PipelinePlugin, RenderPipeline, Vec3, Vec3Buffer } from "xgpu";
import { Light } from "./Light";

export class LightPlugin extends PipelinePlugin {

    /*
    A PipelinePlugin allows to "plug" shader resources AND shader code into an existing RenderPipeline. 
    Because the shader-code need to use the same variable name in the plugin and in the original pipeline, 
    we defined what variable from original pipeline will be used in the plugin using the "required" argument in the constructor
    */

    constructor(target: RenderPipeline, required: {
        position: Vec3Buffer,
        normal: Vec3Buffer,
        cameraMatrix: Matrix4x4,
        modelMatrix: Matrix4x4
    }) {

        super(target, required);

        let screenW = 1;
        let screenH = 1;
        let light; Light;
        if (target.renderer) {
            screenW = target.renderer.width;
            screenH = target.renderer.height;
        } else {

            target.addEventListener(RenderPipeline.ON_ADDED_TO_RENDERER, () => {
                light.createProjectionMatrix(target.renderer.width, target.renderer.height)
            }, true)
        }
        light = new Light(screenW, screenH)


        this.bindgroupResources = {
            light,
        }


        this.vertexShader = {
            outputs: {
                fragNorm: BuiltIns.vertexOutputs.Vec3,
                fragPos: BuiltIns.vertexOutputs.Vec3,
                transformedLightPos: BuiltIns.vertexOutputs.Vec3
            },
            main: `
            output.fragPos = output.position.xyz;
            output.fragNorm = ${this.requiredNames.normal};
            output.transformedLightPos = vec4(   ${this.requiredNames.modelMatrix} * vec4(light.position,1.0)).xyz;
            
            `
        }

        const shaderCode: string[] = [];

        /*
        I decompose the code in 2 parts because LightPlugin can be used as base class to handle shadow 
        */

        shaderCode[0] = `var visibility = 1.0;`
        shaderCode[1] = `
        let lambertFactor = max(dot(normalize(transformedLightPos-fragPos), fragNorm), 0.0);
        let lightingFactor = vec3(
           min(light.ambient.r + lambertFactor * visibility, 1.0),
           min(light.ambient.g + lambertFactor * visibility, 1.0),
           min(light.ambient.b + lambertFactor * visibility, 1.0),
       );
       output.color *= vec4(lightingFactor * light.color.rgb, 1.0);
        `

        this.fragmentShader = {
            inputs: {
                frontFacing: BuiltIns.fragmentInputs.frontFacing
            },
            main: shaderCode
        }
    }

    public get position(): Vec3 { return this.bindgroupResources.light.items.position; }
    public get color(): Vec3 { return this.bindgroupResources.light.items.color };
    public get ambient(): Vec3 { return this.bindgroupResources.light.items.ambient }
    public get light(): Light { return this.bindgroupResources.light; }

}