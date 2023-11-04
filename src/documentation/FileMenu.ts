import { UIElement } from "../ui/UIElement";
import appConfig from "../ui/appConfig.json";
import { Documentation } from "./Documentation";


class FileElement extends UIElement {

    public onSelect: (file: any) => void;

    constructor(obj: any, folderLevel: number, folderName?: string) {

        super("div", {
            width: appConfig.MENU_WIDTH + "px",
            height: folderName ? "28px" : "26px",
            fontFamily: "Arial",
            fontSize: folderName ? "15px" : "14px",

            userSelect: "none",
            pointerEvents: folderName ? "none" : undefined,
            fontWeight: folderName ? "bold" : undefined,
            textShadow: "1px 1px 1px black",

            //position: "absolute",
            //top: (index * 22) + "px",
            paddingLeft: (folderLevel * 25) + "px",
            paddingTop: folderName ? "10px" : "undefined",
            paddingBottom: folderName ? "22px" : "undefined",

            cursor: "pointer"
        })



        let color: string, overColor: string;
        if (folderName) {
            color = "#aaaaaa";
            overColor = "#99ffff";
        } else {
            color = "#ffffff";
            overColor = "#eeeeee";
        }


        this.style.color = color;
        this.html.onmouseover = () => { if (this !== FileMenu.currentBtn) this.style.color = overColor }
        this.html.onmouseout = () => { if (this !== FileMenu.currentBtn) this.style.color = color }
        this.onclick = () => {
            if (this === FileMenu.currentBtn) return;

            if (FileMenu.currentBtn) FileMenu.currentBtn.style.color = color;
            this.style.color = "#00ffff"
            FileMenu.currentBtn = this;
            if (this.onSelect) this.onSelect(this.data);

            history.pushState(null, '', window.location.origin + "/documentation/" + this.data.name);
            window.dispatchEvent(new PopStateEvent("popstate", { state: null }));


        }
        this.innerText = folderName ? folderName.toUpperCase() : obj.name;
    }


}



export class FileMenu extends UIElement {




    private buttons: FileElement[] = [];
    public onSelect: (file: any) => void

    public static currentBtn: UIElement;
    public static fileByName: any = {};
    public static instance: FileMenu;

    constructor() {
        super("div", {
            display: "block",
            //flexDirection: "column",
            //flex: "0 0 " + appConfig.MENU_WIDTH + "px",
            width: appConfig.MENU_WIDTH + "px",
            position: "relative",
            backgroundColor: "#444444",
            padding: "20px",
            height: "calc(100vh - " + appConfig.HEADER_HEIGHT + "px)",
            overflowY: "auto",
            overflowX: "hidden"


        })

        FileMenu.instance = this;

        const folderExceptions = ["PrimitiveType"]
        /*
        PrimitiveType is a file that contatins a lot of small classes. 
        Because the json mirror the file structure, the classes are stored in an array even if there is a single class in it. 
        In most case, I don't wan't to see this array, I just want to see the files, 
        but in this case, the array should be understand as a folder
        */


        let types: any = {};
        let objects: any = {}
        const inspectFolderAndCreateObjects = (folder: any, folderLevel: number, filePath: string) => {

            let folderName: string;
            let isFolder: boolean;
            let o: any, btn: FileElement;
            let countFile: number = 0;
            let level: number;

            for (let z in folder) {
                o = folder[z];
                if (o.objectType === "type") {
                    if (objects[filePath]) {
                        if (!objects[filePath].types) {
                            objects[filePath].types = [];
                        }
                        objects[filePath].types.push(o);
                    } else {
                        if (!types[filePath]) types[filePath] = [];
                        types[filePath].push(o)
                    }
                    continue;
                }

                folderName = undefined
                isFolder = false;

                if (!o.name) {
                    isFolder = true;
                    folderName = z;
                } else {

                    objects[filePath] = o;
                    FileMenu.fileByName[o.name] = o;
                    if (types[filePath]) o.types = types[filePath];
                    countFile++;
                }

                level = folderLevel;

                if (!(o instanceof Array) || folderExceptions.indexOf(folderName) !== -1) {

                    btn = new FileElement(folder[z], folderLevel, folderName) as FileElement;
                    btn.onSelect = (file) => {
                        if (this.onSelect) this.onSelect(file);
                    }
                    btn.data = o;

                    this.appendChild(btn);
                    this.buttons.push(btn);
                } else {
                    level = folderLevel - 1;
                }


                if (isFolder) {
                    inspectFolderAndCreateObjects(o, level + 1, filePath + "/" + folderName);


                }

            }
            return countFile;
        }

        var folderLevel = 0;
        inspectFolderAndCreateObjects(Documentation.json, folderLevel, "");


    }

    public select(fileName: string) {
        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].data.name === fileName) {
                this.buttons[i].style.color = "#00ffff";
                this.buttons[i].click();
            } else {
                this.buttons[i].style.color = "#ffffff";
            }
        }
    }


}