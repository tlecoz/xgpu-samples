import { BuiltIns, ComputePipeline, Float, GPURenderer, RenderPipeline, Vec2Buffer, VertexBufferIO } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";

export class ComputeBoids_Sample extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {


        const nbParticles = 5000;

        const props = {
            deltaT: new Float(0.04),
            rule1Distance: new Float(0.1),
            rule2Distance: new Float(0.025),
            rule3Distance: new Float(0.025),
            rule1Scale: new Float(0.02),
            rule2Scale: new Float(0.05),
            rule3Scale: new Float(0.05),
        }


        const particles: VertexBufferIO = new VertexBufferIO({
            position: new Vec2Buffer(),
            velocity: new Vec2Buffer()
        })

        particles.createVertexInstances(nbParticles, (/*instanceId: number*/) => {
          

            return {
                position: [2 * (Math.random() - 0.5), 2 * (Math.random() - 0.5)],
                velocity: [2 * (Math.random() - 0.5) * 0.1, 2 * (Math.random() - 0.5) * 0.1]
            }
        })



        const computePipeline: ComputePipeline = new ComputePipeline();
        computePipeline.useRenderPipeline = true;
        computePipeline.initFromObject({
            ...props,
            particles,
            invocationId: BuiltIns.computeInputs.globalInvocationId,
            computeShader: `
            var index = invocationId.x;
            var vPos = particles[index].position;
            var vVel = particles[index].velocity;
            var cMass = vec2(0.0);
            var cVel = vec2(0.0);
            var colVel = vec2(0.0);
            var cMassCount = 0u;
            var cVelCount = 0u;
            var pos : vec2<f32>;
            var vel : vec2<f32>;
        
            for (var i = 0u; i < arrayLength(&particles); i++) {
                if (i == index) {
                    continue;
                }
            
                pos = particles[i].position.xy;
                vel = particles[i].velocity.xy;
                if (distance(pos, vPos) < rule1Distance) {
                    cMass += pos;
                    cMassCount++;
                }
                if (distance(pos, vPos) < rule2Distance) {
                    colVel -= pos - vPos;
                }
                if (distance(pos, vPos) < rule3Distance) {
                    cVel += vel;
                    cVelCount++;
                }
            }

            if (cMassCount > 0) {
                cMass = (cMass / vec2(f32(cMassCount))) - vPos;
            }
            
            if (cVelCount > 0) {
                cVel /= f32(cVelCount);
            }

            vVel += (cMass * rule1Scale) + (colVel * rule2Scale) + (cVel * rule3Scale);
        
            // clamp velocity for a more pleasing simulation
            vVel = normalize(vVel) * clamp(length(vVel), 0.0, 0.1);
            // kinematic update
            vPos = vPos + (vVel * deltaT);
            // Wrap around boundary
            if (vPos.x < -1.0) {
                vPos.x = 1.0;
            }
            if (vPos.x > 1.0) {
                vPos.x = -1.0;
            }
            if (vPos.y < -1.0) {
                vPos.y = 1.0;
            }
            if (vPos.y > 1.0) {
                vPos.y = -1.0;
            }
            // Write back
            particles_out[index].position = vPos;
            particles_out[index].velocity = vVel;
            `
        })


        const renderPipeline = new RenderPipeline();
        renderPipeline.initFromObject({
            particles,
            vertexCount: 3,
            instanceCount: nbParticles,
            vertexId: BuiltIns.vertexInputs.vertexIndex,
            vertexShader: {
                constants: `
                const size = 0.0025;
                const triangleVertex = array<vec2<f32>,3>(
                    vec2(-size,-size*2),
                    vec2(size,-size*2),
                    vec2( 0.0 ,size*2),
                );
                `,
                main: `
                let angle = -atan2(velocity.x,velocity.y);
                let vertex = triangleVertex[vertexId];
                let pos = vec2(
                    (vertex.x * cos(angle)) - (vertex.y * sin(angle)),
                    (vertex.x * sin(angle)) + (vertex.y * cos(angle))
                );
                output.position = vec4(pos + position,0.0,1.0);
                `
            },
            fragmentShader: `output.color = vec4(1.0);`
        })

        renderPipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            computePipeline.nextFrame();
        })

        renderer.addPipeline(renderPipeline);

        this.params = [
            { name: "deltaT", min: 0.01, max: 0.5, object: props.deltaT },
            { name: "rule1Distance", min: 0.001, max: 0.15, object: props.rule1Distance },
            { name: "rule2Distance", min: 0.001, max: 0.15, object: props.rule2Distance },
            { name: "rule3Distance", min: 0.001, max: 0.15, object: props.rule3Distance },
            { name: "scale1Distance", min: 0.001, max: 0.15, object: props.rule1Scale },
            { name: "scale2Distance", min: 0.001, max: 0.15, object: props.rule2Scale },
            { name: "scale3Distance", min: 0.001, max: 0.15, object: props.rule3Scale },
        ];


    }

}