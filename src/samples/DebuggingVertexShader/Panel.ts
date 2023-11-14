import { UIElement } from "../../ui/UIElement";

export class Panel extends UIElement {

    private static instance: Panel;

    constructor(w: number, h: number) {
        super("div", {
            position: "absolute",
            userSelect: "none",
            padding: "25px",
            whiteSpace: "no-wrap",
            fontFamily: "Arial",
            fontSize: "14px",
            color: "#090",
            backgroundColor: "rgba(0,0,0,0.75)",
            borderRadius: "4px",
            border: "solid 1px #444",
            zIndex: "9999999999",
            cursor: "pointer",
            fontWeight: "bold"
        });
        this.width = w;
        this.height = h;

        if (Panel.instance) Panel.instance.destroy();
        Panel.instance = this;
    }

    public init() {
        console.log("init panel")
        this.x = (window.innerWidth - this.width - 100);
        this.y = (100);

        let ox, oy;
        let moving = false;
        this.html.onmousedown = (e) => {
            ox = e.clientX - this.html.getBoundingClientRect().left;
            oy = e.clientY - this.html.getBoundingClientRect().top;
            moving = true;
        }

        this.onMouseMove = (e) => {
            if (moving) {
                this.x = e.clientX - ox;
                this.y = e.clientY - oy;
            }
        }
        this.onMouseUp = () => { moving = false }

        document.body.addEventListener("mousemove", this.onMouseMove);
        document.body.addEventListener("mouseup", this.onMouseUp);

    }

    private onMouseUp: (e: any) => void;
    private onMouseMove: (e: any) => void;

    public destroy() {
        console.log("destroy panel")
        delete this.html.onmousedown;
        document.body.removeEventListener("mousemove", this.onMouseMove);
        document.body.removeEventListener("mouseup", this.onMouseUp);
        document.body.removeChild(this.html);
    }




}