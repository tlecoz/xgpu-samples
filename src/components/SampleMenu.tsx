import { Link } from "react-router-dom";
import sampleList from "../jsons/samples.json"
import "./SampleMenu.scss"
function SampleMenu(props) {
    const { sample } = props;
    return (
        <li className="sampleMenu">
            {
                sampleList.samples.map((val, id) => {
                    return <ul key={id} ><Link to={"/" + val.name} className={sample.name == val.name ? "sel" : ""}>{val.name}</Link></ul>
                })
            }
        </li>
    )
}

export default SampleMenu;