import { AlphaBlendMode, BuiltIns, Float, GPURenderer, IndexBuffer, RenderPipeline, Vec2, Vec3, Vec3Buffer, Vec4Buffer, VertexBuffer } from "xgpu";
import { ModelViewMatrix } from "../InstanceCube/ModelViewMatrix";
import { Camera } from "../ColorCube/Camera";
import { Graphics } from "./Graphics";

export class GraphicPipeline extends RenderPipeline {

    protected useMultipleGraphics: boolean = false;
    protected graphicObjs: any[] = [];
    protected vertexId: number = 0;
    protected curveId: number = 0;
    protected triangleId: number = 0;
    protected graphicId: number = -1;

    private verts: number[] = [];
    private curvs: number[] = [];
    private dirty: boolean = false;
    private nbTriangleMax: number = 0;

    constructor(renderer: GPURenderer) {
        super()

        this.initFromObject({
            camera: new Camera(renderer.width, renderer.height, 60, 0.1, 1000),
            transform: new ModelViewMatrix(),
            blendMode: new AlphaBlendMode(),
            antiAliasing: true,
            indexBuffer: new IndexBuffer({ nbPoint: 0 }),
            vertices: new Vec4Buffer(),
            curves: new Vec3Buffer(),

            shapeScale: new Vec2(400, 400),
            center: new Vec3(0, 0, 0),
            rotation: new Float(0),
            shapeRotation: new Float(0),
            widthRatio: new Float(1.0),
            depthTest: true,

            curve: BuiltIns.vertexOutputs.Vec3,
            pos: BuiltIns.vertexOutputs.Vec2,

            vertexShader: `
                output.position = camera *  transform * vec4(vertices.xy,0.0,1.0);;
                output.pos = vertices.xy + 0.5;
                output.curve = curves;
            `,
            fragmentShader: `
                var col = vec4(pos,0.0,1.0);
                var d = (curve.x * curve.x) - curve.y;
                
                if(curve.z == 0.0){
                    if(d > 0.0){
                        col.a = 0.0;
                    }
                }else{
                    if(d < 0.0){
                        col.a = 0.0;
                    }
                }
                
                output.color = col;
            `
        });


    }
    private get indexBuffer(): IndexBuffer { return this.resources.indexBuffer; }
    private get vertexBuffer(): VertexBuffer { return this.resources.bindgroups.default.buffer; }
    public get position(): Vec3 { return this.resources.center; }

    public get widthRatio(): Float { return this.resources.widthRatio; }


    public addGraphics(g: Graphics, pathId: number = 0): void {
        var obj: any = {};

        g.normalizeAndGetCurrentScale(pathId);
        g.createBufferDatas();

        if (this.nbTriangleMax < g.nbTriangleVisible) this.nbTriangleMax = g.nbTriangleVisible;

        if (!this.useMultipleGraphics) {
            this.vertexId = 0;
            this.curveId = 0;
            this.triangleId = 0;
        }

        obj.vertexId = this.vertexId;
        obj.curveId = this.curveId;
        obj.nbTriangle = g.nbTriangleVisible;
        obj.triangleId = this.triangleId;
        obj.widthRatio = g.widthRatio;
        this.triangleId += obj.nbTriangle;

        var vertex: number[] = this.verts;
        var v: number[] = g.getVertexDataById(pathId);

        var i: number, len: number = v.length;
        var start: number = this.vertexId;
        for (i = 0; i < len; i++) vertex[start + i] = v[i];
        this.vertexId += len;

        var curves: number[] = this.curvs;
        var c: number[] = g.getCurveDataById(pathId);

        len = c.length;
        start = this.curveId;
        for (i = 0; i < len; i++) curves[start + i] = c[i];
        this.curveId += len;

        this.dirty = true;
        obj.vertex = v;
        obj.curves = c;
        this.graphicObjs.push(obj)
    }

    public setGraphicById(id: number): any {

        if (id >= this.graphicObjs.length) return;
        this.graphicId = id;
        var obj: any = this.graphicObjs[id];
        this.widthRatio.x = obj.widthRatio;


        if (this.dirty) {

            this.dirty = false;
            var len = this.nbTriangleMax * 3 * 7;
            var result = [];
            const verts = this.verts;
            const curvs = this.curvs;
            let id = 0;

            for (let i = 0; i < len; i += 7) {
                result.push(verts[id * 4 + 0], verts[id * 4 + 1], verts[id * 4 + 2], verts[id * 4 + 3])
                result.push(curvs[id * 3 + 0], curvs[id * 3 + 1], curvs[id * 3 + 2])
                id++;
            }
            this.vertexBuffer.datas = new Float32Array(result);
        }

        this.indexBuffer.offset = obj.triangleId * 3;
        this.indexBuffer.nbPoint = obj.nbTriangle * 3;

        const indices = [];
        for (let i = 0; i < this.nbTriangleMax * 3; i++) indices[i] = i;
        this.indexBuffer.datas = new Uint32Array(indices);

        return obj;

    }



}