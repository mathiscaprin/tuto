import { SetStateAction, useEffect, useState } from "react"
import Singleton from "./designpattern/singleton"
import { coffees, Product } from "./api/products";
const instance = Singleton.getInstance()
import Home3 from "./index3";
import Home4a from "./index4a";
import Home4b from "./index4b";
import Home4c from "./index4c";
import Home7 from "./index7"


function Buttons({func} : {func : (func : SetStateAction<JSX.Element>)=>void}){
  
    const versions = [<Home3/>,<Home4a/>,<Home4b/>,<Home4c/>,<Home7/>]
    const buttons = versions.map((version)=>{
      return(
        <button onClick={()=>func(version)}> Version {version.type.name}</button>
      )
    })
    return(
      <div>
        {buttons}
      </div>
      )
}

export default function Home() {

  function changeState(newState : SetStateAction<JSX.Element>){
    setState(newState)
  }

  const [state, setState] = useState(<Buttons func={changeState}/>)

  return(
    <div style={{padding:10}}>
      {state}
      <hr/>
      <button onClick={() => setState(<Buttons func={changeState}/>)}>retour</button>
    </div>
  )

}
