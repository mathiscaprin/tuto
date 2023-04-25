import { useEffect } from "react"
import Singleton from "./designpattern/singleton"
import { coffees, Product } from "./products";
const instance = Singleton.getInstance()

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


export default function Home() {

  useEffect(()=>{
    instance.setVariable((window as any).idzCpa.init())
  })

  function insertText(){
    instance.getVariable().then((client : any)=>{
      client.insertTextInComposeBox("Hello World")
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

  function insertBundle(){
    const carousel : Carousel = {
      title: "Coffee",
      cards : []
    }

    coffees.forEach((coffee)=>{
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

  const list = coffees.map((coffee)=>{
    return(
      <div>
        <button onClick={() => insertCard(coffee)}>Envoyer {coffee.name}</button>
      </div>
    )
  })



  return (
    <div>
      <button onClick={() => insertText}>Send</button>
      {list}
      <button onClick={insertBundle}>Send everything</button>
    </div>
  )
}
