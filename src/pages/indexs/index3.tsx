import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "../designpattern/singleton"
import { Product } from "../api/products"

const instance = Singleton.getInstance()

async function productAPI(){
  const res = await fetch("http://localhost:3000/api/products")
  const coffees = await res.json()
  return coffees
}

function Profile({back, coffee} : {back : Dispatch<SetStateAction<string>>, coffee : Product | undefined}){
  if (typeof coffee == "undefined"){
    return(
      <div>
        <p>Error</p>
        <button onClick={() => back("")}>Return</button>
      </div>
    )
  }else{
    return(
      <div className="profile"> 
        <div className="profileHeader">
          <img src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg" onClick={() => back("")}/>
          <h2 id="coffeeName">{coffee.name}</h2>
        </div>
        <div className="profileTop">
          <img src={coffee.picture}/>
          <div className="top-right">
            <p>{coffee.description}</p>
            <p>{coffee.price}€</p>
            <p>Per ten {coffee.pricePerTen}€</p>
          </div>
        </div>
      </div>
    )
  }
}

export default function Example() {

  const [coffees, setCoffees] = useState<Product[]>([])
  const [profile, setProfile] = useState("")

  useEffect(()=>{
    instance.setVariable((window as any).idzCpa.init())
    if (coffees.length == 0){
      productAPI().then((res : any)=> {setCoffees(res)})
    }
  })


  const listCoffee = coffees.map(coffee=>{
    return(
      <div onClick={()=>{setProfile(coffee.name)}} className="card" key={coffee.name}>
        <img src={coffee.picture} className="coffeePic"/>
        <div className="card-right">
          <p>{coffee.name}</p>
          {}
        </div>
        <img className="greaterThan" src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg"/>
      </div>
    )
  })

  return (
    <div>
    {profile=="" ? (    
      <div className="list">        
      <div className="title">Product</div>
      {listCoffee}
    </div>
      ) : (
      <Profile back={setProfile} coffee={coffees.findLast((coffee)=>coffee.name == profile)}></Profile>
      )
   }
  </div>
  )
}