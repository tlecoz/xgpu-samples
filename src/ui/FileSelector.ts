import { App, loadText } from "./App";
import { UIElement } from "./UIElement";

export class FileSelector extends UIElement {

    private buttons: UIElement[];
    public onSelect: (selection: string) => void;

    constructor() {
        super();

        this.setStyle({
            display: "flex",
            flewWrap: "wrap",
            backgroundColor: "#333333",
            minHeight: "60px",
            padding: "10px",
            width: "100%"
        })

        window.addEventListener("popstate", () => {
            if (App.page == "Samples") this.init();
        })



    }

    private sampleName: string;


    public async init() {

        let urlSampleName;
        if (window.location.pathname.indexOf("/samples/") !== -1) {
            urlSampleName = window.location.pathname.split("/").pop();
        }
        if (!urlSampleName || this.sampleName === urlSampleName) return;
        this.sampleName = urlSampleName;


        if (this.buttons) {
            for (let i = 0; i < this.buttons.length; i++) {
                this.removeChild(this.buttons[i]);
            }
        }


        const getSampleFilesByName = (name: string) => {
            let o: any;
            for (let i = 0; i < App.samples.length; i++) {
                o = App.samples[i];
                if (o.name === name) {
                    return o.files;
                }
            }
        }


        const files: any = getSampleFilesByName(urlSampleName);//await getJsonObject("src/samples/" + urlSampleName + "/" + "files.json");

        this.buttons = [];
        for (let i = 0; i < files.length; i++) {
            const btn = this.buttons[i] = this.appendChild(new UIElement("div", {
                display: "flex",
                alignItems: "center",
                border: i == 0 ? "solid 1px #00dddd" : "solid 1px #dddddd",
                color: i == 0 ? "#00ffff" : "#ffffff",
                fontFamily: "Arial",
                fontSize: "14px",
                paddingLeft: "10px",
                paddingRight: "10px",
                marginLeft: "3px",
                marginRight: "3px",
                userSelect: "none",
                cursor: "pointer"
            })) as UIElement

            const label: string = files[i].substring(0, files[i].length - 3);
            btn.innerText = label.toUpperCase();

            btn.onclick = () => {
                for (let j = 0; j < this.buttons.length; j++) {
                    this.buttons[j].style.color = btn === this.buttons[j] ? "#00ffff" : "#ffffff";
                    this.buttons[j].style.border = btn === this.buttons[j] ? "solid 1px #00dddd" : "solid 1px #dddddd";
                }
                //console.log("btn.code = ", (btn as any).code);
                if (this.onSelect) this.onSelect((btn as any).code);
                //if (this.onSelect) this.onSelect(urlSampleName + "/" + label);
            }

            if (i === 0) {
                (btn as any).code = await loadText("https://raw.githubusercontent.com/tlecoz/xgpu-samples/main/src/samples/" + urlSampleName + "/" + label + ".ts");
            } else {
                loadText("https://raw.githubusercontent.com/tlecoz/xgpu-samples/main/src/samples/" + urlSampleName + "/" + label + ".ts").then((code: string) => {
                    (btn as any).code = code;
                })
            }




        }

        if (this.onSelect) {
            this.onSelect((this.buttons[0] as any).code);
        }


    }

}