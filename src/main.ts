
// @ts-ignore
import * as samples from "./samples"
import { App } from "./ui/App"

console.clear = () => { }

const app = new App();
document.body.appendChild(app.html);





/*
const MAX_WIDTH: number = 1150;
const MENU_WIDTH: number = 320;
const CANVAS_SIZE: number = MAX_WIDTH - MENU_WIDTH;
const HOST = window.location.origin + "/";
let clickDiv;
let clicked: boolean = false;
let canvas;
let sample;

document.body.style.backgroundColor = "#111111";

const setStyle = (target: HTMLElement, style: any) => {
  for (let z in style) target.style[z] = style[z];
}

const mainContainer = document.getElementById("mainContener");//document.createElement("div");

const contentContener = document.createElement("div");
contentContener.style.display = "flex";
contentContener.style.width = MAX_WIDTH + "px";
contentContener.style.height = CANVAS_SIZE + "px";


const createHeader = () => {
  const header = document.createElement("div");
  header.style.width = MAX_WIDTH + "px";
  header.style.height = "60px";
  header.style.backgroundColor = "#ff0000";
  header.style.display = "flex";


  mainContainer.appendChild(header);
}
createHeader();
mainContainer.appendChild(contentContener);




document.body.appendChild(mainContainer);


const loadText = (url: string): Promise<string> => {
  return new Promise(async (onResolve) => {
    const response = await fetch(url);
    onResolve(response.text());
  })

}

const getSampleList = (): Promise<{ samples: string[], basePath: string }> => {
  return new Promise(async (onResolve: (e: { samples: string[], basePath: string }) => void) => {
    const o = JSON.parse(await loadText(HOST + "samples.json"));
    onResolve(o as any);
  });
}


const createClickToLaunch = (onClick: () => void) => {
  clickDiv = document.createElement("div");
  setStyle(clickDiv, {
    display: "flex",
    userSelect: "none",
    width: canvas.width + "px",
    height: canvas.height + "px",
    position: "absolute",
    top: "0px",
    left: MENU_WIDTH + "px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Verdana",
    fontSize: "40px",
    zIndex: "999",
    cursor: "pointer"
  } as CSSStyleDeclaration)

  clickDiv.innerText = "Click somewhere !!!"

  document.body.appendChild(clickDiv);

  const onclick = () => {
    document.body.removeChild(clickDiv);
    window.removeEventListener("click", onclick);
    clickDiv = null;
    onClick();
  }

  window.addEventListener("click", onclick)
}

const launchDemo = (fileName: string) => {

  fileName += "_Sample";

  const launch = () => {
    const useCanvas2D = fileName === "ComputeShaderCanvas2D_Sample";
    sample = new samples[fileName](useCanvas2D);
    sample.init(canvas)
    setTimeout(() => {
      console.log("launchDemo ", fileName)
    }, 1000);

  }


  const useMedia = fileName === "Video3D_Sample" || fileName === "SoundSpectrum_Sample";
  if (useMedia && !clicked) {
    createClickToLaunch(launch);
    return;
  }

  launch();
}


const createCanvas = () => {
  canvas = document.createElement("canvas");
  canvas.style.display = "block";
  canvas.style.width = canvas.style.height = (CANVAS_SIZE) + "px";
  canvas.width = canvas.height = MAX_WIDTH - MENU_WIDTH;
  contentContener.appendChild(canvas);
}


const changeURL = (newURL: string) => {
  history.pushState(null, '', newURL);
}


const createMenu = async () => {
  const menu = document.createElement("div");
  setStyle(menu, {
    width: MENU_WIDTH + "px",
    height: CANVAS_SIZE + "px",
    backgroundColor: "#444444",
    display: "flex",
    flexDirection: "column",
    paddingTop: "15px",
    paddingLeft: "15px",
    overflowY: "auto"
    //justifyContent: "start"
  } as CSSStyleDeclaration)

  contentContener.appendChild(menu);
  const { samples, basePath } = await getSampleList();

  for (let i = 0; i < samples.length; i++) {
    let div = document.createElement("div");
    setStyle(div, {
      color: "#ffffff",
      fontFamily: "Verdana",
      marginBottom: "10px",
      userSelect: "none",
      cursor: "pointer"
    } as CSSStyleDeclaration)
    div.innerText = samples[i];

    const sampleName = samples[i];
    const demoClassName = sampleName;

    div.onclick = () => {
      clicked = true;
      launchDemo(demoClassName)
      changeURL(window.location.origin + "/samples/" + sampleName);
    }

    menu.appendChild(div);
  }

  if (window.location.pathname.indexOf("/samples/") !== -1) {
    const sampleName = window.location.pathname.split("/").pop();
    launchDemo(sampleName);
  }
}


const createCodeViewer = () => {
  const div = document.createElement("div");
  div.style.width = MAX_WIDTH + "px";
  div.style.minHeight = "600px";
  div.style.backgroundColor = "#ffcc00"
  mainContainer.appendChild(div);
}



createMenu();
createCanvas();
createCodeViewer();



const animate = () => {
  if (sample) sample.update();
  requestAnimationFrame(animate);
}
animate();
*/
