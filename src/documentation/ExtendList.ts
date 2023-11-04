import { UIElement } from "../ui/UIElement";
import appConfig from "../ui/appConfig.json";


export class ExtendList extends UIElement {

    private container: UIElement;
    public onSelect: (fileName: string) => void;
    constructor() {
        super("div", {
            position: "relative",
            flexWrap: "wrap",

            width: (appConfig.APP_WIDTH - appConfig.MENU_WIDTH) + "px",




            display: "flex",
            padding: "20px",
            paddingTop: "10px",
            paddingBottom: "10px",
            alignItems: "center",
            backgroundColor: "#111111"
        })

    }



    public init(file: any) {
        if (this.container) this.removeChild(this.container);

        this.container = this.appendChild(new UIElement("div", {
            display: "flex",
            width: "100%",
            height: "100%"
        })) as UIElement;

        const extendList = file.extends;
        const implementList = file.implements;




        if ((!extendList || extendList.length === 0) && (!implementList || implementList.length === 0)) {
            this.style.borderBottom = undefined;
            this.visible = false;
            return;
        }
        this.style.borderBottom = "solid 1px #999999"

        this.visible = true;

        this.style.display = "flex";

        const style = {
            fontFamily: "Arial",
            fontSize: "16px",
            color: "#eeeeee",
            display: "flex",
            padding: "2px",
            fontWeight: "bold",
            userSelect: "none",
            cursor: "pointer",
            height: "20px",
            borderBottom: "solid 1px #eeeeee"
        }




        let div
        if (extendList) {

            div = this.container.appendChild(new UIElement("div", {


                display: "flex",
                fontFamily: "Arial",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#00ffff",
                padding: "2px",
                pointerEvents: "none",
                userSelect: "none",
                marginRight: "15px"
            })) as UIElement
            div.innerText = "extends";


            for (let i = 0; i < extendList.length; i++) {

                if (i != 0) {
                    div = this.container.appendChild(new UIElement("div", {
                        ...style,
                        fontWeight: "bold",
                        fontSize: "16px",
                    })) as UIElement;
                    div.innerText = "/";
                }


                const btn = new UIElement("h4", style);
                btn.onclick = () => {
                    if (this.onSelect) this.onSelect(btn.innerText);
                }
                this.container.appendChild(btn).innerText = extendList[i];
            }


        }



        if (implementList) {
            div = this.container.appendChild(new UIElement("div", {
                display: "flex",
                fontFamily: "Arial",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#00ffff",
                padding: "2px",
                pointerEvents: "none",
                userSelect: "none",
                paddingRight: "15px",
                paddingLeft: extendList ? "15px" : undefined
            })) as UIElement
            div.innerText = "implements";

            for (let i = 0; i < implementList.length; i++) {

                if (i != 0) {
                    div = this.container.appendChild(new UIElement("div", {
                        ...style,
                        fontWeight: "bold",
                        fontSize: "16px",
                    })) as UIElement;
                    div.innerText = "/";
                }


                const btn = new UIElement("h4", style);
                btn.onclick = () => {
                    if (this.onSelect) this.onSelect(btn.innerText);
                }
                this.container.appendChild(btn).innerText = implementList[i];
            }
        }



    }


}