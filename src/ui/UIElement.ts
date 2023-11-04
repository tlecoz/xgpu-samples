export class UIElement {

    public html: HTMLElement;
    public htmlTag: string;
    public data: any;

    constructor(htmlTag: string = "div", style?: any) {
        this.htmlTag = htmlTag;
        this.html = document.createElement(htmlTag);
        if (style) this.setStyle(style);
    }

    public click(): void { this.html.click(); }
    public set onclick(f: (element: UIElement) => void) {
        this.html.onclick = () => {
            f(this);
        };
    }
    public setStyle(css: any) {
        for (let z in css) if (css[z]) this.html.style[z] = css[z];
    }
    public get style(): any { return this.html.style; }

    public get innerText(): string { return this.html.innerText; }
    public set innerText(s: string) { this.html.innerText = s; }

    private _display: string;
    public get visible(): boolean { return this.style.display !== "none"; }
    public set visible(b: boolean) {

        if (!b) {

            this._display = this.style.display;
            this.style.display = "none";
        } else {

            if (this.style.display != "none") {
                if (this.style.display === "") {
                    console.log("AAAAAAAAAA")
                    this.style.display = "block";
                }
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
        return element;
    }
    public removeChild(element: UIElement) {
        if (!element) return

        /*if (element instanceof HTMLElement) this.html.removeChild(element);
        else*/ this.html.removeChild(element.html);


        return element;
    }
}   