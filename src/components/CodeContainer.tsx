
import { useEffect, useState } from "react";
import "./CodeContainer.scss";
import CodeSelector from "./CodeSelector";
import CodeViewer from "./CodeViewer";

function CodeContainer(props) {

    const { sample, fileIndex } = props;
    const [fileContent, setFileContent] = useState("");



    useEffect(() => {


        const loadText = async (url: string): Promise<string> => {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async (onResolve) => {
                const response = await fetch(url, { headers: { Accept: 'text/plain' } });
                onResolve(response.text());
            })
        }
        //loadText("https://raw.githubusercontent.com/tlecoz/xgpu-samples-website/main/src/samples/" + sample.name + "/" + sample.files[fileIndex]).then((text) => {
        loadText("https://raw.githubusercontent.com/tlecoz/xgpu-samples/main/src/samples/" + sample.name + "/" + sample.files[fileIndex]).then((text) => {
            setFileContent(text);
        })



    }, [sample, fileIndex])


    if (!sample) return null;


    return <div className="codeContainer">
        <CodeSelector {...props} />
        <CodeViewer file={fileContent} />
    </div>
}

export default CodeContainer;