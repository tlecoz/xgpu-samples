
import Header from "./Header"
import "./App.scss"
import SampleContainer from "./SampleContainer"
import CodeContainer from "./CodeContainer"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import sampleList from "../jsons/samples.json"
import { useEffect, useState } from "react"




function App() {

  const location = useLocation();

  const [sample, setSample] = useState(sampleList.samples[0])
  const [fileIndex, setFileIndex] = useState(0);

  console.log(sample)

  const props = {
    sample,
    fileIndex,
    setFileIndex,
  }


  const nav = useNavigate()

  useEffect(() => {

    const sampleName = location.pathname.slice(1);
    const currentSample = sampleList.samples.find((val) => {
      if (val.name == sampleName) return val;
    })





    if (currentSample) {
      setSample(currentSample);
      setFileIndex(0);
    } else {
      //setSample(sampleList.samples[0]);
      setFileIndex(0);


      nav("/" + sampleList.samples[0].name)

    }

  }, [location])

  return (

    location.pathname == "/" ? <Navigate to={"/" + sampleList.samples[0].name} /> :

      <div className="mainContainer">

        <Header sample={sample} />


        <SampleContainer {...props} />
        <CodeContainer {...props} />


      </div>

  )
}

export default App
