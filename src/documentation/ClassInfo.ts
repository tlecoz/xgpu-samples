import { UIElement } from "../ui/UIElement";
import { CodeElement } from "./CodeElement";
import { FileMenu } from "./FileMenu";

export class ClassInfo extends UIElement {

    private container: UIElement;
    private title: string;
    private titleDiv: UIElement;


    constructor(title: "properties" | "methods" | "constructor" | "static properties" | "static methods" | "types") {
        super("div", {
            display: "flex",
            flexDirection: "column",
            pointerEvent: "none",
            fontFamily: "Arial",
            width: "100%",
            height: "auto",
            paddingBottom: "40px"

        })
        this.title = title;

    }

    public init(file: any, showInherited: boolean = false) {

        let title: string = this.title;
        if (title === "static properties" || title === "static methods") {
            title = "statics";
        }

        if (file.objectType === "interface") {
            if (file.methods && !file.methods.public) {
                file.methods = {
                    public: file.methods
                }
            }

            if (file.properties && !file.properties.public) {
                file.properties = {
                    public: file.properties
                }
            }

        }

        this.visible = true;

        if (!file[title] || (this.title === "constructor" && !file.constructor.rawText)) {
            this.visible = false;
            return;
        }

        if (this.title === "static properties" && !file.statics.properties) {
            this.visible = false;
            return;
        }
        if (this.title === "static methods" && !file.statics.methods) {
            this.visible = false;
            return;
        }




        if (!this.titleDiv) {
            this.titleDiv = this.appendChild(new UIElement("div", {
                fontSize: "20px",
                paddingBottom: "10px",
                paddingTop: "10px",

            })) as UIElement;
            this.titleDiv.innerText = this.title[0].toUpperCase() + this.title.slice(1);
        }



        if (this.container) this.removeChild(this.container);
        this.container = this.appendChild(new UIElement("div", {
            display: "flex",
            flexDirection: "column",

        })) as UIElement;


        const getInheritedElements = (infos: any, visibility: string, title: string) => {
            if (!file.extends || !infos) return infos;
            console.log("file.extends = ", file.extends, infos)
            infos = [...infos];

            let result = [];
            let f: any;
            let t: any;

            const getObj = (f: any) => {
                if (!f) return null;
                if (title === "static_properties") {
                    if (!f.statics) return null;
                    if (!f.statics.properties) return null;
                    return f.statics.properties[visibility]
                } else if (title === "static methods") {
                    if (!f.statics) return null;
                    if (!f.statics.methods) return null;
                    return f.statics.methods[visibility]
                } else if (title === "properties") {
                    if (!f[title]) return null
                    if (!f[title][visibility]) return null
                    return f[title][visibility];
                } else if (title === "methods") {
                    if (!f[title]) return null
                    if (!f[title][visibility]) return null
                    return f[title][visibility];
                } else if (title === "types") {
                    if (!f[title]) return null
                    if (!f[title][visibility]) return null
                    return f[title][visibility];
                }
            }

            for (let i = 0; i < file.extends.length; i++) {
                f = FileMenu.fileByName[file.extends[i]];

                if (getObj(f)) {
                    t = f[title][visibility];
                    for (let j = 0; j < t.length; j++) {
                        result.push({
                            ...t[j],
                            inherited: file.extends[i]
                        })
                    }
                }
            }

            const exists = (name: string) => {
                if (!infos) return false;
                for (let i = 0; i < infos.length; i++) {
                    if (infos[i].name === name) return true;
                }
                return false;
            }

            if (result.length) {
                if (!infos) infos = result;
                else {
                    for (let i = 0; i < result.length; i++) {
                        if (!exists(result[i].name)) {
                            infos.push(result[i]);
                        }
                    }
                }
            }

            return infos;
        }

        var n: number = 0;
        const createSubBlock = (name: "public" | "protected" | "private" | "constructor" | "type") => {

            let infos
            if (this.title === "constructor") {
                infos = [file[name]];

            } else if (this.title === "static properties") {
                if (file.statics.properties) {
                    infos = file.statics.properties[name];
                    if (showInherited) infos = getInheritedElements(infos, name, this.title);
                }


            } else if (this.title === "static methods") {
                if (file.statics.methods) {
                    infos = file.statics.methods[name];
                    if (showInherited) infos = getInheritedElements(infos, name, this.title);
                }


            } else if (this.title === "types") {
                infos = file[this.title]
                if (showInherited) infos = getInheritedElements(infos, name, this.title);

            } else {
                infos = file[this.title][name];
                if (showInherited) infos = getInheritedElements(infos, name, this.title);
            }
            if (!infos) return;

            const div: UIElement = this.container.appendChild(new UIElement("div")) as UIElement;



            const variables: any[] = [];
            const gettersOnly: any[] = [];
            const settersOnly: any[] = [];
            const getterSetters: any[] = [];
            let o: any;
            for (let i = 0; i < infos.length; i++) {
                o = infos[i];
                if (o.get && o.set) getterSetters.push(o);
                else if (o.get) gettersOnly.push(o);
                else if (o.set) settersOnly.push(o);
                else variables.push(o);
            }

            const varDiv: UIElement = div.appendChild(new UIElement("div", {
                paddingBottom: "0px",
                border: "solid 1px #cecece"
            })) as UIElement;


            const style = {
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                fontSize: "14px",
                padding: "20px"
            }

            const lineColor: string = "#dedede";




            const addInfo = (arr: any[]) => {
                let text: UIElement;
                for (let i = 0; i < arr.length; i++) {
                    if (this.title === "constructor") {
                        text = CodeElement.getConstructorDiv(arr[i]);
                    } else if (this.title == "properties") {
                        text = CodeElement.getPropertyDiv(arr[i], name as "public" | "protected")
                    } else if (this.title === "methods") {
                        text = CodeElement.getMethodDiv(arr[i], name as "public" | "protected")
                    } else if (this.title === "static properties") {
                        text = CodeElement.getPropertyDiv(arr[i], name as "public" | "protected")
                    } else if (this.title === "static methods") {
                        text = CodeElement.getMethodDiv(arr[i], name as "public" | "protected")
                    } else if (this.title === "types") {
                        text = CodeElement.getExportedTypeDiv(arr[i]);
                        //text = addText(arr[i].rawText)
                    }



                    const temp = (varDiv.appendChild(new UIElement("div", {
                        ...style,
                        position: "relative",
                        backgroundColor: !arr[i].inherited ?
                            (n++ % 2 === 0 ? lineColor : "#ffffff") :
                            (n++ % 2 === 0 ? "#ffddbb" : "#ffeecc")
                    })) as UIElement)
                    temp.appendChild(text);
                    if (arr[i].inherited) {
                        temp.appendChild(new UIElement("div", {
                            fontSize: "12px",
                            //fontWeight: "bold",
                            fontFamily: "Arial",
                            position: "absolute",
                            //textDecoration: "underline",
                            zIndex: 10,
                            right: "0px",
                            top: "0px",
                            color: "#fff",
                            padding: "2px",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            textShadow: "0px 0px 1px black",
                            backgroundColor: "rgba(200,0,0,0.5)"
                        })).innerText = arr[i].inherited;
                    }
                }
            }


            if (variables.length) addInfo(variables);
            if (getterSetters.length) addInfo(getterSetters);
            if (gettersOnly.length) addInfo(gettersOnly);
            if (settersOnly.length) addInfo(settersOnly);



        }

        if (this.title === "constructor") createSubBlock("constructor");
        else if (this.title === "types") createSubBlock("type")
        else {
            createSubBlock("public");
            createSubBlock("protected");
        }

    }



}