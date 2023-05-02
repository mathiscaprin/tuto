import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "./designpattern/singleton"
import { Product } from "./api/products"
import { AnyAaaaRecord } from "dns"

async function productAPI(){
  const res = await fetch(`http://localhost:3000/api/products`)
  const coffees = await res.json()
  return coffees
}

const instance = Singleton.getInstance()

function Profile({back, insertText, coffee} : {back : Dispatch<SetStateAction<string>>, insertText : (str : string)=>void, coffee : Product | undefined}){
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
          <h1>Products profile</h1>
          <button onClick={() => back("")}>X</button>
        </div>
        <h1>{coffee.name}</h1>
        <div className="profileTop">
          <img src={coffee.picture}/>
          <div className="top-right">
            <h2>{coffee.description}</h2>
            <button className="mainButton" onClick={()=>insertText(coffee.link)}>Send link</button>
          </div>
        </div>
        <div className="profileMiddle">
          <p>Price {coffee.price}€</p>
          <p>Price per ten {coffee.pricePerTen}€</p>
        </div>
      </div>
    )
  }
}

export default function Home4a() {

  const [coffees, setCoffees] = useState<Product[]>([])
  const [profile, setProfile] = useState("")

  useEffect(()=>{
    instance.setVariable((window as any).idzCpa.init())
    if (coffees.length == 0){
      productAPI().then((res : any)=> {
        setCoffees(res)
    })
    }
  })

  function insertText(text : string){
    console.log(instance.getVariable())
    instance.getVariable().then((client : any)=>{
      client.insertTextInComposeBox(text)
    })
  }
  
  const listCoffee = coffees.map(coffee=>{
    let promo = coffee.promo ? "red" : "black"

    return(
      <div onClick={()=>setProfile(coffee.name)} className="card">
        <img src={coffee.picture}/>
        <div className="card-right">
          <p>{coffee.name}</p>
        </div>
        <img className="greaterThan" src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg"/>
      </div>
    )
  })

  return (
    <div className="list">
      {profile=="" ? listCoffee : <Profile back={setProfile} insertText={insertText} coffee={coffees.findLast((coffee)=>coffee.name == profile)}></Profile> }
    </div>
  )
}