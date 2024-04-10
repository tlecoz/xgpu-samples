import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { TexturedCube } from "./TexturedCube";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";


export class TexturedCube_Sample extends Sample {

    protected async start(renderer: GPURenderer): Promise<void> {



        const getImageBitmap = async (url: string) => {
            const img: any = await fetch(url);
            const blob = await img.blob();
            return await createImageBitmap(blob);
        }
        const image: ImageBitmap = await getImageBitmap("./assets/leaf.png");


        const cube = new TexturedCube(image);
        const transform: ModelViewMatrix = cube.resources.transform;
        transform.scaleX = transform.scaleY = transform.scaleZ = 150;
        cube.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            transform.rotationX += 0.01;
            transform.rotationY += 0.01;
            transform.rotationZ += 0.01;
        })
        renderer.addPipeline(cube)
    }
}