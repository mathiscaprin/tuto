import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "../designpattern/singleton"
import { Product } from "../api/products"
import { api } from "../consts"

const instance = Singleton.getInstance()

async function productAPI(){
  const res = await fetch(api)
  const coffees = await res.json()
  return coffees
}

type Action = {
  type: "LINK";
  title: string;
  url: string;
};

type Card = {
  title?: string;
  text?: string;
  actions: Action[];
  image?: {
      url: string;
      description: string;
  }
};

function Profile({back, insertText, insertCard, coffee} : {back : Dispatch<SetStateAction<string>>, insertText : (str : string)=>void, insertCard : (coffee : Product)=>void, coffee : Product | undefined}){
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
          <p onClick={() => back("")}>Back</p>
          <h2 id="coffeeName">{coffee.name}</h2>
        </div>
        <div className="profileTop">
          <img src={coffee.picture}/>
          <div className="top-right">
            <p>{coffee.description}</p>
            <div className="price">
              <p>{coffee.price}€</p>
              <p>{coffee.pricePerTen}€ 10 pieces</p>
            </div>
            <div>
              <button className="mainButton" onClick={()=>insertText(coffee.link)}>Send link</button>
              <button className="mainButton" onClick={()=>insertCard(coffee)}>Send card</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default function Version4b() {
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

  function insertCard(coffee : Product){
    const card : Card = {
      title : coffee.name,
      text : coffee.description,
      actions : [
        {
          type : "LINK",
          title : coffee.name,
          url : coffee.link
        }
      ],
      image : {
        url : coffee.picture,
        description : coffee.name 
      }
    }
    instance.getVariable().then((client : any)=>{
      client.pushCardInConversationThread(card)
    })
  }
  const listCoffee = coffees.map(coffee=>{
    return(
      <div onClick={()=>{setProfile(coffee.name)}} className="card" key={coffee.name}>
        <img src={coffee.picture} className="coffeePic"/>
        <div className="card-right">
          <p>{coffee.name}</p>
        </div>
        <img className="greaterThan" src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg"/>
      </div>
    )
  })

  return (
    <div>
     {profile=="" ? 
      <div className="list">
        <div className="title">Products</div>
        {listCoffee}
     </div> : <Profile back={setProfile} insertText={insertText} coffee={coffees.findLast((coffee)=>coffee.name == profile)} insertCard={insertCard}></Profile> }
    </div>
  )
}