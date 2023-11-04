import { UIElement } from "./UIElement";
import appConfig from "./appConfig.json";

export class Header extends UIElement {

    public static instance: Header;

    private xgpuWidth: number = 140;
    private buttons: UIElement[];

    public onSelect: (selection: string) => void;


    constructor() {
        super();
        Header.instance = this;
        this.setStyle({
            display: "flex",
            width: appConfig.APP_WIDTH + "px",
            height: "64px",
            backgroundColor: "#181818",

        })

        this.createXgpuButton();
        this.createButtons([appConfig.pages.Samples, appConfig.pages.Tutorials, appConfig.pages.Documentation])

    }

    private createButtons(labels: string[]) {



        const div: UIElement = this.appendChild(new UIElement("div", {
            display: "flex",
            paddingLeft: (4 + appConfig.MENU_WIDTH - this.xgpuWidth) + "px",
            height: "100%",
            alignItems: "center"

        })) as UIElement;

        div.visible = false;

        const buttons: UIElement[] = this.buttons = [];

        for (let i = 0; i < labels.length; i++) {
            const btn: UIElement = buttons[i] = div.appendChild(new UIElement("div", {
                paddingRight: "25px",
                color: "#ffffff",
                fontSize: "18px",
                fontFamily: "Arial",
                userSelect: "none",
                cursor: "pointer"
            })) as UIElement;

            btn.innerText = labels[i];
            btn.onclick = () => {

                for (let j = 0; j < buttons.length; j++) {
                    if (buttons[j] !== btn) buttons[j].style.color = "#ffffff";
                    else buttons[j].style.color = "#00ffff";
                }

                if (this.onSelect) this.onSelect(labels[i])
            }
        }

        buttons[0].style.color = "#00ffff";


    }

    public select(name: string) {
        let btn: UIElement;
        for (let i = 0; i < this.buttons.length; i++) {
            btn = this.buttons[i];
            if (btn.innerText === name) {
                btn.style.color = "#00ffff";
                this.onSelect(name);
            } else {
                btn.style.color = "#ffffff";
            }
        }
    }


    private createXgpuButton() {
        const xgpu = this.appendChild(new UIElement("div", {
            position: "relative",
            padding: "10px",
            width: this.xgpuWidth + "px",
            backgroundColor: "transparent",
            cursor: "pointer",
            userSelect: "none"
        })) as UIElement;

        const x = new UIElement("span", {
            color: "#00ffff",
            fontSize: "32px",
            fontFamily: "Arial",
            fontWeight: "bold",
            paddingLeft: "20px",
            paddingRight: "2px"

        });
        x.innerText = "X";
        const gpu = new UIElement("span", {
            color: "#ffffff",
            fontSize: "34px",
            fontFamily: "Arial",
            fontWeight: "bold"
        });
        gpu.innerText = "GPU"
        xgpu.appendChild(x);
        xgpu.appendChild(gpu);

        xgpu.onclick = () => {
            window.open("https://github.com/tlecoz/XGPU", "_blank");
        }
    }

}