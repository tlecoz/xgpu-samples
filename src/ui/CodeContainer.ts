import 'codemirror-minified/lib/codemirror.css';
import 'codemirror-minified/theme/material.css';
import 'codemirror-minified/mode/javascript/javascript.js';
import CodeMirror from 'codemirror-minified';


import { FileSelector } from "./FileSelector";
import { UIElement } from "./UIElement";
import appConfig from "./appConfig.json";


export class CodeContainer extends UIElement {

    private fileSelector: FileSelector;


    constructor() {
        super();
        this.setStyle({
            minHeight: "400px",
            width: appConfig.APP_WIDTH + "px",
            backgroundColor: "#222222",

        })

        this.fileSelector = this.appendChild(new FileSelector()) as FileSelector;
        this.fileSelector.onSelect = async (code: string) => {
            //const code = await loadText("https://raw.githubusercontent.com/tlecoz/xgpu-samples/main/src/samples/" + filename + ".ts")
            editor.setValue(`\n` + code + `\n`)
        }


        const codeEditor = this.appendChild(new UIElement("div", {
            display: "block",
            width: appConfig.APP_WIDTH + "px",
            height: "auto",
            paddingTop: "5px",
            paddingLeft: "15px",
            paddingRight: "15px",
            paddingBottom: "5px"
        })) as UIElement;



        let editor = CodeMirror(codeEditor.html, {
            lineNumbers: true,
            mode: "javascript",

        });

        // Ajustement de la hauteur de l'éditeur en fonction du nombre de lignes
        const adjustEditorHeight = () => {
            let lineCount = Math.max(50, editor.lineCount());
            //console.log("lineCount = ", lineCount)
            let height = lineCount * 15.25; // 20px par ligne, plus 5px de marge
            editor.setSize(null, `${height}px`);
            codeEditor.style.height = (height + 10) + "px"
        }

        // Ajustement initial de la hauteur
        adjustEditorHeight();

        // Ajustement de la hauteur chaque fois que le contenu change
        editor.on('change', adjustEditorHeight);



        setTimeout(() => {
            this.fileSelector.init()
            editor.refresh()
        }, 1);
    }


}