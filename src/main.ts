
import * as samples from "./samples"

const MENU_WIDTH: number = 280;
const HOST = window.location.origin + "/";
let clickDiv;
let clicked: boolean = false;
let canvas;
let sample;

document.body.style.backgroundColor = "#000000";

const setStyle = (target: HTMLElement, style: any) => {
  for (let z in style) target.style[z] = style[z];
}

const mainContainer = document.createElement("div");
setStyle(mainContainer, {
  display: "flex",
} as CSSStyleDeclaration)
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


  const launch = () => {
    const useCanvas2D = fileName === "ComputeShaderCanvas2D";
    sample = new samples[fileName](useCanvas2D);
    sample.init(canvas)
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
  canvas.style.display = "flex";
  canvas.style.justifyContent = "end"
  const updateSize = () => {
    canvas.width = window.innerWidth - MENU_WIDTH;
    canvas.height = window.innerHeight;
  }
  updateSize();
  window.addEventListener("resize", updateSize);
  mainContainer.appendChild(canvas);
}


const changeURL = (newURL: string) => {
  history.pushState(null, '', newURL);
}


const createMenu = async () => {
  const menu = document.createElement("div");
  setStyle(menu, {
    width: MENU_WIDTH + "px",
    height: window.innerHeight + "px",
    backgroundColor: "#444444",
    display: "flex",
    flexDirection: "column",
    paddingTop: "15px",
    paddingLeft: "10px",
    justifyContent: "start"
  } as CSSStyleDeclaration)

  mainContainer.appendChild(menu);
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
    const demoClassName = sampleName + "_Sample";

    div.onclick = () => {
      clicked = true;
      launchDemo(demoClassName)
      changeURL(window.location.origin + "/samples/" + sampleName);
    }

    menu.appendChild(div);
  }

  if (window.location.pathname.indexOf("/samples/") !== -1) {
    const sampleName = window.location.pathname.split("/").pop();
    launchDemo(sampleName + "_Sample");
  }
}

createMenu();
createCanvas();




const animate = () => {
  if (sample) sample.update();
  requestAnimationFrame(animate);
}
animate();

