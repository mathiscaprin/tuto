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

  const list = coffees.map((coffee)=>{
    return(
      <div>
        <button onClick={() => insertCard(coffee)}>Envoyer {coffee.name}</button>
      </div>
    )
  })


  return (
    <div>
      <button onClick={() => insertText}>Envoyer</button>
      {list}
    </div>
  )
}
