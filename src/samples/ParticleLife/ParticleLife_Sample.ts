import { BuiltIns, ComputePipeline, Float, FloatBuffer, GPURenderer,  RenderPipeline, Uint, Vec3Buffer, Vec4, Vec4Array, VertexBufferIO } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { Camera } from "../ColorCube/Camera";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";
import { MouseControler } from "../MouseToy/MouseControler";

export class ParticleLife_Sample extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {


       

        const props = {
            dt: new Float(0.000011185799849044997),
            frictionHalfTime: new Float(0.00013869999384041876),
            rMax: new Float(0.34057000279426575),
            forceFactor: new Float(3.2000067234039307),
        }


        const nbParticles = new Uint(10000);
        const nbColor = new Float(10);
       


        const particles = new VertexBufferIO({
            position:new Vec3Buffer(),
            velocity:new Vec3Buffer(),
            color:new FloatBuffer(),
        });

        particles.createVertexInstances(nbParticles.x,(/*instanceId:number*/)=>{
            return {
                position:[Math.random() * 2.0 - 1.0,Math.random() * 2.0 - 1.0,Math.random() * 2.0 - 1.0],
                velocity:[0,0,0],
                color:[Math.floor(Math.random() * nbColor.x)],
            }
        })
       
        
        const colorValues:Vec4[] = []; //webgpu can only handle array of vec4 / ivec4 / uvec4
        for(let i=0;i<(nbColor.x * nbColor.x);i++) colorValues[i] = new Vec4(Math.random()*2 - 1,0,0,0);
        const colors = new Vec4Array(colorValues);

        const computePipeline = new ComputePipeline();
        computePipeline.initFromObject({
            ...props,
            particles,
            colors,
            nbColor,
            nbParticles,
            globalId:BuiltIns.computeInputs.globalInvocationId,
            computeShader:{
                constants:`
                fn force(r:f32,a:f32)->f32{
                    let beta = 0.66;
                    if(r < beta){
                        return r/beta - 1.0;
                    }else if(beta < r && r < 1.0){
                        return a * (1.0 - abs(2.0 * r - 1.0 - beta) / (1.0 - beta));
                    }
                    return 0.0;
                }

               
                
                `,
                main:`


                let particleId = globalId.x;
                let color = particles[particleId].color;
                let colorIndex = floor(color * nbColor);
                let frictionFactor = pow(0.5,dt/frictionHalfTime);

                var position = particles[particleId].position;
                var velocity = particles[particleId].velocity;  
                var totalForce = vec3(0.0);
                

                var p:Particles;
                var r:f32;
                
                for(var j=0u;j<nbParticles;j++){
                    if(j == particleId){
                        continue;
                    }

                    p = particles[j];
                    var rd = p.position - position;
                    r = length(rd);

                    if(r > 0 ){//} && r < rMax){
                    let f = force(r/rMax,colorIndex + p.color);
                    rd *= f/r;
                    totalForce += rd; 
                    
                    }

                }
                
                totalForce *= rMax * forceFactor;
                

                velocity *= frictionFactor;
                velocity += totalForce * dt;

                
                position += velocity;
                
                if(position.x < 0.0){
                    position.x += 1.99;
                }
            
                if(position.y < 0.0){
                    position.y += 1.99;
                }
                position %= 2.0;

                particles_out[particleId].position = position;
                particles_out[particleId].velocity = velocity; 
                particles_out[particleId].color = color; 

                
                
                `
            }
        })
        
        
        
        const renderPipeline = new RenderPipeline();
        renderPipeline.initFromObject({
        topology:"point-list",
        particles,
        camera: new Camera(),
        transform: new ModelViewMatrix(),
        depthTest:false,
        vertexCount:1,
        instanceCount:nbParticles.x,
        vertexId:BuiltIns.vertexInputs.vertexIndex,
        col:BuiltIns.vertexOutputs.Float,
        nbColor:nbColor.clone(),
        vertexShader:{
            constants:`
            const size = 0.005;
            const triangle = array<vec2<f32>,3>(
                vec2(-size,-size),
                vec2(size,-size),
                vec2( 0.0 ,size),
            );
            `,
            main:`
            let angle = -atan2(velocity.x,velocity.y);
            let vertex = triangle[vertexId];
            let pos = vec2(
                (vertex.x * cos(angle)) - (vertex.y * sin(angle)),
                (vertex.x * sin(angle)) + (vertex.y * cos(angle))
            );
            output.position = camera * transform * vec4(-1.0+ position.xy,position.z    ,1.0);
            output.col = color;
            `
        },
        fragmentShader:{
            constants:`
            fn hslToRgb(h:f32, s:f32, l:f32)->vec3<f32> {
                let c = (1.0 - abs(2.0 * l - 1.0)) * s; // Chroma
                let x = c * (1.0 - abs((h / 60.0) % 2.0 - 1.0));
                let m = vec3(l - c / 2.0);

            

                if (0.0 <= h && h < 60.0) {
                    return vec3(c, x, 0.0) + m;
                } else if (60.0 <= h && h < 120.0) {
                    return vec3(x, c, 0.0) + m;
                } else if (120.0 <= h && h < 180.0) {
                    return vec3(0.0, c, x) + m;
                } else if (180.0 <= h && h < 240.0) {
                    return vec3(0.0, x, c) + m;
                } else if (240.0 <= h && h < 300.0) {
                    return vec3(x, 0.0, c) + m;
                }

                return vec3(c, 0.0, x) + m;
            }
            `,
            main:`
            output.color = vec4(hslToRgb(col * (540.0 / nbColor),1.0,0.5),1.0);
            `
        }
        })

        const mouse = new MouseControler();
        mouse.initCanvas(renderer.canvas);

        const transform = renderPipeline.resources.transform;
        renderPipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN,()=>{
            computePipeline.nextFrame();
            const smooth = 0.05;

            transform.rotationY -= (transform.rotationY - (mouse.x * Math.PI * 0.35)) * smooth;
            transform.rotationX -= (transform.rotationX - (mouse.y * Math.PI * 0.35)) * smooth;
            transform.rotationX += 0.001;
            transform.rotationY += 0.002;
            transform.z = -2
        })

        

        /*
        dt: new Float(0.00000618),
            frictionHalfTime: new Float(0.00003),
            rMax: new Float(1.618),
            forceFactor: new Float(1.618),
        */

        renderer.addPipeline(renderPipeline);
        
        this.params = [
            { name: "dt", min: 0.00000618, max: 0.0000618, object: props.dt },
            { name: "frictionHalfTime", min: 0.00001, max: 0.001, object: props.frictionHalfTime },
            { name: "rMax", min: 0.001, max: 1.618, object: props.rMax },
            { name: "forceFactor", min: 0.00001, max: 10.0, object: props.forceFactor },
          
           
        ];
        

        renderPipeline.addEventListener(RenderPipeline.ON_ADDED_TO_RENDERER, () => {
            const camera: Camera = renderPipeline.resources.camera as Camera;
            camera.screenW = this.renderer.width;
            camera.screenH = this.renderer.height;
        }, true)

    }

}