import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "../designpattern/singleton"
import { Product } from "../api/products";
import { api } from "../consts";
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

type Carousel = {
  title?:string;
  cards: Card[]
}

type Intent = {
  "key": string,
  "payload" : {
    any  : Product
  }
}

function Price( {coffee,perTen} : {coffee : Product, perTen : boolean}){
  let euro = Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  return( coffee.discount ? 
  <>
    <p><span className="previousPrice">{euro.format(coffee.price)}</span> {euro.format(coffee.price * coffee.discountAmount)}</p>
    {perTen ? <p><span className="previousPrice">{euro.format(coffee.pricePerTen)}</span> {euro.format(coffee.pricePerTen * coffee.discountAmount)} 10 pieces</p> : <></>}
  </> : 
  <> 
    <p>{euro.format(coffee.price)}</p>
    {perTen ? <p>{euro.format(coffee.pricePerTen)} 10 pieces</p> : <></>}
  </>
  )
}

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
              <Price coffee={coffee} perTen={true}/>
            </div>
            <div className="sendBundle">
              <button className="mainButton" onClick={()=>insertText(coffee.link)}>Send link</button>
              <button className="mainButton" onClick={()=>insertCard(coffee)}>Send card</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default function Version7() {
  const [usedWords, setUsedWords] = useState<string[]>([])
  const [coffees, setCoffees] = useState<Product[]>([])
  const [profile, setProfile] = useState("")

  useEffect(()=>{
    instance.setVariable((window as any).idzCpa.init({
      onIntent : handleIntent,
      onTrigger : handleTrigger
    }))
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

  function insertBundle(listProduct : Product[] = coffees){
    const carousel : Carousel = {
      title: "Coffee",
      cards : []
    }

    listProduct.forEach((coffee)=>{
      let card : Card = {
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
      carousel.cards.push(card)
    })
    instance.getVariable().then((client : any)=>{
      client.pushCardBundleInConversationThread(carousel)
    })
  }

  function handleIntent(intents : Intent[]){
    setUsedWords(intents.map(intent=>{
      return(
        intent.payload.any.name
      )
    }))
  }

  function handleTrigger(strings : string[]){
    setProfile(strings[0])
  }

  const listCoffee = coffees.map(coffee=>{
        return(
          <div onClick={()=>setProfile(coffee.name)}  className="card" key={coffee.name}>
          <div className="img-container">
            <img src={coffee.picture} className="coffeePic"/>
            {usedWords.includes(coffee.name) ?  <div className="dot"></div> : <></>}
          </div>
          <div className="card-right">
            <p>{coffee.name}</p>
            <div className="price">
              <Price coffee={coffee} perTen={false}/>
            </div>
          </div>
          <img className="greaterThan" src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg"/>
        </div>)
      }
  )

  return (
    <div>
      {profile === "" ? (
                <div>
                  <div className="list">
                    <div className="title">Products</div>
                    {listCoffee}
                    <div className="sendBundle">
                        <button className="mainButton" onClick={() => insertBundle()}>Send all</button>
                        <button className="mainButton" onClick={()=> insertBundle(coffees.filter((coffee) => coffee.discount))}>Send discount</button>
                    </div>
                  </div>
              </div>
      ):(
        <Profile back={setProfile} insertText={insertText} coffee={coffees.findLast((coffee)=>coffee.name == profile)} insertCard={insertCard}></Profile> 
      )}
    </div>
  )
}