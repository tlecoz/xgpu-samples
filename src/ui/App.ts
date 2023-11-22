import { Documentation } from "../documentation/Documentation";
//import { Tutorials } from "../tutorials/Tutorials";
import appConfig from "./appConfig.json"
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SampleContainer } from "./SampleContainer";
import { UIElement } from "./UIElement";


export const loadText = (url: string): Promise<string> => {
    return new Promise(async (onResolve) => {
        const response = await fetch(url, { headers: { Accept: 'text/plain' } });
        onResolve(response.text());
    })
}

export const getJsonObject = (path: string): Promise<any> => {
    return new Promise(async (onResolve: (e: { samples: string[], basePath: string }) => void) => {
        const o = JSON.parse(await loadText(window.location.origin + "/" + path));
        onResolve(o as any);
    });
}


export class App extends UIElement {

    public static page: string;
    public static samples: any;

    constructor() {
        super("div", {
            display: "flex",
            flexDirection: "column",
            boxSizing: "borderBox"
        });


        const start = async () => {
            const o = await getJsonObject("samples.json");

            App.samples = o.samples;

            document.body.style.backgroundColor = "#cecece"
            const header = this.appendChild(new Header()) as Header;

            const sampleContainer = new SampleContainer();
            const documentation = new Documentation();
            //const tutorials = new Tutorials();

            const footer = new Footer();

            let pageType: string;
            let name: string;
            if (window.location.pathname.indexOf("/samples/") !== -1) {
                pageType = appConfig.pages.Samples;
                name = window.location.pathname.split("/").pop();
            }/* else if (window.location.pathname.indexOf("/documentation/") !== -1) {
                pageType = appConfig.pages.Documentation;
                name = window.location.pathname.split("/").pop()
            } else if (window.location.pathname.indexOf("/tutorials/") !== -1) {
                pageType = appConfig.pages.Tutorials;
                name = window.location.pathname.split("/").pop()
            }*/ else {
                //DEFAULT PAGE :
                pageType = appConfig.pages.Samples;
                name = "HelloTriangle";
            }

            let current;
            let currentName;

            App.page = pageType;

            const setPage = (pageName: string) => {



                if (pageName === App.page && currentName === name) return;

                if (pageName != App.page) {
                    if (pageName === appConfig.pages.Documentation) name = "BuiltIns";
                    else if (pageName === appConfig.pages.Samples) name = "HelloTriangle";
                    //else if (pageName === appConfig.pages.Tutorials) name = "AAAAAAAAAAAAAAAAAA"
                }

                //console.log("footer.display = ", footer.style.display)
                footer.visible = pageName != appConfig.pages.Documentation;


                currentName = name;


                if (current) this.removeChild(current);
                App.page = pageName;



                if (pageName === appConfig.pages.Documentation) {
                    current = documentation

                    history.pushState(null, '', window.location.origin + "/documentation/" + name);
                    window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
                    this.appendChild(documentation);
                } else if (pageName == appConfig.pages.Samples) {



                    current = sampleContainer;

                    history.pushState(null, '', window.location.origin + "/samples/" + name);
                    window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
                    this.appendChild(sampleContainer);
                }

                this.appendChild(footer);
            }

            header.onSelect = pageName => setPage(pageName);

            const init = (pageName: string) => {
                header.select(pageName);

            }

            init(pageType);
        }

        start();
    }
}