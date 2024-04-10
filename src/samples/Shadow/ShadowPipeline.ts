import { RenderPipeline, IndexBuffer, Matrix4x4, Vec3Buffer } from "xgpu";

export class ShadowPipeline extends RenderPipeline {

    constructor(required: {
        indexBuffer: IndexBuffer,
        position: Vec3Buffer,
        model: Matrix4x4,
        lightProjection: Matrix4x4,
    }, depthTextureSize: number = 1024) {
        super(null);

        const resources: any = { indexBuffer: required.indexBuffer };

        /*
        VertexAttributes are stored in VertexBuffers and primitiveTypes like Vec3 or Matrix4x4 are stored in UniformBuffers.
        A VertexBuffer can store multiple VertexAttributes and an UniformBuffer can store multiple primitiveTypes.
        
        because we want to reuse a "position" attribute and some primitive ("model" & "lightProjection"), we actually need to share
        the matching vertexBuffer and uniformBuffer(s).     
        */
        resources.buffer = required.position.vertexBuffer;

        //Two uniforms may share the same uniformBuffer but we can't pass the uniformBuffer twice to the shader, so we must check
        //and pass the correct amount of uniformBuffer with the correct uniform's name 
        let model: string, lightProjection: string;
        if (required.model.uniformBuffer === required.lightProjection.uniformBuffer) {
            resources.uniforms = required.model.uniformBuffer;
            model = "uniforms." + required.model.name;
            lightProjection = "uniforms." + required.lightProjection.name;

        } else {
            resources.model = required.model.uniformBuffer;
            resources.light = required.lightProjection.uniformBuffer;
            model = "model." + required.model.name;
            lightProjection = "light." + required.lightProjection.name;
        }

        this.initFromObject({
            ...resources,
            useDepthTexture: true,
            depthTextureSize,
            vertexShader: `output.position = ${lightProjection} * ${model} *  vec4(${required.position.name} , 1.0);`

        });


    }

}