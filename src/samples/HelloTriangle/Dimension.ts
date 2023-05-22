import { Vec3 } from "xgpu";

export class Dimension extends Vec3 {


    constructor(width: number = 1, height: number = 1, depth: number = 1) {
        super(width, height, depth);
        this.initStruct(["width", "height", "depth"]);
    }

    public get width(): number { return this.x; }
    public get height(): number { return this.y; }
    public get depth(): number { return this.z; }

    public set width(n: number) { this.x = n; }
    public set height(n: number) { this.y = n; }
    public set depth(n: number) { this.z = n; }

}