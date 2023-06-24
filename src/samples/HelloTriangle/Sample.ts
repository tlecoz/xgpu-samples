import { GPURenderer, PrimitiveType, XGPU } from "xgpu";

export class Sample {

    private static current: Sample = null;

    protected medias: {
        bmp: ImageBitmap,
        bmp2: ImageBitmap,
        video: HTMLVideoElement
    }

    public useCanvas2D: boolean;
    constructor(useCanvas2D: boolean = false) {
        this.useCanvas2D = useCanvas2D;
        XGPU.setPreferredCanvasFormat("bgra8unorm");
        console.clear();

        let div = document.createElement("div");
        div.style.backgroundColor = "#f0f";
        div.style.width = "30px";
        div.style.height = "30px";
        div.style.zIndex = "999999999999";
        div.style.position = "absolute";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.cursor = "pointer";
        document.body.appendChild(div);

        div.onclick = () => {
            XGPU.loseDevice();
        }

    }

    public params: { name: string, min?: number, max?: number, object: PrimitiveType, id?: number, round?: boolean }[] = [];
    protected destroyed: boolean = false;
    protected renderer: GPURenderer;

    protected _started: boolean = false;


    protected static canvas2d: HTMLCanvasElement;

    public init(canvas: HTMLCanvasElement, onReady?: (o: HTMLElement) => void) {
        if (this._started) return;
        this._started = true;



        if (Sample.current) Sample.current.destroy();
        XGPU.destroy();
        Sample.current = this;

        let renderer: GPURenderer;
        if (!this.useCanvas2D) {
            canvas.style.display = "flex";
            if (Sample.canvas2d) Sample.canvas2d.style.display = "none";
            renderer = this.renderer = new GPURenderer()
            renderer.initCanvas(canvas, "premultiplied").then(async () => {
                this.medias = await this.loadMedias();
                if (!renderer.canvas) return;
                this.start(renderer);
                if (onReady) onReady(canvas);
            })
        } else {
            canvas.style.display = "none";
            if (!Sample.canvas2d) {
                Sample.canvas2d = document.createElement("canvas");
                Sample.canvas2d.width = canvas.width;
                Sample.canvas2d.height = canvas.height;

                canvas.parentNode.appendChild(Sample.canvas2d);

            }
            Sample.canvas2d.style.display = "flex";

            this.startCanvas2D(Sample.canvas2d.getContext("2d"));
        }

        const animate = () => {
            if (this.destroyed) return;
            if (!this.useCanvas2D) renderer.update();
            this.update();
            requestAnimationFrame(animate);
        }

        animate();
    }
    public destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        if (this.renderer) this.renderer.destroy();
    }

    public update() { }

    private async loadMedias() {
        const loadImage = (url: string) => {
            return new Promise((resolve: (bmp: ImageBitmap) => void, error: (e: any) => void) => {
                const img = document.createElement("img");
                img.onload = () => {
                    createImageBitmap(img).then((bmp) => {
                        resolve(bmp);
                    })
                }
                img.onerror = (e) => {
                    error(e)
                }
                img.src = url;
            });
        }

        const loadVideo = (url: string) => {
            return new Promise(async (resolve: (video: HTMLVideoElement) => void, error: (e: any) => void) => {
                const video = document.createElement("video");
                video.src = url;
                video.loop = true;
                video.muted = true;
                video.onerror = error;
                await video.play();
                resolve(video)
            });
        }

        return new Promise(async (resolve: (o: any) => void, error: (e: any) => void) => {

            const bmp = await loadImage("../../assets/leaf.png")
            const bmp2 = await loadImage("../../assets/leaf2.png")
            const video = await loadVideo("../../assets/video.webm")

            resolve({ bmp, bmp2, video });
        })

    }

    public async startCanvas2D(ctx: CanvasRenderingContext2D): Promise<void> {
        const animate = () => {

            if (this.destroyed) return;
            this.update();
            requestAnimationFrame(animate);
        }
        animate();
    }

    protected async start(renderer: GPURenderer): Promise<void> {


    }

} 