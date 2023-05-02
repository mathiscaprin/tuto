import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "./designpattern/singleton"
import { Product } from "./api/products";
const instance = Singleton.getInstance()


async function productAPI(){
  const res = await fetch(`http://localhost:3000/api/products`)
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

function Profile({back, insertText, insertCard, coffee} : {back : Dispatch<SetStateAction<string>>, insertText : (str : string)=>void, insertCard : (coffee : Product)=>void, coffee : Product | undefined}){
  if (typeof coffee == "undefined"){
    return(
      <div>
        <p>Error</p>
        <button onClick={() => back("")}>Return</button>
      </div>
    )
  }else{

    let euro = Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
    });
    const price = coffee.promo ? 
    <>
      <p>Price <span style={{textDecoration : "line-through"}}>{euro.format(coffee.price)}</span> {euro.format(coffee.price * coffee.valeurPromo)}</p>
      <p>Price per ten <span style={{textDecoration : "line-through"}}>{euro.format(coffee.pricePerTen)}</span> {euro.format(coffee.pricePerTen * coffee.valeurPromo)}</p>
    </> : 
    <>
      <p>Price {euro.format(coffee.price)}</p>
      <p>Price per ten {euro.format(coffee.pricePerTen)}</p>
    </>
    
    return(
      <div className="profile">
        <div className="profileHeader">
          <h1 id="productProfile">Product profile: </h1>
          <h1 id="coffeeName">{coffee.name}</h1>
          <button onClick={() => back("")}>X</button>
        </div>
        <div className="profileTop">
          <img src={coffee.picture}/>
          <div className="top-right">
            <p>{coffee.description}</p>
            <div>
              <button className="mainButton" onClick={()=>insertText(coffee.link)}>Send link</button>
              <button className="mainButton" onClick={()=>insertCard(coffee)}>Send card</button>
            </div>
          </div>
        </div>
        <div className="profileMiddle">
          {price}
        </div> 
      </div>
    )
  }
}



export default function Home7() {
  const [usedWords, setUsedWords] = useState<string[]>([])
  const [wordsInMessage, setWordsInMessage] = useState<string[]>([])
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
    setWordsInMessage(strings)
  }

  const listCoffee = coffees.map(coffee=>{
      if (wordsInMessage.length == 0 || wordsInMessage.includes(coffee.name)){
        return(
          <div onClick={()=>setProfile(coffee.name)}  className="card">
          <img src={coffee.picture} className="coffeePic"/>
          <div style={{padding:5, borderRadius:10}}className="card-right">
            <p>{coffee.name}{coffee.promo ? <p>En Promo</p> : <></>}</p>

          </div>
          <img className="greaterThan" src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg"/>
        </div>
        )
      }else{
        return(
          <></>
        )
      }
  })

  const listUsed = coffees.map(coffee=>{
    return(
      usedWords.includes(coffee.name) ? <p onClick={()=>setProfile(coffee.name)} >{coffee.name}</p> : <></>
    )
  })

  return (
    <div>
      {wordsInMessage.length == 0 ? <></> : <button onClick={()=>setWordsInMessage([])}>Return</button>}
      {profile === "" ? (
                <div>
                  {usedWords.length == 0 ? <></> : 
                  <div className="listUsed">
                    <p>Suggestions :</p> 
                    {listUsed}
                  </div>}
                  <div className="list">
                    {listCoffee}
                  </div>
                  <div className="sendBundle">
                      <button className="mainButton" onClick={() => insertBundle()}>Send all</button>
                      <button className="mainButton" onClick={()=> insertBundle(coffees.filter((coffee) => coffee.promo))}>Send Promo</button>
                  </div>
              </div>
      ):(
        <Profile back={setProfile} insertText={insertText} coffee={coffees.findLast((coffee)=>coffee.name == profile)} insertCard={insertCard}></Profile> 
      )}
    </div>
  )
}