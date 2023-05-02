import { useEffect, useState } from "react"
import Singleton from "./designpattern/singleton"
import { Product } from "./api/products"

const instance = Singleton.getInstance()

async function productAPI(){
  const res = await fetch("http://localhost:3000/api/products")
  const coffees = await res.json()
  return coffees
}

export default function Home3() {
  
  const [coffees, setCoffees] = useState<Product[]>([])

  useEffect(()=>{
    instance.setVariable((window as any).idzCpa.init())
    if (coffees.length == 0){
      productAPI().then((res : any)=> {
        setCoffees(res)
    })
    }
  })

  const listCoffee = coffees.map(coffee=>{
    return(
      <div className="card">
        <img src={coffee.picture} className="coffeePic"/>
        <div className="card-right">
          <p >{coffee.name}</p>
        </div>
        <img className="greaterThan" src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg"/>
      </div>
    )
  })

  return (
    <div className="list">
      {listCoffee}
    </div>
  )
}