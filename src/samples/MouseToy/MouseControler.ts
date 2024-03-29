import { Vec4 } from "xgpu";

export class MouseControler extends Vec4 {

    constructor(canvas?: HTMLCanvasElement | any) {
        super(0, 0, 0, 0);
        this.initStruct(["x", "y", "down", "wheel"]);

        if (canvas) this.initCanvas(canvas);

    }

    public initCanvas(canvas: HTMLCanvasElement | any) {
        if (!canvas) return;
        document.body.addEventListener("mousemove", (e) => {
            const r = canvas.getBoundingClientRect();
            const px = e.clientX - r.x;
            const py = e.clientY - r.y;

            this.x = -1.0 + (px / canvas.width) * 2.0;
            this.y = 1.0 - (py / canvas.height) * 2.0;
        })
        document.body.addEventListener("mousedown", () => { this.z = 1; })
        document.body.addEventListener("mouseup", () => { this.z = 0; })
        document.body.addEventListener("wheel", (e) => {
            if (e.deltaY > 0) this.w = 1;
            else this.w = -1;

        })
    }


    public get down(): boolean { return this.z === 1 }
    public set down(b: boolean) {
        if (b) this.z = 1;
        else this.z = 0;
    }
    public get wheelDelta(): number { return this.w }
    public set wheelDelta(n: number) { this.w = n; }
}