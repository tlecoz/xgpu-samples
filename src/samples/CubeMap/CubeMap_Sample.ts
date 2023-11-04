import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { CubeMap } from "./CubeMap";

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

        const cube = new CubeMap(renderer, sides);
        renderer.addPipeline(cube);

        let now = new Date().getTime();
        cube.onDrawEnd = () => {
            let time = (new Date().getTime() - now) / 1000;
            cube.transform.scaleX = cube.transform.scaleY = cube.transform.scaleZ = 10000 * Math.max(window.innerWidth, window.innerHeight) / 512;;
            cube.transform.rotationY = Math.sin(time * 0.15 + 1) * Math.PI;
            cube.transform.rotationX = -0.15 + Math.cos(time * 0.4) * Math.PI * 0.1;
        }
    }
}