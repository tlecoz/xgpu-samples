import { UIElement } from "./UIElement";
import appConfig from "./appConfig.json";
import * as samples from "../samples"
import { DemoParams } from "./demoParams/DemoParams";

export const CANVAS_SIZE = appConfig.APP_WIDTH - appConfig.MENU_WIDTH;


export class DemoCanvas extends UIElement {



    public static instance: DemoCanvas;

    private canvas: HTMLCanvasElement;
    private clickLabel: UIElement;
    private firstClickDone: boolean = false;
    private sampleName: string;
    private sample: any;
    private params: DemoParams

    constructor() {
        super();
        DemoCanvas.instance = this;
        this.setStyle({
            display: "block",
            position: "relative",
            backgroundColor: "#000000",
            width: CANVAS_SIZE + "px",
            height: CANVAS_SIZE + "px"
        })



        const canvas = this.appendChild(new UIElement("canvas")) as UIElement;
        this.canvas = canvas.html as HTMLCanvasElement;
        this.canvas.width = this.canvas.height = CANVAS_SIZE;

        this.params = this.appendChild(new DemoParams()) as DemoParams;

        this.clickLabel = this.appendChild(new UIElement("div", {
            display: "flex",
            userSelect: "none",
            width: CANVAS_SIZE + "px",
            height: CANVAS_SIZE + "px",
            position: "absolute",
            top: "0px",
            left: "0px",
            justifyContent: "center",
            alignItems: "center",
            color: "#ffffff",
            textAlign: "center",
            fontFamily: "Verdana",
            fontSize: "40px",
            zIndex: "9999999999",
            cursor: "pointer"
        })) as UIElement;
        this.clickLabel.innerText = "Click somewhere !!!";
        this.clickLabel.visible = false;

        document.body.addEventListener("click", () => {
            if (!this.firstClickDone) {
                this.firstClickDone = true;
                if (this.clickLabel.visible) {
                    this.clickLabel.visible = false;
                    if (this.sampleName) this.launchDemo(this.sampleName)
                }

            }
        })
        window.addEventListener("popstate", () => {
            if (window.location.pathname.indexOf("/samples/") !== -1) {
                const sampleName = window.location.pathname.split("/").pop();
                this.launchDemo(sampleName);
            }
        })


        const animate = () => {
            if (this.sample) this.sample.update();
            requestAnimationFrame(animate)
        }
        animate();
    }

    public launchDemo(fileName: string) {
        console.log("launchDemo ", fileName)
        this.sampleName = fileName;
        fileName += "_Sample";
        const launch = () => {
            const useCanvas2D = fileName === "ComputeShaderCanvas2D_Sample";
            this.sample = new samples[fileName](useCanvas2D);
            this.sample.init(this.canvas, () => {
                //console.log("params = ", this.sample.params)
                this.params.init(this.sample.params);
            })
        }

        const useMedia = fileName === "Video3D_Sample" || fileName === "SoundSpectrum_Sample";
        if (useMedia && !this.firstClickDone) {
            this.clickLabel.visible = true;
            return;
        }

        launch();


    }



}