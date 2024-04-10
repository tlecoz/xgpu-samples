
import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { GraphicPipeline } from "./GraphicPipeline";
import { Graphics } from "./Graphics";



export class VectorGraphics_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {


        var shape = new Graphics();
        shape.moveTo(-2.2, -283.675, 0);
        shape.curveTo(-2.1, -283.625, 0, -2, -283.575, 0);
        shape.curveTo(55.45, -173.875, 0, 160.25, -66.125, 0);
        shape.curveTo(131.25, -58.795, 0, 102.25, -51.475, 0);
        shape.curveTo(155.45, 6.775, 0, 208.65, 65.025, 0);
        shape.curveTo(186.38, 75.455, 0, 164.1, 85.875, 0);
        shape.curveTo(216.98, 141.955, 0, 269.85, 198.025, 0);
        shape.curveTo(229, 215.475, 0, 177.85, 225.175, 0);
        shape.curveTo(104.88, 235.275, 0, 31.9, 245.375, 0);
        shape.curveTo(32.03, 264.525, 0, 32.15, 283.675, 0);
        shape.curveTo(1.2, 283.675, 0, -29.75, 283.675, 0);
        shape.curveTo(-30.42, 264.125, 0, -31.1, 244.575, 0);
        shape.curveTo(-156.6, 240.225, 0, -269.85, 201.225, 0);
        shape.curveTo(-215.75, 145.475, 0, -163.4, 84.825, 0);
        shape.curveTo(-187.55, 76.825, 0, -211.7, 68.825, 0);
        shape.curveTo(-152.5, 13.325, 0, -111.45, -49.975, 0);
        shape.curveTo(-137.92, -56.845, 0, -164.4, -63.725, 0);
        shape.curveTo(-122.85, -102.675, 0, -87.85, -147.475, 0);
        shape.curveTo(-83.15, -153.675, 0, -78.5, -159.875, 0);
        shape.curveTo(-73.9, -166.125, 0, -69.4, -172.475, 0);
        shape.curveTo(-66.3, -176.825, 0, -63.3, -181.225, 0);
        shape.curveTo(-60.3, -185.575, 0, -57.35, -189.925, 0);
        shape.curveTo(-54.45, -194.275, 0, -51.6, -198.625, 0);
        shape.curveTo(-48.8, -202.925, 0, -46, -207.225, 0);
        shape.curveTo(-20.7, -246.675, 0, -2.2, -283.675, 0);

        var graphicPipeline = new GraphicPipeline(renderer);
        graphicPipeline.addGraphics(shape);
        graphicPipeline.setGraphicById(0);


        graphicPipeline.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {

            const { transform } = graphicPipeline.resources;

            transform.scaleX = transform.scaleY = transform.scaleZ = 400;

            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        })


        renderer.addPipeline(graphicPipeline);
    }
}