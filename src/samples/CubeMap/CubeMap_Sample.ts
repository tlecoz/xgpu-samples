import { GPURenderer } from "xgpu";
import { Sample } from "../HelloTriangle/Sample";
import { CubeMap } from "./CubeMap";

export class CubeMap_Sample extends Sample {

    protected async loadSides(urls: string[]): Promise<ImageBitmap[]> {

        return new Promise(async (onResolve: (v: any) => void, onError: (e: any) => void) => {

            const promises = urls.map((src) => {
                const img = document.createElement("img");
                img.src = src;
                return img.decode().then(() => createImageBitmap(img))
            })

            onResolve(await Promise.all(promises));

        })
    }

    protected async start(renderer: GPURenderer): Promise<void> {


        const sides: ImageBitmap[] = await this.loadSides([
            "../../assets/cube/posx.jpg",
            "../../assets/cube/negx.jpg",
            "../../assets/cube/posy.jpg",
            "../../assets/cube/negy.jpg",
            "../../assets/cube/posz.jpg",
            "../../assets/cube/negz.jpg",
        ])

        const { bmp } = this.medias;
        const t = [bmp, bmp, bmp, bmp, bmp, bmp]

        const cube = new CubeMap(renderer, sides);
        renderer.addPipeline(cube);


    }
}