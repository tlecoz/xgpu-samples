import { UIElement } from "../ui/UIElement";
import { FileMenu } from "./FileMenu";
import appConfig from '../ui/appConfig.json';
import { FileDocumentation } from "./FileDocumentation";

export class Documentation extends UIElement {


    public static instance: Documentation;
    public static json: any;
    constructor() {
        super("div", {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            fontFamily: "Arial",
            boxSizing: "borderBox",
            width: appConfig.APP_WIDTH,
            minHeight: (window.innerHeight - appConfig.HEADER_HEIGHT - appConfig.FOOTER_HEIGHT) + "px",
        })

        Documentation.instance = this;

        const loadJson = (url: string) => {
            return new Promise(async (resolve) => {
                const response = await fetch(url);
                resolve(response.json());
            })

        }

        let menu;
        const start = () => {

            menu = this.appendChild(new FileMenu()) as FileMenu;
            menu.onSelect = (file: any) => fileDocumentation.init(file);

            const fileDocumentation = this.appendChild(new FileDocumentation()) as FileDocumentation;

            fileDoc = window.location.pathname.split("/").pop();
            if (menu) menu.select(fileDoc)

        }
        let fileDoc: string;
        window.addEventListener("popstate", () => {
            if (window.location.pathname.indexOf("/documentation/") !== -1) {
                fileDoc = window.location.pathname.split("/").pop();

                if (menu) menu.select(fileDoc)
            }
        })


        const init = async (urls: string[]) => {

            try {
                Documentation.json = await loadJson(urls[0]);
            } catch (e) {
                Documentation.json = await loadJson(urls[1]);
            }


            //console.log("json loaded : ", Documentation.json);
            start();
        }
        if (!Documentation.json) init([
            "../node_modules/xgpu/dist/documentation.json",
            "https://raw.githubusercontent.com/tlecoz/XGPU/main/dist/documentation.json"
        ]);
        else start();





    }


}

