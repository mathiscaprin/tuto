import { useEffect, useState } from "react";
import Example from "./indexs/index7";
import Singleton from "./designpattern/singleton";
import { Product } from "./api/products";
import { api } from "./consts";


const instance = Singleton.getInstance()

async function productAPI(){
  const res = await fetch(api)
  const coffees = await res.json()
  return coffees
}

export default function Home() {
  // const [coffees, setCoffees] = useState<Product[]>([])

  // useEffect(()=>{
  //   instance.setVariable((window as any).idzCpa.init({
  //     onIntent : handleIntent,
  //     onTrigger : handleTrigger,
  //   }))
  //   if (coffees.length == 0){
  //     productAPI().then((res : any)=> {
  //       setCoffees(res)
  //   })
  //   }
  // })

  return(
    <Example />
  )
}
