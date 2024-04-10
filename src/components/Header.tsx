import "./Header.scss"
import sampleList from "../jsons/samples.json"
import { useNavigate } from "react-router-dom";
function Header(props: { sample: { name: string, files: string[] } }) {

    const { sample } = props;

    const onPressXgpu = () => {
        window.open("https://github.com/tlecoz/XGPU", "_blank");
    }

    const navigate = useNavigate();

    const cnComboChange = (e) => {
        navigate("/" + e.target.value);
    }

    return <header>
        <div className="xgpuButton" onClick={onPressXgpu}>
            <span>X</span>
            <span>GPU</span>
        </div>


        <select className="sampleCombo" value={sample.name} onChange={cnComboChange} >
            {
                sampleList.samples.map((val, id) => {
                    return <option key={id} value={val.name}>{val.name}</option>
                })
            }
        </select>



    </header>


}

export default Header