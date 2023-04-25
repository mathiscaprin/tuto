import { useEffect } from "react"
import Singleton from "./designpattern/singleton"
import { AnyAaaaRecord } from "dns"

const instance = Singleton.getInstance()

export default function Home() {

  useEffect(()=>{
    instance.setVariable((window as any).idzCpa.init())
    console.log(instance.getVariable())

  })

  function insertText(){
    console.log(instance.getVariable())
    instance.getVariable().then((client : any)=>{
      client.insertTextInComposeBox("Hello World")
    })
  }

  return (
    <div>
      <button onClick={insertText}>Envoyer</button>
    </div>
  )
}
