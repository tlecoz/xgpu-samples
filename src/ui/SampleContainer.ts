
import { CodeContainer } from "./CodeContainer";
import { DemoCanvas } from "./DemoCanvas";
import { SampleMenu } from "./SampleMenu";
import { UIElement } from "./UIElement";

export class SampleContainer extends UIElement {

    constructor() {
        super();
        this.setStyle({
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#000"
        })
        const div = new UIElement("div", {
            display: "flex",
            flexDirection: "row"
        });
        div.appendChild(new SampleMenu()) as SampleMenu;
        //setTimeout(() => {
        div.appendChild(new DemoCanvas()) as DemoCanvas;
        this.appendChild(div);
        this.appendChild(new CodeContainer()) as CodeContainer;
        //}, 1)

    }
}