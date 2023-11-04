import { App } from "./App";
import { CANVAS_SIZE } from "./DemoCanvas";
import { UIElement } from "./UIElement";
import appConfig from "./appConfig.json";



export class SampleMenu extends UIElement {

    public static WIDTH: number = 300;
    public selection: string;
    public static files: any;

    constructor() {
        super();
        this.setStyle({
            width: appConfig.MENU_WIDTH + "px",
            height: CANVAS_SIZE + "px",
            backgroundColor: "#444444",
            display: "flex",
            flexDirection: "column",
            paddingTop: "25px",
            paddingLeft: "20px",
            overflowY: "auto"
        })

        this.init();
    }

    private async init() {
        const { samples } = App
        let urlSampleName: string;

        if (window.location.pathname.indexOf("/samples/") !== -1) {
            urlSampleName = window.location.pathname.split("/").pop();
            //DemoCanvas.instance.launchDemo(urlSampleName);
        }


        SampleMenu.files = {}
        let buttons: UIElement[] = [];
        for (let i = 0; i < samples.length; i++) {
            let div = buttons[i] = new UIElement();
            const sampleName = samples[i].name;


            div.setStyle({
                color: sampleName === urlSampleName ? "#00ffff" : "#ffffff",
                fontFamily: "Verdana",
                marginBottom: "10px",
                userSelect: "none",
                cursor: "pointer"
            })


            div.innerText = sampleName;
            div.onclick = () => {
                this.selection = sampleName;

                for (let j = 0; j < buttons.length; j++) {
                    if (buttons[j] !== div) buttons[j].style.color = "#ffffff";
                    else buttons[j].style.color = "#00ffff";
                }

                history.pushState(null, '', window.location.origin + "/samples/" + sampleName);
                window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
            };

            if (sampleName === urlSampleName) {
                div.click();
            }

            this.appendChild(div);
        }


    }




}