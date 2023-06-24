import { GPURenderer, HeadlessGPURenderer, RenderPipeline } from "xgpu";
import { Dimension } from "./Dimension";
import { IRenderer } from "xgpu/src/xGPU/IRenderer";

export class ResizableRenderPipeline extends RenderPipeline {

    protected screenDim: Dimension;

    /*
    A base class for RenderPipeline that will be used in every samples. 
    It only contains a property 'screenDim' that contains the dimension of the screen 
    and add a line at the end of the vertexShader of the child-class that use this property 
    to fix the aspect ratio of the rendering output.     
    */

    constructor(renderer: IRenderer, bgColor?: { r: number, g: number, b: number, a: number }) {
        super(renderer, bgColor);
        this.screenDim = new Dimension(renderer.width, renderer.height);
    }

    public initFromObject(o: any): any {

        return super.initFromObject({
            screenDim: this.screenDim,
            ...o
        })
    }

    public buildGpuPipeline() {


        /*
        VertexShader.main is a ShaderNode. 
        A ShaderNode is an object that can store text and others ShaderNodes. 
        By default, the childNodes are read AFTER the parentNode.
        (you can change this behaviour by using ShaderNode.executeSubNodeAfterCode = false)

        In our case, I add a line at the end of my vertexShader that use my property 'screenDim' 
        to maintain a correct aspect-ratio
        */
        this.vertexShader.main.createNode(`
            if(screenDim.width > screenDim.height){
                output.position = vec4(output.position.x * (screenDim.height/screenDim.width) , output.position.yzw);
            }else{
                output.position = vec4(output.position.x , output.position.y * (screenDim.width/screenDim.height) , output.position.zw);
            }
            
        `)
        return super.buildGpuPipeline();
    }

    public update() {
        if (this.renderer.dimensionChanged) {

            this.screenDim.width = this.renderer.width;
            this.screenDim.height = this.renderer.height;
        }
        super.update();
    }
}