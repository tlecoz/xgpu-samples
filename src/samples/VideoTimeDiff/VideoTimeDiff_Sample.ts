import { AlphaBlendMode, BuiltIns, GPURenderer, ImageTexture, RenderPipeline, TextureSampler, Vec2, VideoTexture } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";

export class VideoTimeDiff_Sample extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {

        const getVideo = async (url: string) => {
            const video = document.createElement("video");
            video.src = url;
            //video.currentTime = 180
            video.loop = true;
            video.muted = true;
            video.preload = "none";
            await video.play();
            return video;
        }

        const video = await getVideo("../../assets/video.webm")

        video.width = video.videoWidth;
        video.height = video.videoHeight;
        const bmp = await createImageBitmap(video);




        const ratio = new Vec2(1, video.videoHeight / video.videoWidth);

        if (video.videoHeight > video.videoWidth) {
            ratio.x = video.videoWidth / video.videoHeight;
            ratio.y = 1;
        }

        const oldFrame = new ImageTexture({ source: bmp });

        const dif = 30;
        let nb = 0;


        let current: ImageBitmap;
        const bitmaps: ImageBitmap[] = [];


        const videoUpdate = async () => {

            current = await createImageBitmap(video);

            bitmaps.push(current);

            if (nb++ >= dif) {

                (oldFrame.source as ImageBitmap).close();
                oldFrame.source = bitmaps.shift();
            }
            video.requestVideoFrameCallback(videoUpdate)

        }
        video.requestVideoFrameCallback(videoUpdate)


        const pipeline = new RenderPipeline();
        pipeline.initFromObject({
            mediaSampler: new TextureSampler(),
            oldFrame,
            currentFrame: new VideoTexture({ source: video }),
            vertexCount: 6,
            ratio,
            blendMode: new AlphaBlendMode(),
            vertexId: BuiltIns.vertexInputs.vertexIndex,
            uv: BuiltIns.vertexOutputs.Vec2,

            vertexShader: {
                constants: `
                const pos = array<vec2<f32>,6>(
                    vec2(-1.0, -1.0),
                    vec2(1.0, -1.0),
                    vec2(-1.0, 1.0),
                    vec2(1.0, -1.0),
                    vec2(1.0, 1.0),
                    vec2(-1.0, 1.0),
                 );
                `,
                main: `
                 output.position = vec4( pos[vertexId] * ratio,0.0,1.0);
                 output.uv = (pos[vertexId] + 1.0)  * 0.5;
                `
            },
            fragmentShader: `
                var old = textureSample(oldFrame,mediaSampler,uv);
                var current = textureSampleBaseClampToEdge(currentFrame, mediaSampler, vec2(uv.x,1.0-uv.y));
                
                
                let dx = current.x - old.x;
                let dy = current.y - old.y;
                let dz = current.z - old.z;
                var d =  (sqrt(dx*dx+dy*dy+dz*dz) ) ;                
                
                if(d > 0.25  ){
                   
                    
                    //output.color = vec4(1.0,d,d,1.0);
                   
                 }else{
                    //output.color =  current;
                }

                
               

                let val = abs(current.b*(1.0/255.0) - old.b*(1.0/255.0)) * 3000.0 ;
                output.color =  vec4( current.xyz * val ,1.0);
                //output.color =  vec4( current.xyz / val ,1.0);


               
               /*
                if(d > 0.35  ){
                    //if(uv.x > 0.5){
                       // output.color =  vec4(1.0) ;
                    //}  else{
                        output.color = textureSampleBaseClampToEdge(currentFrame, mediaSampler, vec2(uv.x,1.0-uv.y));;  
                    //}

                }else{
                    //output.color = current;
                }   
                */
                
            `
        });




        renderer.addPipeline(pipeline);
    }



}