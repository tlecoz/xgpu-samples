import { UIElement } from "../ui/UIElement";
import appConfig from "../ui/appConfig.json";

export class Tutorial extends UIElement {

    constructor() {
        super("div", {
            display: "flex",
            flex: "1",
            flexDirection: "column",
            width: (appConfig.APP_WIDTH - appConfig.MENU_WIDTH) + "px",
            position: "absolute",
            top: "0px",
            left: appConfig.MENU_WIDTH + "px",
            backgroundColor: "#ffffff",
            height: "calc(100vh - " + appConfig.HEADER_HEIGHT + "px)",
            overflowY: "auto",
            overflowX: "hidden"
        })
    }

    protected addTitle(title: string) {
        this.appendChild(new UIElement("div", {

        })).innerText = title;


    }

}