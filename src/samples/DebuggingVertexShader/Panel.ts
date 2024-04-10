

export class UIElement {

    public html: HTMLElement;
    public htmlTag: string;
    public data: any;
    public parent: UIElement;

    constructor(htmlTag: string = "div", style?: any) {
        this.htmlTag = htmlTag;
        this.html = document.createElement(htmlTag);
        this.html.setAttribute("object", this.constructor.name);
        if (style) this.setStyle(style);
    }


    private _display: string = "block";

    private _x: number = 0;
    private _y: number = 0;
    public get x(): number { return this._x }
    public set x(n: number) {
        if (this._x != n) {
            this._x = n;
            this.style.left = n + "px";
        }
    }

    public get y(): number { return this._y }
    public set y(n: number) {
        if (this._y != n) {
            this._y = n;
            this.style.top = n + "px";
        }
    }

    private _w: number = 0;
    private _h: number = 0;
    public get width(): number { return this._w }
    public set width(n: number) {
        if (this._w != n) {
            this._w = n;
            this.style.width = n + "px";
        }
    }

    public get height(): number { return this._h }
    public set height(n: number) {
        if (this._h != n) {
            this._h = n;
            this.style.height = n + "px";
        }
    }

    public clear() {
        for (const z in this) {
            this[z] = null;
            delete this[z];
        }
    }

    public click(): void { this.html.click(); }
    public set onclick(f: (element: UIElement) => void) {
        this.html.onclick = () => {
            f(this);
        };
    }
    public setStyle(css: { [key: string]: string | undefined }) {
        for (const z in css) {
            if (z == "display") this._display = z;
            if (css[z]) this.html.style[z] = css[z];
        }
    }
    public get style(): any { return this.html.style; }

    public get innerText(): string { return this.html.innerText; }
    public set innerText(s: string) { this.html.innerText = s; }


    public get visible(): boolean { return this.style.display !== "none"; }
    public set visible(b: boolean) {

        if (!b) {

            this._display = this.style.display;
            this.style.display = "none";
        } else {

            if (this.style.display != "none") {
                this._display = this.style.display;
                return;
            }
            if (this._display === "none") {
                this._display = "block";
            }
            this.style.display = this._display;
        }
    }
    public get children(): HTMLCollection { return this.html.children }
    public appendChild(element: UIElement) {
        if (!element) return
        if (element instanceof HTMLElement) this.html.appendChild(element);
        else this.html.appendChild(element.html);
        element.parent = this;
        return element;
    }
    public removeChild(element: UIElement) {
        if (!element) return
        element.parent = undefined;
        /*if (element instanceof HTMLElement) this.html.removeChild(element);
        else*/ this.html.removeChild(element.html);


        return element;
    }
}

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
        document.body.appendChild(this.html);
    }

    private onMouseUp: (e: any) => void;
    private onMouseMove: (e: any) => void;

    public destroy() {
        try {
            console.log("destroy panel")
            delete this.html.onmousedown;
            document.body.removeEventListener("mousemove", this.onMouseMove);
            document.body.removeEventListener("mouseup", this.onMouseUp);
            document.body.removeChild(this.html);
        } catch (e) {
            //
        }

    }




}