import "./CodeSelector.scss"

function CodeSelector(props) {

    const { sample, fileIndex, setFileIndex } = props;

    const selectedStyle = {
        borderColor: "#0ff",
        color: "#0ff"
    }

    if (!sample) return null;

    return <div className="codeSelector">
        {
            sample.files.map((val, id) => {
                return <p className="codeFile" key={id} style={id === fileIndex ? selectedStyle : undefined} onClick={() => setFileIndex(id)}>{val}</p>
            })
        }
    </div >
}

export default CodeSelector;