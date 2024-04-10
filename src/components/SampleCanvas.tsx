import "./SampleCanvas.scss";
import * as samples from "../samples"
import { useEffect, useRef, useState } from "react";
import DemoParams from "./DemoParams";

function SampleCanvas(props) {
    const { sample } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [params, setParams] = useState(null);
    const [demo, setDemo] = useState(null);

    useEffect(() => {
        console.clear = () => { }
        console.log("canvas = ", props)
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!sample) return;

        const file = sample.files[0];
        const name = file.slice(0, file.length - 3);
        const useCanvas2D = name == "ComputeShaderCanvas2D_Sample";

        if (demo) demo.destroy();

        const demoSample = new samples[name](useCanvas2D);
        demoSample.init(canvas);

        setDemo(demoSample);

        let rAF: number;
        const draw = () => {
            demoSample.update()
            setParams(demoSample.params);
            rAF = requestAnimationFrame(draw);
        }
        draw();

        return () => {
            if (demo) demo.destroy();
            setDemo(null);
            cancelAnimationFrame(rAF);
        }

    }, [sample])


    useEffect(() => {
        console.log("params = ", params);
    }, [params]);




    return <div className="sampleCanvas"  >
        {/*sample.name*/}

        <canvas ref={canvasRef} width={830} height={830} />

        {(params && params.length > 0) && <DemoParams params={params} />}
    </div>
}
export default SampleCanvas;