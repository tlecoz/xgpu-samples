import { Float, GPURenderer, IndexBuffer, Matrix4x4, RenderPipeline, Vec2, Vec3Buffer, VertexBuffer } from "xgpu";
import { MouseControler } from "../MouseToy/MouseControler";
import { Camera } from "../ColorCube/Camera";

export class Pencil extends RenderPipeline {



    constructor(renderer: GPURenderer) {
        super();


        const nbSegmentMax: number = 1000
        const extraBufferSize = 1000;

        const mouse = new MouseControler(renderer.canvas);

        let indexData = new Uint32Array(nbSegmentMax * 2);
        const indexBuffer = new IndexBuffer({ datas: indexData });


        let vertexData = new Float32Array(nbSegmentMax * 3 * 2);
        const vertexBuffer = new VertexBuffer({
            position: new Vec3Buffer()
            //position: VertexAttribute.Vec3()
        });
        vertexBuffer.datas = vertexData;

        const screen = new Vec2(renderer.width, renderer.height)
        const camera = new Camera(renderer.width, renderer.height, 60, 0.1, 100000);





        const model = new Matrix4x4();
        model.scaleX = -1;
        const w = renderer.width * 0.5;
        const time = new Float(0);
        this.initFromObject({
            antiAliasing: true,
            cullMode: "none",
            vertexBuffer,
            indexBuffer,
            screen,
            camera,
            model,
            time,
            //vertexShader: `output.position = camera * model * vec4(position.xy * ${w.toFixed(1)} , sin(time - position.z)*10000.0 , 1.0);`,
            vertexShader: `output.position = camera * model * vec4(position.xy * ${w.toFixed(1)} , 0.0 , 1.0);`,
            fragmentShader: `output.color = vec4(1.0);`
        })


        let oldX = 0;
        let oldY = 0;
        let mouseDown: boolean = false;
        let started: boolean = false;
        let vertexId = 0;
        let indexId = 0;
        let id = 0;


        indexBuffer.nbPoint = 0;


        let thickness: number = 10000 / screen.x;

        const addSegmentIndex = () => {



            if (indexId + 6 >= indexData.length) {
                let temp: any;
                /*if (indexData instanceof Uint16Array) temp = new Uint16Array(indexData.length + extraBufferSize);
                else*/ temp = new Uint32Array(indexData.length + extraBufferSize);
                temp.set(indexData);
                indexData = temp;


            }

            indexData[indexId++] = id + 0;
            indexData[indexId++] = id + 1;
            indexData[indexId++] = id + 2;

            indexData[indexId++] = id + 3;
            indexData[indexId++] = id + 1;
            indexData[indexId++] = id + 2;

            indexBuffer.nbPoint = indexId;
            indexBuffer.datas = indexData
            //indexBuffer.updateDatas(indexData, indexId - 6, indexId);



            //indexBuffer.datas = indexData.slice(0, indexId);
            id += 2

        }

        const now = new Date().getTime();
        let depth = 0;

        const addSegment = (x: number, y: number, a: number, addIndex: boolean = true) => {

            if (vertexId + 6 >= vertexData.length) {
                let temp: any;
                temp = new Float32Array(vertexData.length + extraBufferSize);
                temp.set(vertexData);
                vertexData = temp;
            }


            let ax = x + Math.cos(a - Math.PI / 2) * thickness;
            let ay = y + Math.sin(a - Math.PI / 2) * thickness;

            let bx = x + Math.cos(a + Math.PI / 2) * thickness;
            let by = y + Math.sin(a + Math.PI / 2) * thickness;



            depth = 600//time.x;

            vertexData[vertexId++] = ax;
            vertexData[vertexId++] = ay;
            vertexData[vertexId++] = depth;

            vertexData[vertexId++] = bx;
            vertexData[vertexId++] = by;
            vertexData[vertexId++] = depth;

            vertexBuffer.datas = vertexData.slice(0, vertexId);

            if (addIndex) addSegmentIndex();

        }

        const startPath = (x0: number, y0: number, x1: number, y1: number) => {
            if (id != 0) id += 2;

            const a = Math.atan2(y1 - y0, x1 - x0);
            addSegment(x0, y0, a, false);
            addSegment(x1, y1, a, true);
            oldX = x1;
            oldY = y1;



        }









        this.addEventListener(RenderPipeline.ON_DRAW_BEGIN, () => {

            time.x = (new Date().getTime() - now) / 10000;
            //camera.x = mouse.x * screen.x;
            //camera.y = mouse.y * screen.y;


            if (mouse.down) {
                if (!mouseDown) {
                    mouseDown = true;
                    oldX = mouse.x;
                    oldY = mouse.y;
                    started = false;
                    return;
                }
            } else {
                if (mouseDown) {
                    mouseDown = false;
                    started = false;
                }
                return
            }

            if (!started) {
                started = true;
                startPath(-oldX, oldY, -mouse.x, mouse.y);
                return;
            }


            const dx = mouse.x - oldX;
            const dy = mouse.y - oldY;
            const a = Math.atan2(dy, dx);
            thickness = Math.sqrt(dx * dx + dy * dy) * 0.025;

            addSegment(-mouse.x, mouse.y, a);





        });
    }



}