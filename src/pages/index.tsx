import { SetStateAction, useState } from "react"
import Version3 from "./index3";
import Version4a from "./index4a";
import Version4b from "./index4b";
import Version4c from "./index4c";
import Version7 from "./index7"

function Buttons({func} : {func : (func : SetStateAction<JSX.Element>)=>void}){

    const versions = [<Version3/>,<Version4a/>,<Version4b/>,<Version4c/>,<Version7/>]
    const description : {[version : string] : string} = {
      "Version3" : "basic version",
      "Version4a" : "Add insert text",
      "Version4b" :  "Add insert card",
      "Version4c" : "Add card bundle",
      "Version7" : "Add Intent and Triggers"
    }
    const buttons = versions.map((version)=>{
      return(
        <a key={version.type.name} className="versions" onClick={()=>func(version)}> Version {version.type.name} : {description[version.type.name]}</a>
      )
    })
    return(
      <div className="HomeButtons">
        {buttons}
      </div>
      )
}

export default function Home() {

  function changeState(newState : SetStateAction<JSX.Element>){
    setState(newState)
    setBase(false)
  }

  const [state, setState] = useState(<Buttons func={changeState}/>)
  const [base, setBase] = useState(true)

  return(
    <div className="index">
      {base? 
      <div>
        <h1>Choose version</h1>
      </div> : 
      <div className="head">
        <img src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg" onClick={() => {setState(<Buttons func={changeState}/>); setBase(true)}}/>
      </div> }
      {state}
    </div>
  )
}
