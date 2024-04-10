import { useEffect, useRef, useState } from "react";
import "./DemoParams.scss";

interface DemoParam {
    name: string,
    object: any,
    id?: number,
    min?: number,
    max?: number,
    round?: boolean
}

function Param(props: DemoParam) {

    const { name, object, id = 0, min = 0, max = object[id] * 2, round = false } = props;




    const [posx, setPosx] = useState(-1);

    const refContainer = useRef<HTMLDivElement>(null);
    const refProgress = useRef<HTMLDivElement>(null);



    useEffect(() => {
        if (posx >= 0) {
            const pct = (posx - refContainer.current.getBoundingClientRect().left) / 100;
            let current = min + (max - min) * pct;
            if (round) current = Math.round(current);
            object[id] = current;
            object.mustBeTransfered = true;
            refProgress.current.style.width = `${pct * 100}px`;
        } else {
            const n = ((object[id] - min) / (max - min));
            refProgress.current.style.width = `${n * 100}px`;
        }

    }, [posx])



    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setPosx(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.buttons === 1) {
            setPosx(e.clientX);
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setPosx(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        setPosx(e.touches[0].clientX);
    };



    return <div className="param">
        <p>{name}</p>
        <div ref={refContainer} className="container" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} >
            <div ref={refProgress} className="progress" />
        </div>
    </div>
}

function DemoParams(props: { params: DemoParam[] }) {

    const { params } = props;
    if (!params) return;



    console.log("params = ", params)

    return <div className="demoParams">
        {
            params.map((val, id) => {
                return <Param key={id} {...val} />
            })
        }
    </div>

}

export default DemoParams;