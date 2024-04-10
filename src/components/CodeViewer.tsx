import "./CodeViewer.scss";
import CodeMirror from '@uiw/react-codemirror';



function CodeViewer(props) {

    const { file } = props;

    return <CodeMirror value={file} editable={false} className="codeViewer" />
}
export default CodeViewer;