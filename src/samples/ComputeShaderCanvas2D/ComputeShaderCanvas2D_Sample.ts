import { BuiltIns, ComputePipeline, FloatBuffer, Vec2, Vec2Buffer, VertexBufferIO, XGPU } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";

export class ComputeShaderCanvas2D_Sample extends Sample {



    constructor() {
        const useCanvas2D: boolean = true;
        super(useCanvas2D);
    }

    public async startCanvas2D(ctx: CanvasRenderingContext2D): Promise<void> {
        if (!XGPU.ready) await XGPU.init();

        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const nbParticle = 200;

        const pipeline = new ComputePipeline();
        pipeline.debug = "ComputeShaderCanvas2D_Sample"

        const resources = pipeline.initFromObject({
            particles: new VertexBufferIO({
                radius: new FloatBuffer(),
                life: new FloatBuffer(),
                position: new Vec2Buffer(),
                speed: new Vec2Buffer(),
            }),

            screen: new Vec2(ctx.canvas.width, ctx.canvas.height),
            global_id: BuiltIns.computeInputs.globalInvocationId,
            computeShader: `
                let nbParticle = arrayLength(&particles);
                let index = global_id.x;
                if(index >= nbParticle){
                    return;
                }
                
                var p:Particles = particles[index];
                
                var px = p.position.x + p.speed.x;
                var py = p.position.y + p.speed.y;

                
                if(px <= p.radius){
                    px = p.radius;
                    p.speed.x *= -1.0;
                }
                
                if(py <= p.radius){
                    py = p.radius;
                    p.speed.y *= -1.0;
                }

                if(px >= screen.x - p.radius){
                    px = screen.x - p.radius;
                    p.speed.x *= -1.0;
                }
                
                if(py >= screen.y - p.radius){
                    py = screen.y - p.radius;
                    p.speed.y *= -1.0;
                }

                p.position.x = px;
                p.position.y = py;

                if(p.life > 0){
                    p.life -= 1.0;
                   
                }
                               
                var nbCollision = 0.0;
                var sumAngle = 0.0;

                for(var i=0u;i<nbParticle;i++){
                    if(i == index){
                        continue;
                    } 

                    var other = particles[i];

                    var minDist = p.radius + other.radius;
                    var dist = distance(p.position , other.position);
                    if(dist < minDist){
                        
                        var dx = other.position.x - p.position.x;
                        var dy = other.position.y - p.position.y;
                        var angle = atan2(dy,dx) + 3.14159;
                        
                        sumAngle += angle;
                        nbCollision += 1.0;

                        angle += 3.14159;
                        var d = minDist + (minDist - dist);
                        other.speed.x = cos(angle);
                        other.speed.y = sin(angle);
                        other.position.x = p.position.x + other.speed.x * d;
                        other.position.y = p.position.y + other.speed.y * d;
                        other.life = 50.0;
                    }
                }

                if(nbCollision > 0.0){
                    sumAngle /= nbCollision;
                    p.speed.x = cos(sumAngle);
                    p.speed.y = sin(sumAngle);
                    p.life = 50.0;

                   
                }
                
                particles_out[index] = p;

                
                
                
               
                `
            ,

        });

        let frameData = null;
        (resources.particles as VertexBufferIO).createVertexInstances(nbParticle, (_instanceId: number) => {
            let angle = Math.random() * 3.1416 * 2;
            let radius = 3 + Math.random() * 12;
            return {
                radius: [radius],
                position: [radius + (w - radius * 2) * Math.random(), radius + (h - radius * 2) * Math.random()],
                speed: [Math.cos(angle), Math.sin(angle)],
                life: [0]
            }
        });

        (resources.particles as VertexBufferIO).onOutputData = (datas: ArrayBuffer) => frameData = new Float32Array(datas);




        let animate = () => {
            if (ctx.canvas.style.display === "none") return;

            pipeline.update()

            if (frameData) {


                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, w, h);
                (resources.particles as VertexBufferIO).getVertexInstances(frameData, (o: any) => {

                    /*
                    Be carefull : the object received from this function is reused for every call.
                    
                    In the context of this sample, I need the object just the time to draw the element on the canvas so it doesn't matter ;
                    but with arbitrary-data in mind, not graphics , you will probably prefer to be able to manipulate the object as usual.
                    
                    You can do it by cloning the object like that : 

                    let clone = {};
                    for (let z in o) clone[z] = { ...o[z] };

                    */

                    ctx.beginPath();
                    ctx.fillStyle = "rgb(255," + (255 - 255 * (o.life.x / 50)) + "," + (255 - 255 * (o.life.x / 50)) + ")";
                    ctx.ellipse(o.position.x, o.position.y, o.radius.x, o.radius.x, 0, 0, Math.PI * 2);
                    ctx.fill();
                })

                frameData = null;
                pipeline.nextFrame()

            }
            requestAnimationFrame(animate);
        }


        animate();
        pipeline.nextFrame()
    }



}