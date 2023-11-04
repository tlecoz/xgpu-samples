import { UIElement } from "../ui/UIElement";
import appConfig from "../ui/appConfig.json";
import { ClassInfo } from "./ClassInfo";
import { CodeElement } from "./CodeElement";
import { Documentation } from "./Documentation";
import { ExtendList } from "./ExtendList";
import { FileMenu } from "./FileMenu";

export class FileDocumentation extends UIElement {

    private extendList: ExtendList;
    private className: UIElement;
    private properties: ClassInfo;
    private methods: ClassInfo;
    private staticProps: ClassInfo;
    private staticMethods: ClassInfo;
    private construct: ClassInfo;
    private types: ClassInfo;
    private source: UIElement;

    private showInheritedTypes: UIElement;
    private showInheritedProps: UIElement;
    private showInheritedMethods: UIElement;
    private showInheritedStaticMethods: UIElement;
    private showInheritedStaticProps: UIElement;

    constructor() {
        super("div", {
            display: "flex",
            flex: "1",
            flexDirection: "column",
            width: (appConfig.APP_WIDTH - appConfig.MENU_WIDTH) + "px",



            position: "absolute",
            top: "0px",
            left: appConfig.MENU_WIDTH + "px",
            backgroundColor: "#ffffff",

            height: "calc(100vh - " + appConfig.HEADER_HEIGHT + "px)",
            overflowY: "auto",
            overflowX: "hidden"

        })


        this.className = this.appendChild(new UIElement("h1", {
            width: "100%",
            height: "94px",
            display: "flex",
            alignItems: "center",
            fontSize: "36px",
            fontWeight: "bold",
            fontFamily: "Arial",
            padding: "20px",

            color: "#ffffff",
            textShadow: "0px 0px 5px rgba(0,0,0,0.5)",
            backgroundColor: "#333333"
        }));

        this.extendList = this.appendChild(new ExtendList()) as ExtendList;
        this.extendList.onSelect = (fileName: string) => {
            //console.log(FileMenu.fileByName[fileName])
            history.pushState(null, '', window.location.origin + "/documentation/" + fileName);
            window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
            window.scrollTo(0, 0);

        }

        const div: UIElement = this.appendChild(new UIElement("div", {
            padding: "25px"
        }));


        this.types = div.appendChild(new ClassInfo("types")) as ClassInfo;
        this.showInheritedTypes = div.appendChild(CodeElement.getShowHideInherited("types"));


        this.construct = div.appendChild(new ClassInfo("constructor")) as ClassInfo;

        this.properties = div.appendChild(new ClassInfo("properties")) as ClassInfo;
        this.showInheritedProps = div.appendChild(CodeElement.getShowHideInherited("properties"));

        this.methods = div.appendChild(new ClassInfo("methods")) as ClassInfo;
        this.showInheritedMethods = div.appendChild(CodeElement.getShowHideInherited("methods"));


        this.staticProps = div.appendChild(new ClassInfo("static properties")) as ClassInfo;
        this.showInheritedStaticProps = div.appendChild(CodeElement.getShowHideInherited("properties", true));

        this.staticMethods = div.appendChild(new ClassInfo("static methods")) as ClassInfo;
        this.showInheritedStaticMethods = div.appendChild(CodeElement.getShowHideInherited("methods", true));

        this.source = div.appendChild(CodeElement.getSourceDiv())


    }

    private extendLibraryClass(extendList: string[]): boolean {
        if (!extendList) return false;
        for (let i = 0; i < extendList.length; i++) {
            if (FileMenu.fileByName[extendList[i]]) {
                return true;
            }
        }
        return false;
    }


    public init(file: any) {
        console.log(file)
        this.extendList.init(file);
        this.className.innerText = file.name;
        this.types.init(file)

        const extendingLibraryClass = this.extendLibraryClass(file.extends)

        this.showInheritedTypes.visible = this.types.visible && extendingLibraryClass;

        this.construct.init(file);


        this.properties.init(file);
        this.showInheritedProps.visible = this.properties.visible && extendingLibraryClass;
        this.showInheritedProps.onclick = () => this.properties.init(file, (this.showInheritedProps as any).swapText());





        this.methods.init(file);
        this.showInheritedMethods.visible = this.methods.visible && extendingLibraryClass;
        this.showInheritedMethods.onclick = () => this.methods.init(file, (this.showInheritedMethods as any).swapText());




        this.staticProps.init(file)
        this.showInheritedStaticProps.visible = this.staticProps.visible && extendingLibraryClass;
        this.showInheritedStaticProps.onclick = () => this.staticProps.init(file, (this.showInheritedStaticProps as any).swapText());


        this.staticMethods.init(file)
        this.showInheritedStaticMethods.visible = this.staticMethods.visible && extendingLibraryClass;
        this.showInheritedStaticMethods.onclick = () => this.staticMethods.init(file, (this.showInheritedStaticMethods as any).swapText());

        this.source.innerText = "https://github.com/tlecoz/XGPU/tree/main/src/" + file.filePath.split(".").join("/") + ".ts";


        //this.style.height = this.html.getBoundingClientRect().height + "px";
        setTimeout(() => {
            Documentation.instance.style.minHeight = (this.html.getBoundingClientRect().height) + "px";
        }, 1)

    }




}