import { UIElement } from "../../ui/UIElement";
import appConfig from "../../../src/ui/appConfig.json";
export class DebugPanel extends UIElement {

    private mainContainer: UIElement;

    private static _instance: DebugPanel;
    public static get instance(): DebugPanel {
        if (!this._instance) new DebugPanel();
        return this._instance;
    }

    private w: number;
    private h: number;

    constructor() {

        if (DebugPanel._instance) throw new Error("DebugPanel is a singleton. You must use DebugPanel.instance")

        let w = 500;
        let h = 350;

        super("dix", {
            position: "absolute",
            left: (window.innerWidth - w - 30) + "px",
            top: (appConfig.HEADER_HEIGHT + 10) + "px",
            width: w + "px",
            height: h + "px",
            backgroundColor: "#222222",
            border: "solid 1px #999999",
            borderRadius: "4px",
            zIndex: "" + Infinity,
        })

        this.w = w;
        this.h = h;
        DebugPanel._instance = this;
        document.body.appendChild(this.html);
    }

    private fieldsByVertex: any[];
    private currentFields: string = "";
    private valuePerVertex_fields: UIElement[][][] = [];

    public update(config: { nbVertex: number, startVertexId: number, instanceId: number }, data: any[], nbValueByFieldName: any, nbDecimal: number = 4) {

        let fields: string = "";
        for (let z in data[0]) fields += z + ",";

        if (this.currentFields != fields) {


            this.currentFields = fields;

            if (this.mainContainer) this.removeChild(this.mainContainer).clear();

            this.mainContainer = this.appendChild(new UIElement("div", { userSelect: "none" }))



            for (let fieldName in data[0]) {
                this.valuePerVertex_fields[fieldName] = this.createPropertyContainer(fieldName, nbValueByFieldName[fieldName], config.nbVertex, config.startVertexId)
            }

            /*
            this.mainContainer = this.appendChild(new UIElement("table", { userSelect: "none" }));

            let container = this.mainContainer.appendChild(new UIElement("tr", { fontWeight: "bold" }));
            for (let fieldName in data[0]) container.appendChild(new UIElement("th")).innerText = fieldName;

            this.fieldsByVertex = [];
            let vertex, field, fieldProp
            for (let i = 0; i < config.nbVertex; i++) {
                let container = this.mainContainer.appendChild(new UIElement("tr", {}));
                vertex = this.fieldsByVertex[i] = {}
                for (let fieldName in data[i]) {

                    field = vertex[fieldName] = [];
                    for (let j = 0; j < nbValueByFieldName[fieldName]; j++) field[j] = container.appendChild(new UIElement("th"))
                }
            }
            */
        }

        const components = ["x", "y", "z", "w"];
        for (let fieldName in data[0]) {

            let prop = this.valuePerVertex_fields[fieldName];

            for (let i = 0; i < config.nbVertex; i++) {
                let line = prop[i]
                for (let j = 0; j < nbValueByFieldName[fieldName]; j++) {
                    line[j].innerText = (data[i][fieldName][components[j]] as number).toFixed(nbDecimal);
                }
            }
        }


        /*
        

        //console.log(data[0]["position"]["x"])
        const props = ["x", "y", "z", "w"];
        for (let i = 0; i < config.nbVertex; i++) {

            for (let fieldName in data[i]) {



                for (let j = 0; j < nbValueByFieldName[fieldName]; j++) {

                    if (i == 0 && j == 0) {
                        //console.log(data[i][fieldName].y)
                    }

                    this.fieldsByVertex[i][fieldName][j].innerText = (data[i][fieldName][props[j]] as number).toFixed(nbDecimal);
                }
                //console.log(data[i], fieldName, data[i][fieldName])
                //
            }
        }
        */
    }

    private createPropertyContainer(propertyName: string, nbComponent: number, nbVertex: number, startVertexId: number): UIElement[][] {

        const marge: number = 4;
        const blocW: number = (this.w - marge * 2) / 5;

        const container = new UIElement("div", {
            position: "relative",
            display: "flex",
            left: (marge * 0.5) + "px",
            top: (marge * 0.5) + "px",
            flexDirection: "column",
            width: (this.w - marge * 2) + "px",
            backgroundColor: "#dedede",

        })

        this.mainContainer.appendChild(container);

        let mainTitleH = 21;
        container.appendChild(new UIElement("div", {
            backgroundColor: "#222222",
            display: "flex",
            color: "#ffffff",
            //fontWeight: "bold",
            fontFamily: "Arial",
            width: "100%",
            height: mainTitleH + "px",
            fontSize: "12px",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",

        })).innerText = propertyName.toUpperCase();

        const titles: string[] = ["ID", "X", "Y", "Z", "W"].slice(0, nbComponent + 1);
        const titleContainer = container.appendChild(new UIElement("div", { display: "flex", borderBottom: "solid 1px #555555", width: "100%" }))

        const titleStyle = {
            backgroundColor: "#cdcdcd",
            userSelect: "none",
            fontSize: "12px",
            fontWeight: "bold",
            justifyContent: "center",
            display: "flex",
            fontFamily: "Arial",
            alignItems: "center",
            width: blocW + "px",
            height: "30px",
        }

        for (let i = 0; i < titles.length; i++) {
            titleContainer.appendChild(new UIElement("div", titleStyle)).innerText = titles[i];
        }
        const bottomContainer = container.appendChild(new UIElement("div", { display: "flex", width: (blocW * 5) + "px" }))

        const idContainer = bottomContainer.appendChild(new UIElement("div", { display: "flex", flexDirection: "column", borderLeft: "solid 1px #555555" }))
        for (let i = 0; i < nbVertex; i++) idContainer.appendChild(new UIElement("div", { ...titleStyle, borderBottom: "solid 1px #bbbbbb", borderRight: "solid 1px #888888" })).innerText = "" + (startVertexId + i);


        const valueContainer = bottomContainer.appendChild(new UIElement("div", { display: "flex" })).appendChild(new UIElement("div", { display: "block" }))

        let valueStyle = {
            ...titleStyle,
            backgroundColor: "#ececec",
        }

        let valuesByVertex = [];
        for (let i = 0; i < nbVertex; i++) {
            let lineContainer = valueContainer.appendChild(new UIElement("div", { display: "flex", borderBottom: "solid 1px #b8b8b8" }));
            valuesByVertex[i] = [];
            for (let j = 0; j < nbComponent; j++) {
                valuesByVertex[i][j] = lineContainer.appendChild(new UIElement("div", valueStyle));
            }
        }

        if (nbComponent < 4) {

            container.appendChild(new UIElement("div", {

                position: "absolute",
                backgroundColor: "#666666",
                top: (mainTitleH) + "px",
                left: ((nbComponent + 1) * blocW) + "px",
                width: ((5 - nbComponent - 1) * blocW) + 'px',
                height: (31 * (nbVertex + 1)) + "px",
            }))
        }

        return valuesByVertex;
    }


}