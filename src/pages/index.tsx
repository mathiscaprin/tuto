import { SetStateAction, useState } from "react"
import Version3 from "./indexs/index3";
import Version4a from "./indexs/index4a";
import Version4b from "./indexs/index4b";
import Version4c from "./indexs/index4c";
import Version7 from "./indexs/index7";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'



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
        <a key={version.type.name} className="versions" onClick={()=>func(version)}>{version.type.name} : {description[version.type.name]}</a>
      )
    })
    return(
      <div className="homeButtons">
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

  // return(
  //   <div className="index">
  //     {base? 
  //     <div>
  //       <h1>Choose version</h1>
  //     </div> : 
  //     <div className="head">
  //       <img src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg" onClick={() => {setState(<Buttons func={changeState}/>); setBase(true)}}/>
  //     </div> }
  //     {state}
  //   </div>
  // )

  return(
    <Router>
      <Switch>
        <Route path="/about">
          <h1>About</h1>
        </Route>
        <Route path="/blog">
          <h1>Blog</h1>
        </Route>
        <Route path="/">
          <h1>Home</h1>
        </Route>
      </Switch>
    </Router>
  )
}
