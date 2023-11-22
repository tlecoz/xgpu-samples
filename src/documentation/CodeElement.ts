import { UIElement } from "../ui/UIElement";
import { FileMenu } from "./FileMenu";

export class CodeElement {


    private static lastCharIndexInObject: number;
    public static getObjectDiv(objStr: string, addComaAtTheEnd: boolean = false, returnType: boolean = false): UIElement {
        objStr = objStr.trim().split(";").join(",").split("\r\n").join("").split("\n").join("");
        let level = 0;
        let result = "";
        let isType = false;
        let isString = false;
        let stringChar: string;

        let div = new UIElement("div", {
            display: "flex",
            flexDirection: "column"
        })

        console.warn("getObjectDiv ", objStr)

        let temp;
        let nbCurvedBracketOpen = 0;
        for (let i = 0; i < objStr.length; i++) {
            if (isType && objStr[i] === "(") {
                result += "(";
                continue;
            } else if (!isString && objStr[i] === "|") {

                if (isType) {
                    temp.appendChild(new UIElement("span", this.separatorStyle)).innerText = "|";
                } else {
                    div.appendChild(new UIElement("span", this.separatorStyle)).innerText = "|";
                }

                result = ""
                continue


            } else if (objStr[i] === "'" || objStr[i] === '"' || objStr === "`") {
                if (isString === false) {
                    isString = true;

                    stringChar = objStr[i];
                    result = objStr[i];
                    continue;
                } else {
                    if (objStr[i] === stringChar) {
                        result += objStr[i];
                        isString = false;
                        if (isType) {
                            temp.appendChild(new UIElement("span", this.stringStyle)).innerText = result;
                        } else {
                            div.appendChild(new UIElement("span", this.stringStyle)).innerText = result;
                        }

                        result = ""
                        continue
                    }
                }
            } else if (isString) {
                result += objStr[i];
                continue
            } else if (objStr[i] === ":" || objStr[i] === "|") {



                isType = true;
                temp = div.appendChild(new UIElement("div", {
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap"
                }))
                temp.appendChild(new UIElement("span", { paddingLeft: (level * 15) + "px", ...(returnType ? this.returnStyle : this.propertyNameStyle) })).innerText = result;
                temp.appendChild(new UIElement("span", this.dotStyle)).innerText = ":";
                result = "";
                continue;
            } else if (objStr[i] === ",") {
                if (temp) {
                    //console.log(i, " getTypeDiv ", result)

                    let closure = "";

                    if (objStr[i - 1] === "]") {
                        closure = objStr[i - 1] + closure;
                        if (objStr[i - 2] === "[") closure = objStr[i - 2] + closure;
                        if (objStr[i - 3] === ")") closure = objStr[i - 3] + closure;
                    } else {
                        if (objStr[i - 1] === ")") closure = objStr[i - 1];
                    }

                    temp.appendChild(this.getTypeDiv(result, addComaAtTheEnd, false, closure));

                    i += closure.length;

                    temp = undefined
                }
                isType = false;
                result = "";

                continue;
            } else if (objStr[i] === ";") {

                if (temp) {
                    temp.appendChild(this.getTypeDiv(result));
                    temp.appendChild(new UIElement("span", this.dotStyle)).innerText = ";";
                    temp = undefined
                }

                result = "";
                isType = false;
                continue;
            }

            if (objStr[i] === "{" || objStr[i] === "[") {

                let closure: string = "";

                if (objStr[i] === "{") {
                    nbCurvedBracketOpen++;
                    if (objStr[i + 1] === "}") {
                        closure = "}";
                        nbCurvedBracketOpen--
                    }
                } else if (objStr[i] === "[") {
                    if (objStr[i + 1] === "]") closure = "]";
                    else {

                        if (objStr.slice(i, i + "[key:".length) === "[key:") {


                            temp = div.appendChild(new UIElement("div", {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: (level * 15) + "px",
                            }))



                            let bool = false;
                            for (let n = i; n < objStr.length; n++) {
                                i++;
                                if (bool && objStr[n] === ":") {

                                    break;
                                }
                                if (objStr[n] === "]") {
                                    bool = true;
                                    continue;
                                }
                            }

                            temp.appendChild(new UIElement("span", this.bracketStyle)).innerText = "[key: string]";
                            temp.appendChild(new UIElement("span", this.dotStyle)).innerText = ":";
                            isType = true;




                            continue;

                        }

                    }
                }

                if (closure === "") level++;

                if (isType) {
                    isType = false;
                    temp.appendChild(this.getTypeDiv(result, addComaAtTheEnd));
                    temp.appendChild(new UIElement("span", this.bracketStyle)).innerText = objStr[i] + closure;
                    temp = undefined;
                } else div.appendChild(new UIElement("span", { paddingLeft: (level * 15) + "px", ...this.bracketStyle })).innerText = objStr[i] + closure;
                result = " "
                if (closure !== "") i += closure.length;

                continue;
            } else if (objStr[i] === "}" || objStr[i] === "]") {


                let closure = "";

                if (objStr[i] === "}") {
                    nbCurvedBracketOpen--;
                    if (objStr[i + 1] === "[" && objStr[i + 2] === "]") closure = "[]";
                }


                if (objStr[i - 1] != "{" && objStr[i - 1] != "[") level--;

                if (isType) {
                    isType = false;
                    temp.appendChild(this.getTypeDiv(result, addComaAtTheEnd));
                    temp = undefined;
                }
                div.appendChild(new UIElement("span", { paddingLeft: (level * 15) + "px", ...this.bracketStyle2 })).innerText = objStr[i] + closure;
                result = "";



                if (closure !== "") i += 2;

                if (i != 0 && nbCurvedBracketOpen === 0) {
                    this.lastCharIndexInObject = i;
                    return div;
                }

                continue;
            } else if (objStr[i] === ")") {


                let closure = "";

                if (objStr[i] === ")") {
                    if (objStr[i + 1] === "[" && objStr[i + 2] === "]") closure = "[]";
                    if (closure !== "") i += 2;
                }


                if (isType) {
                    //isType = false;
                    temp.appendChild(new UIElement("span", this.bracketStyle)).innerText = result;
                    result = ""
                    temp.appendChild(new UIElement("span", this.bracketStyle)).innerText = objStr[i];
                }

                continue;
            } else {
                result += objStr[i];

            }
        }

        this.lastCharIndexInObject = objStr.length;
        return div;
    }







    public static getParamDiv(params): UIElement {
        if (!params) {
            const div = new UIElement("div", this.bracketStyle);
            div.innerText = "()"
            return div;
        }
        const div: UIElement = new UIElement("div", { display: "flex", paddingLeft: "5px", paddingRight: "5px" });
        div.appendChild(new UIElement("span", this.bracketStyle)).innerText = "(";
        const div2: UIElement = div.appendChild(new UIElement("div", { display: "flex", flexDirection: "column" }));
        for (let i = 0; i < params.length; i++) {
            const div3: UIElement = div2.appendChild(new UIElement("div", { display: "flex", flexDirection: "row" }));

            div3.appendChild(new UIElement("span", { ...this.propertyNameStyle, paddingLeft: "5px" })).innerText = params[i].name;
            div3.appendChild(new UIElement("span", this.dotStyle)).innerText = ":";
            div3.appendChild(this.getTypeDiv(params[i].type, true));
            //if (i != params.length - 1) div3.appendChild(new UIElement("span", this.dotStyle) ).innerText = ",";
        }
        div.appendChild(new UIElement("span", this.bracketStyle)).innerText = ")";

        return div;
    }

    public static getConstructorDiv(info: any) {
        const div: UIElement = new UIElement("div", {
            display: "flex",
        });
        //console.warn("getConstructorDiv ", info.params)
        div.appendChild(new UIElement("span", this.methodNameStyle)).innerText = "constructor";
        div.appendChild(this.getParamDiv(info.params))

        return div;
    }

    public static getTypeDiv(type: string, addComaAtTheEnd: boolean = false, returnType: boolean = false, closure: string = ""): UIElement {

        if (type[0] === "{") return this.getObjectDiv(type, addComaAtTheEnd, returnType)

        if (type.indexOf("=>") !== -1) {
            const e = new UIElement("span", this.typeStyle)
            e.innerText = type;
            return e;
        }
        console.log("getTypeDiv ", type)



        type = type.split("\r\n").join("").split("\n").join("");
        if (type[type.length - 1] === ";") type = type.slice(0, type.length - 1);
        if (type[0] === "(") type = type.slice(1, type.length - 1);


        const createLink = (nameDiv, file) => {

            let url: string;
            let type;

            let text: string = nameDiv.innerText.trim();

            if (text.slice(0, 3) === "GPU" && text.indexOf("Flags") === -1) {

                url = "https://developer.mozilla.org/en-US/docs/Web/API/" + text;
                type = "external";
                return

            } else if (file) {
                type = "local"


            } else {
                return;
            }

            nameDiv.setStyle({
                textDecoration: "underline",
                cursor: "pointer",
            });
            nameDiv.onclick = () => {
                if (type === "local") {
                    history.pushState(null, '', window.location.origin + "/documentation/" + file.name);
                    window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
                    window.scrollTo(0, 0);
                } else if (type === "external") {
                    window.open(url, "_blank");
                }
            }
        }

        let t = type.split("|");
        console.log(t)
        if (t.length > 1) {
            const div = new UIElement("div", {
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap"
            });

            for (let i = 0; i < t.length; i++) {
                t[i] = t[i].trim();
                console.log(i, t[i])
                const subDiv = div.appendChild(new UIElement("div", { display: "flex", flexDirection: "row" }));

                if (t[i][0] === "{") {

                    subDiv.appendChild(this.getObjectDiv(type, addComaAtTheEnd, returnType));
                    if (this.lastCharIndexInObject < type.length) {
                        type = type.slice(this.lastCharIndexInObject);
                        t = type.split("|");

                    }

                } else {

                    if (t[i].indexOf("['") != -1 || t[i].indexOf('["') != -1) {
                        subDiv.appendChild(this.getDynamicTypeDiv(t[i]));
                    } else {
                        const nameDiv: UIElement = subDiv.appendChild(new UIElement("span", this.typeStyle));
                        nameDiv.innerText = t[i];

                        const file: any = FileMenu.fileByName[t[i]];
                        createLink(nameDiv, file);
                    }

                }





                if (i < t.length - 1) subDiv.appendChild(new UIElement("span", this.separatorStyle)).innerText = "|";
                else {
                    if (addComaAtTheEnd) subDiv.appendChild(new UIElement("span", this.bracketStyle)).innerText = closure + ",";
                    else subDiv.appendChild(new UIElement("span", this.bracketStyle)).innerText = closure;
                }
            }

            return div;
        }



        const div = new UIElement("span", returnType ? this.returnStyle : this.typeStyle)
        div.innerText = type + (addComaAtTheEnd ? "," : "");
        createLink(div, FileMenu.fileByName[type]);


        return div;
    }

    public static getPropertyDiv(info: any, visibility: "public" | "protected" | "private") {
        const div: UIElement = new UIElement("div", {
            display: "flex",
        });

        console.log("GET PROPERTY DIV : ", info)

        div.appendChild(new UIElement("span", this.visibilityStyle)).innerText = visibility;

        if (info.get || info.set) {
            if (info.get && info.set) div.appendChild(new UIElement("span", this.getSetStyle)).innerText = "get / set";
            else if (info.get) div.appendChild(new UIElement("span", this.getSetStyle)).innerText = "get";
            else if (info.set) div.appendChild(new UIElement("span", this.getSetStyle)).innerText = "set";
        }

        div.appendChild(new UIElement("span", this.propertyNameStyle)).innerText = info.name;
        div.appendChild(new UIElement("span", this.dotStyle)).innerText = ":";

        //if (info.type.indexOf(" more ...;") != -1 /*&& info.rawText.indexOf("=") != -1*/) {
        let end: string;
        if (info.get || info.set) {
            div.appendChild(this.getTypeDiv(info.type, true));
        } else {
            if (info.rawText.indexOf("=") != -1) {

                if (info.rawText.indexOf("=>") != -1) {

                    div.appendChild(this.getObjectDiv(info.rawText, true));

                } else {
                    end = info.rawText.split("=")[1];

                    let t2 = end.split("&");
                    for (let k = 0; k < t2.length; k++) {
                        if (k != 0) div.appendChild(new UIElement("span", this.dotStyle)).innerText = "&"
                        div.appendChild(this.getObjectDiv(end.split(",").join(";"), true));
                    }
                }




            } else {

                const end = info.rawText.slice(info.rawText.indexOf(":") + 1);
                console.log("end = ", end)

                div.appendChild(this.getObjectDiv(end.split(",").join(";"), true));
            }
        }




        //} else {
        //    
        //}

        return div;

    }
    public static getMethodDiv(info: any, visibility: "public" | "protected" | "private") {
        const div: UIElement = new UIElement("div", {
            display: "flex",
            width: "100%"
        });
        div.appendChild(new UIElement("span", this.visibilityStyle)).innerText = visibility;
        div.appendChild(new UIElement("span", this.methodNameStyle)).innerText = info.name;
        div.appendChild(this.getParamDiv(info.params));
        div.appendChild(new UIElement("span", this.dotStyle)).innerText = ":";
        div.appendChild(this.getTypeDiv(info.returnType, false, true));
        return div;
    }

    public static getDynamicTypeDiv(code: string): UIElement {

        const div: UIElement = new UIElement("div", {
            display: "flex",
            width: "100%"
        });

        let t: string[];
        if (code.indexOf('"') != -1) {
            t = code.split('"');
        } else {
            t = code.split("'");
        }

        div.appendChild(new UIElement("span", this.typeStyle)).innerText = t[0];
        div.appendChild(new UIElement("span", this.stringStyle)).innerText = "'" + t[1] + "'";
        div.appendChild(new UIElement("span", this.typeStyle)).innerText = t[2];
        return div;
    }

    public static getExportedTypeDiv(info: any) {

        const div: UIElement = new UIElement("div", {
            display: "flex",
            width: "100%"
        });

        let raw: string = "" + info.rawText.trim();
        let code: string[];
        if (raw.indexOf("export ") != -1) {
            code = raw.slice("export type ".length).split("=");
        } else {
            code = raw.slice("type ".length).split("=");
            div.appendChild(new UIElement("span", { paddingRight: "6px", ...this.getSetStyle })).innerText = "internal ";
            //code[0] = "internal " + code[0];
        }



        code[0] = code[0].trim();
        code[1] = code[1].trim();

        div.appendChild(new UIElement("span", { ...this.visibilityStyle, paddingRight: "0px" })).innerText = code[0];
        div.appendChild(new UIElement("span", this.separatorStyle)).innerText = "=";


        if (code[1].indexOf("typeof ") != -1) {
            div.appendChild(new UIElement("span", { paddingRight: "6px", ...this.propertyNameStyle })).innerText = "typeof ";
            div.appendChild(new UIElement("span", this.typeStyle)).innerText = code[1].split("typeof ")[1];
        } else {
            console.log("getExportedTypeDiv = ", code[0], code[1])

            const _raw = code[1];


            let raw
            let t2 = _raw.split("&");
            for (let k = 0; k < t2.length; k++) {
                raw = t2[k];
                if (k != 0) div.appendChild(new UIElement("span", this.separatorStyle)).innerText = "&"
                if (raw.indexOf("|") != -1) {
                    console.log("RAW ", raw)
                    div.appendChild(this.getTypeDiv(raw));

                } else if (raw.indexOf('["') != -1 || raw.indexOf("['") != -1) {
                    div.appendChild(this.getDynamicTypeDiv(raw));
                } else {

                    if (raw[0] === "{") div.appendChild(this.getObjectDiv(raw, true));
                    else div.appendChild(this.getTypeDiv(raw));
                }
            }





        }


        return div;
    }

    public static getSourceDiv() {
        const div = new UIElement("div", {
            cursor: "pointer",
            textDecoration: "underline",
            paddingTop: "50px",
        })

        div.onclick = () => {
            window.open(div.innerText, "_blank");
        };

        return div;
    }


    public static getShowHideInherited(type: "properties" | "methods" | "types", statics: boolean = false) {
        const div = new UIElement("div", {
            fontFamily: "Arial",
            fontWeight: "bold",
            color: "#33c",
            fontSize: "14px",
            textDecoration: "underline",
            paddingBottom: "50px",
            userSelect: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column"
        });
        let show = false;
        (div as any).swapText = () => {
            show = !show;
            if (!show) div.innerText = "Show inherited " + type;
            else div.innerText = "Hide inherited " + type;
            return show;
        }
        div.innerText = "Show inherited " + (statics ? "static " : "") + type;
        return div;
    }



    private static getSetStyle = {
        fontWeight: "bold",
        color: "#33a",
        paddingRight: "5px",
    }

    private static bracketStyle = {
        fontWeight: "bold",
        color: "#222",
        paddingLeft: "2px",
        paddingRight: "2px",

    }

    private static separatorStyle = {
        fontWeight: "bold",
        color: "#000",
        marginLeft: "6px",
        paddingRight: "6px",

    }

    private static bracketStyle2 = {
        fontWeight: "bold",
        color: "#222",
        letterSpacing: "1.5px"
    }

    private static returnStyle = {
        fontWeight: "bold",
        color: "#c60",

    }
    private static stringStyle = {
        fontWeight: "bold",
        color: "#444",
        whiteSpace: "nowrap"
    }
    private static methodNameStyle = {
        fontWeight: "bold",
        color: "#33a"
    }
    private static propertyNameStyle = {

        fontWeight: "bold",
        color: "#838"
    }
    private static typeStyle = {
        fontWeight: "bold",
        color: "#c66"
    }
    private static dotStyle = {
        fontWeight: "bold",
        color: "#030",
        paddingLeft: "1px",
        paddingRight: "1px",
    }
    private static visibilityStyle = {
        fontWeight: "bold",
        color: "#088",
        paddingRight: "10px"
    }





}