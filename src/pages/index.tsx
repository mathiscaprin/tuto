import { useEffect, useState } from "react";
import Singleton from "./designpattern/singleton";
import { Product } from "./api/products";
import { api } from "./consts";
import Example from "./indexs/index3";


const instance = Singleton.getInstance()

async function productAPI(){
  const res = await fetch(api)
  const coffees = await res.json()
  return coffees
}

type Intent = {
  "key": string,
  "payload" : {
    any  : Product
  }
}

export default function Home() {
   const [coffees, setCoffees] = useState<Product[]>([])

  function handleIntent(intents : Intent[]){

  }

  function handleTrigger(string : string[]){

  }

  //  useEffect(()=>{
  //    instance.setVariable((window as any).idzCpa.init({
  //      onIntent : handleIntent,
  //      onTrigger : handleTrigger,
  //    }))
  //    if (coffees.length == 0){
  //      productAPI().then((res : any)=> {
  //        setCoffees(res)
  //    })
  //    }
  //  })
  return(
    <Example />
  )
}
