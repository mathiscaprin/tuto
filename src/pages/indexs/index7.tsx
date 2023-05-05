import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "../designpattern/singleton"
import { Product,PartialProduct } from "../api/products";
import { api } from "../consts";
const instance = Singleton.getInstance()

async function productAPI(){
  const res = await fetch(api)
  const coffees = await res.json()
  return coffees
}

async function getProduct(id : number) : Promise<Product>{
  const res = await fetch(api+ `/${id}`)
  const coffee = await res.json()
  console.log(coffee)
  return coffee
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

function Price({coffee,perTen} : {coffee : PartialProduct, perTen : boolean}){
  
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

function Profile({back, insertText, insertCard, coffee} : {back : Dispatch<SetStateAction<number>>, insertText : (str : string)=>void, insertCard : (id : number)=>void, coffee : Product}){

  return(
  <div className="profile">
    <div className="profileHeader">
      <p onClick={() => back(-1)}>Back</p>
      <h2 id="coffeeName">{coffee.name}</h2>
    </div>
    <div className="profileTop">
      <img src={coffee.picture}/>
      <div className="top-right">
        <p>{coffee.description}</p>
        <div className="price">
          <Price coffee={{id: coffee.id,name: coffee.name,price: coffee.price,pricePerTen : coffee.pricePerTen,picture: coffee.picture,discount: coffee.discount,discountAmount: coffee.discountAmount}} perTen={true}/>
        </div>
        <div className="sendBundle">
          <button className="mainButton" onClick={()=>insertText(coffee.link)}>Send link</button>
          <button className="mainButton" onClick={()=>insertCard(coffee.id)}>Send card</button>
        </div>
      </div>
    </div>
  </div>
)
    
  
}

export default function Version7() {
  const [usedWords, setUsedWords] = useState<string[]>([])
  const [coffees, setCoffees] = useState<PartialProduct[]>([])
  const [profile, setProfile] = useState(-1)
  const [profileCoffee, setProfileCoffee] = useState({
    id : -1,
    name : "",
    description : "",
    price : 0,
    pricePerTen : 0,
    picture : "",
    link : "",
    discount : false,
    discountAmount : 1
})

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

  function launchProduct(id : number){
    getProduct(id).then(
      coffee=>{
        setProfileCoffee(coffee)
        console.log("oui"+coffee.id)
        setProfile(id)
      }
    )
  }

  function insertText(text : string){
    console.log(instance.getVariable())
    instance.getVariable().then((client : any)=>{
      client.insertTextInComposeBox(text)
    })
  }

  function insertCard(id : number){
    getProduct(id).then((coffee)=>{
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
    })
    
  }

  function insertBundle(listIDProduct : number[] = coffees.map(coffee=>coffee.id)){
    const carousel : Carousel = {
      title: "Coffee",
      cards : []
    }
    const promises = listIDProduct.map((id)=>{
      return(getProduct(id))
    })

    Promise.all(promises).then(coffee=>{coffee.forEach((coffee=>{
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
    }))
    instance.getVariable().then((client : any)=>{
      client.pushCardBundleInConversationThread(carousel)
    })
      
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
    const product = coffees.findLast((coffee)=>coffee.name == strings[0])
    if (typeof product != "undefined"){
      setProfile(product.id)
    }
  }



  const listCoffee = coffees.map(coffee=>{
        return(
          <div onClick={()=>launchProduct(coffee.id)}  className="card" key={coffee.name}>
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
      {profile === -1 ? (
                <div>
                  <div className="list">
                    <div className="title">Products</div>
                    {listCoffee}
                    <div className="sendBundle">
                        <button className="mainButton" onClick={() => insertBundle()}>Send all</button>
                        <button className="mainButton" onClick={()=> insertBundle(coffees.filter((coffee) => coffee.discount).map(coffee=>coffee.id))}>Send discount</button>
                    </div>
                  </div>
              </div>
      ):(
        <Profile back={setProfile} insertText={insertText} coffee={profileCoffee} insertCard={insertCard}></Profile> 
      )}
    </div>
  )
}