import { UIElement } from "./UIElement";



export type Param = {
    name: string,
    object: any,
    id?: number,
    min?: number,
    max?: number,
    round?: boolean
}

export class ParamUI extends UIElement {

    public clear: () => void;

    constructor(item: Param) {
        super("div", {
            display: "flex",
            paddingBottom: "10px"
        })


        let min: number = 0;
        let id = item.id ? item.id : 0;
        let val = item.object[id];
        if (item.round) val = Math.round(val);

        let max: number = val * 2;
        if (item.min) min = item.min;
        if (item.max) max = item.max;


        let progress: string = ((val - min) / (max - min) * 100).toFixed(2) + "px"
        let mouseDown: boolean = false;


        this.appendChild(new UIElement("div", {
            color: "#ffffff",
            fontFamily: "Arial",
            fontSize: "12px",
            width: "100px",
            textAlign: "right",
            paddingRight: "10px",
            userSelect: "none",
            pointEvents: "none"
        })).innerText = item.name;

        const div = this.appendChild(new UIElement("div", {
            width: "100px",
            height: "15px",
            backgroundColor: "#ffffff",
            cursor: "pointer"
        })) as UIElement

        const progressDiv = div.appendChild(new UIElement("div", {
            width: progress,
            height: "100%",
            backgroundColor: "#00ffff"
        }));

        const updateMousePosition = (e) => {
            const pct = (e.clientX - div.html.getBoundingClientRect().left) / 100;
            let current = min + (max - min) * pct;
            if (item.round) current = Math.round(current);
            let id = 0;
            if (item.id) id = item.id;
            item.object[id] = current;
            item.object.mustBeTransfered = true;
            val = current;
            progressDiv.style.width = (pct * 100).toFixed(2) + "px";
        }

        const handleMouseDown = (e) => {
            mouseDown = true
            updateMousePosition(e);
        }
        const handleMouseUp = () => { mouseDown = false }
        const handleMouseMove = (e) => {
            if (mouseDown) updateMousePosition(e);
        }


        document.addEventListener("mouseup", handleMouseUp)
        div.html.addEventListener("mousedown", handleMouseDown);
        div.html.addEventListener("mousemove", handleMouseMove)

        this.clear = () => {
            document.removeEventListener("mouseup", handleMouseUp)
            div.html.removeEventListener("mousedown", handleMouseDown);
            div.html.removeEventListener("mousemove", handleMouseMove)
        }



    }



}



export class DemoParams extends UIElement {


    private container: UIElement;
    private elements: ParamUI[] = []
    private buttonContainer: UIElement;
    constructor() {
        super("div", {
            position: "absolute",
            right: "0px",
            bottom: "0px",
            padding: "5px",
            zIndex: 99999,
            backgroundColor: "rgba(50,50,50,0.5)",
            width: "220px",
            //height: "300px",
        })
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        this.container = this.appendChild(new UIElement("div", {
            position: "relative",
            display: "flex",
            flexDirection: "column",
        })) as UIElement;


        /*
        this.loseDeviceBtn = this.container.appendChild(new UIElement("div", {
            fontWeight: "bold",
            fontSize: "14px",
            color: "#00ffff",
            fontFamily: "Arial",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
            borderRadius: "1.5px",
            border: "solid 1px #00ffff",
            cursor: "pointer",
            marginRight: "10px",
            marginLeft: "10px",
            userSelect: "none"

        }));

        this.loseDeviceBtn.innerText = "Simulate device loss"
        this.loseDeviceBtn.onclick = () => {
            XGPU.loseDevice();
        }
        */

    }


    public init(params: Param[]) {
        if (this.buttonContainer) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].clear();
                this.buttonContainer.removeChild(this.elements[i]);
            }
            this.elements = [];
            this.removeChild(this.buttonContainer);
            this.buttonContainer = null;
        }

        this.visible = params && params.length > 0;
        console.log("oooo")
        //console.log("visible = ", params, !!params, params.length > 0, this.visible)
        if (!this.visible) return;

        this.buttonContainer = this.appendChild(new UIElement("div", {
            display: "flex",
            flexDirection: "column",
            paddingTop: "10px",
        }))

        for (let i = 0; i < params.length; i++) {
            this.elements[i] = this.buttonContainer.appendChild(new ParamUI(params[i])) as ParamUI;

        }

        const rect = this.container.html.getBoundingClientRect();

        this.container.setStyle({
            width: rect.width + "px",
            height: rect.height + "px",
            bottom: "0px"
        })
    }


}