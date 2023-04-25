import { useEffect } from "react"
import Singleton from "./designpattern/singleton"

const instance = Singleton.getInstance()

export default function Home() {

  useEffect(()=>{
    instance.setVariable = (window as any).idzCpa.init()
  })

  return (
    <div>
      <button>Envoyer</button>
    </div>
  )
}
