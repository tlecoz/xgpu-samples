import { BuiltIns, ComputePipeline, Float, Vec2, Vec4, VertexAttribute, VertexBufferIO, XGPU } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";

export class ComputeShaderCanvas2D_Sample extends Sample {

    private ctx: CanvasRenderingContext2D;
    private pipeline: ComputePipeline;
    private frameData: Float32Array;

    constructor() {
        const useCanvas2D: boolean = true;
        super(useCanvas2D);
    }


    private createParticleDatas(nb: number): Float32Array {
        const w = this.ctx.canvas.width;
        const h = this.ctx.canvas.height;

        let radius = 10;
        let life = 0;
        let angle;

        const datas = [];
        for (let i = 0; i < nb; i++) {
            angle = Math.random() * 3.1416 * 2;
            radius = 3 + Math.random() * 12;
            datas[i * 6] = radius;
            datas[i * 6 + 1] = life;
            datas[i * 6 + 2] = radius + (w - radius * 2) * Math.random(); //position x
            datas[i * 6 + 3] = radius + (h - radius * 2) * Math.random(); //position y
            datas[i * 6 + 4] = Math.cos(angle); //speed x
            datas[i * 6 + 5] = Math.sin(angle); //speed y  
        }
        return new Float32Array(datas);
    }


    public async startCanvas2D(ctx: CanvasRenderingContext2D): Promise<void> {


        console.log("ctx = ", ctx);

        if (!XGPU.ready) await XGPU.init();

        super.startCanvas2D(ctx);
        this.ctx = ctx;

        const nbParticle = 200;
        const time: Float = new Float(0);
        const computePipeline = this.pipeline = new ComputePipeline();

        computePipeline.initFromObject({

            particles: new VertexBufferIO({
                radius: VertexAttribute.Float(),
                //life: VertexAttribute.Float(1),
                position: VertexAttribute.Vec2(),
                speed: VertexAttribute.Vec2(),
            }, { datas: this.createParticleDatas(nbParticle) }),
            screen: new Vec4(ctx.canvas.width, ctx.canvas.height),
            time,

            global_id: BuiltIns.computeInputs.globalInvocationId,

            computeShader: {
                main: `
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

                /*
                if(p.life > 0){
                    p.life -= 1.0;
                }*/
                
                
               
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
                        //other.life = 50.0;
                    }
                }

                if(nbCollision > 0.0){
                    sumAngle /= nbCollision;
                    p.speed.x = cos(sumAngle);
                    p.speed.y = sin(sumAngle);
                    //p.life = 50.0;
                }
                
                

                particles_out[index].radius = p.radius;
                particles_out[index].position =  p.position;
                particles_out[index].speed = p.speed;
                //particles_out[index].life = p.life;
                `
            },


        })



        let n = 0;
        computePipeline.onReceiveData = (datas: Float32Array) => {
            this.frameData = datas;
            console.log(computePipeline.resources.particles.buffers[0].attributeDescriptor)
        }

        this.pipeline.nextFrame()


    }


    public update(): void {

        const ctx = this.ctx;
        if (!ctx) return;


        if (this.frameData) {

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            const datas = this.frameData;


            let radius, life, x, y;
            for (let i = 0; i < datas.length; i += 6) {
                radius = datas[i];
                life = (1.0 - (datas[i + 1] / 50)) * 255;

                x = datas[i + 2];
                y = datas[i + 3];

                ctx.beginPath();
                ctx.fillStyle = "rgb(255," + life + "," + life + ")";
                ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
                ctx.fill();

            }

            this.frameData = null;
            this.pipeline.nextFrame()
        }

    }

}