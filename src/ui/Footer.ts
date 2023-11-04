import { UIElement } from "./UIElement";
import appConfig from "./appConfig.json";

export class Footer extends UIElement {


    constructor() {
        super("div", {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: appConfig.APP_WIDTH + "px",
            height: appConfig.FOOTER_HEIGHT + "px",
            backgroundColor: "#222222",

        });

        const line = this.appendChild(new UIElement("div", {
            color: "#888888",
            fontSize: "11px",
            fontFamily: "Arial",
        })) as UIElement;

        (line.appendChild(new UIElement("span")) as UIElement).innerText = "Made by ";

        const a = new UIElement("a");
        (a.html as any).href = "https://github.com/tlecoz";
        a.html.innerText = "Thomas Le Coz";
        a.html.style.color = "#888888"
        line.appendChild(a);

    }


}