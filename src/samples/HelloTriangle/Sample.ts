import { GPURenderer, PrimitiveType, XGPU } from "xgpu";

export class Sample {

    private static current: Sample = null;



    public useCanvas2D: boolean;
    constructor(useCanvas2D: boolean = false) {
        this.useCanvas2D = useCanvas2D;
        XGPU.setPreferredCanvasFormat("bgra8unorm");
        console.clear();
    }

    public params: { name: string, min?: number, max?: number, object: PrimitiveType, id?: number, round?: boolean }[] = [];
    protected destroyed: boolean = false;
    protected renderer: GPURenderer;
    protected canvas: HTMLCanvasElement;
    protected _started: boolean = false;


    protected static canvas2d: HTMLCanvasElement;

    public init(canvas: HTMLCanvasElement, onReady?: (o: HTMLElement) => void) {
        if (this._started) return;
        this._started = true;

        this.canvas = canvas;

        if (Sample.current) Sample.current.destroy();
        XGPU.destroy();
        Sample.current = this;

        let renderer: GPURenderer;
        if (!this.useCanvas2D) {
            canvas.style.display = "flex";
            if (Sample.canvas2d) Sample.canvas2d.style.display = "none";
            renderer = this.renderer = new GPURenderer()
            renderer.initCanvas(canvas, "premultiplied").then(async () => {

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


    }




    public destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        if (this.renderer) this.renderer.destroy();
    }

    public update() {
        if (this.destroyed) return;
        if (!this.useCanvas2D) this.renderer.update();

    }


    public async startCanvas2D(_ctx: CanvasRenderingContext2D): Promise<void> {
        const animate = () => {

            if (this.destroyed) return;
            this.update();
            requestAnimationFrame(animate);
        }
        animate();
    }

    protected async start(renderer: GPURenderer): Promise<void> {
        //@ts-ignore 
        renderer;

    }

} 