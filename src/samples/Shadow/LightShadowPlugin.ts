import { RenderPipeline, Matrix4x4, TextureSampler, BuiltIns, Vec3Buffer } from "xgpu";
import { LightPlugin } from "../Light/LightPlugin";
import { ShadowPipeline } from "./ShadowPipeline";


export class LightShadowPlugin extends LightPlugin {

    //This class create a plugin that handle shadow & light to an external renderPipeline that contains some required resources

    constructor(target: RenderPipeline, required: {
        position: Vec3Buffer,
        normal: Vec3Buffer,
        cameraMatrix: Matrix4x4,
        modelMatrix: Matrix4x4
    }, depthTextureSize: number = 1024) {

        super(target, required);

        const shadow = new ShadowPipeline({
            indexBuffer: target.drawConfig.indexBuffer,
            position: required.position,
            model: required.modelMatrix,
            lightProjection: this.bindgroupResources.light.items.projection
        }, depthTextureSize)
        shadow.debug = "shadow";
        target.renderer.addPipeline(shadow);


        this.bindgroupResources = {
            ...this.bindgroupResources,
            shadowMap: shadow.depthStencilTexture,
            shadowSampler: new TextureSampler({ compare: "less" })
        }


        this.vertexShader.outputs = {
            ...this.vertexShader.outputs,
            shadowPos: BuiltIns.vertexOutputs.Vec3
        }

        this.vertexShader.main += `
          // XY is in (-1, 1) space, Z is in (0, 1) space
          let posFromLight = light.projection  *  ${this.requiredNames.modelMatrix} * vec4(${this.requiredNames.position} , 1.0) ;
          
          // Convert XY to (0, 1)
          // Y is flipped because texture coords are Y-down.
          output.shadowPos = vec3(
              posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5),
              posFromLight.z
          );
      `


        this.fragmentShader.constants = `
        const shadowDepthTextureSize: f32 = ${Math.round(depthTextureSize)}.0; 
        `;

        (this.fragmentShader.main as string[])[0] = `
          // Percentage-closer filtering. Sample texels in the region
          // to smooth the result.
          var visibility = 0.0;
          let oneOverShadowDepthTextureSize = 1.0 / shadowDepthTextureSize;
          for (var y = -1; y <= 1; y++) {
              for (var x = -1; x <= 1; x++) {
              let offset = vec2<f32>(vec2(x, y)) * oneOverShadowDepthTextureSize;
 
              visibility += textureSampleCompare(
                  shadowMap, shadowSampler,
                  shadowPos.xy + offset, shadowPos.z - 0.01
              );
              }
          }
          visibility /= 9.0;
          
      `;

    }
}