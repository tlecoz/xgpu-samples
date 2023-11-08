import { UIElement } from "../../ui/UIElement";
import appConfig from "../../../src/ui/appConfig.json";
export class DebugPanel extends UIElement {

    private table: UIElement;

    private static _instance: DebugPanel;
    public static get instance(): DebugPanel {
        if (!this._instance) new DebugPanel();
        return this._instance;
    }

    constructor() {

        if (DebugPanel._instance) throw new Error("DebugPanel is a singleton. You must use DebugPanel.instance")

        let w = 500;
        let h = 400;

        super("dix", {
            position: "absolute",
            left: (window.innerWidth - w - 30) + "px",
            top: (appConfig.HEADER_HEIGHT + 10) + "px",
            width: w + "px",
            height: h + "px",
            backgroundColor: "#666666",
            border: "solid 1px #999999",
            borderRadius: "4px",
            zIndex: "" + Infinity,
        })
        DebugPanel._instance = this;
        document.body.appendChild(this.html);
    }

    private fieldsByVertex: any[];
    private currentFields: string = "";

    public update(config: { nbVertex: number, startVertexId: number, instanceId: number }, data: any[], nbValueByFieldName: any, nbDecimal: number = 4) {

        let fields: string = "";
        for (let z in data[0]) fields += z + ",";

        if (this.currentFields != fields) {

            this.currentFields = fields;

            if (this.table) this.removeChild(this.table).clear();

            this.table = this.appendChild(new UIElement("table", { userSelect: "none" }));

            let container = this.table.appendChild(new UIElement("tr", { fontWeight: "bold" }));
            for (let fieldName in data[0]) container.appendChild(new UIElement("th")).innerText = fieldName;

            this.fieldsByVertex = [];
            let vertex, field, fieldProp
            for (let i = 0; i < config.nbVertex; i++) {
                let container = this.table.appendChild(new UIElement("tr", {}));
                vertex = this.fieldsByVertex[i] = {}
                for (let fieldName in data[i]) {

                    field = vertex[fieldName] = [];
                    for (let j = 0; j < nbValueByFieldName[fieldName]; j++) field[j] = container.appendChild(new UIElement("th"))
                }
            }
        }


        const props = ["x", "y", "z", "w"];

        //console.log(data[0]["position"]["x"])

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

    }


}