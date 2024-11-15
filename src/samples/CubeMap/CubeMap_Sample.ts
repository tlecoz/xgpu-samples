import { GPURenderer, RenderPipeline } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { CubeMap } from "./CubeMap";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";

export class CubeMap_Sample extends Sample {


    protected async start(renderer: GPURenderer): Promise<void> {

        const loadImages = (urls: string[]): Promise<ImageBitmap[]> => {
            return new Promise(async (resolve) => {
                const promises = urls.map((src) => {
                    const img = document.createElement("img");
                    img.src = src;
                    return img.decode().then(() => createImageBitmap(img))
                })
                resolve(await Promise.all(promises));
            })
        }


        const sides: ImageBitmap[] = await loadImages([
            "../../assets/cube/posx.jpg",
            "../../assets/cube/negx.jpg",
            "../../assets/cube/posy.jpg",
            "../../assets/cube/negy.jpg",
            "../../assets/cube/posz.jpg",
            "../../assets/cube/negz.jpg",
        ])


        let now = new Date().getTime();
        const pipeline = new CubeMap(sides);
        renderer.addPipeline(pipeline).addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {
            let time = (new Date().getTime() - now) / 1000;
            const { transform }: { transform: ModelViewMatrix } = pipeline.resources;
            transform.scaleX = transform.scaleY = transform.scaleZ = 10000 * Math.max(pipeline.renderer.width, pipeline.renderer.height) / 512;
            transform.rotationY = Math.sin(time * 0.15 + 1) * Math.PI;
            transform.rotationX = -0.15 + Math.cos(time * 0.4) * Math.PI * 0.1;
        })
    }
}