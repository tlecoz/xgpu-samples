import SampleCanvas from "./SampleCanvas"
import "./SampleContainer.scss"
import SampleMenu from "./SampleMenu"

function SampleContainer(props) {



    return <div className="sampleContainer">
        <SampleMenu {...props} />
        <SampleCanvas {...props} />

    </div>
}

export default SampleContainer