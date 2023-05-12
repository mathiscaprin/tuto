import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "../designpattern/singleton"
import { Product,PartialProduct } from "../api/products";
import { apiJWT } from "../consts";
import jwt from 'jsonwebtoken';
import { UUID } from "crypto";
import { copyFile } from "fs";

const instance = Singleton.getInstance()

async function productAPI(jwt: string){
  const res = await fetch(apiJWT, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}` // Add the JWT to the Authorization header
    }
  })
  const coffees = await res.json()
  return coffees
}

async function getProduct(id : number) : Promise<Product>{
  const res = await fetch(apiJWT+ `/${id}`)
  const coffee = await res.json()
  return coffee
}


type ApplePayPaymentRequestType = {
    requestIdentifier: UUID;
    payment: ApplePayPaymentRequest;
    receivedMessage: ApplePayReceivedMessage;
}

// Detail for payment field type
type ApplePayPaymentRequest = {
  currencyCode: string;
  lineItems: PaymentItem[];
  requiredBillingContactFields: ApplePayContactField[];
  requiredShippingContactFields: ApplePayContactField[];
  shippingMethods: ShippingMethod[];
  total: PaymentItem;
}

type PaymentItem = {
  amount: string;
  label: string;
  type: string;
};

enum ApplePayLineItemType {
  "final",
  "pending",
}

type ShippingMethod = {
  amount: string;
  detail: string;
  identifier: string;
  label: string;
};

enum ApplePayContactField {
  email = 'email',
  name = 'name',
  phone = 'phone',
  postalAddress = 'postalAddress',
  phoneticName = 'phoneticName',
}

// type for receivedMessage field
type ApplePayReceivedMessage = {
  type: 'CARD';
  data: CardType;
}

type CardType = {
  title?: string;
  text?: string;
  image?: CardImage;
  actions: LinkAction[];
};

type CardImage = {
  url: string;
  description: string;
};

type LinkAction = {
  type: 'LINK';
  title: string;
  url: string;
};

// Error
type ActionError = {
    message: string;
    details?: string[];
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
    {perTen ? <p><span className="previousPrice">{euro.format(coffee.pricePerTen)}</span> {euro.format(coffee.pricePerTen * coffee.discountAmount)} - 10 pieces</p> : <></>}
  </> : 
  <> 
    <p>{euro.format(coffee.price)}</p>
    {perTen ? <p>{euro.format(coffee.pricePerTen)} - 10 pieces</p> : <></>}
  </>
  )
}

function Profile({back, insertText, insertCard, insertPay, coffee} : {back : Dispatch<SetStateAction<number>>, insertText : (str : string)=>void, insertCard : (id : number)=>void, insertPay : (id : number, qty : number)=>void, coffee : Product}){

  return(
  <div className="profile">
    <div className="profileHeader">
      <button onClick={() => back(-1)}>Back</button>
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
          <button className="mainButton" onClick={()=>insertPay(coffee.id,10)}>Send Pay</button>
        </div>
      </div>
    </div>
  </div>
)
    
  
}

export default function Version8() {

  const [usedWords, setUsedWords] = useState<string[]>([])
  const [coffees, setCoffees] = useState<PartialProduct[]>([])
  const [profile, setProfile] = useState(-1)
  const [called, setCalled] = useState(false)
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
    
    if (!called){
      instance.getVariable().then((client : any)=>{
        client.getJWT().then(
          (jwt : string)=>{
            //jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            productAPI(jwt).then((res : any)=> {
              setCoffees(res)
              setCalled(true)
            })
          }
        )
      })
    }
  })


  function launchProduct(id : number){
    getProduct(id).then(
      coffee=>{
        setProfileCoffee(coffee)
        setProfile(id)
      }
    )
  }

  function insertText(text : string){
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

  function insertBundle(productList : number[] = coffees.map(coffee=>coffee.id)){
    const carousel : Carousel = {
      title: "Coffee",
      cards : []
    }
    const promises = productList.map((id)=>{
      return(getProduct(id))
    })

    Promise.all(promises).then(coffees=>{coffees.forEach((coffee=>{
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

  function insertPay(id : number, quantity : number){
    getProduct(id).then(
        coffee=>{
            const applePayPaymentRequest: ApplePayPaymentRequestType = {
                requestIdentifier: `${"3b2153a4"}-${"ef36"}-${"11ed"}-${"a05b"}-${"0242ac120003"}`, // UUID
                payment: {
                    currencyCode: "USD",
                    lineItems: [
                        {
                            amount: quantity.toString(),
                            label: coffee.name,
                            type : "final"
                        }
                    ],
                    requiredBillingContactFields: [ApplePayContactField.email],
                    requiredShippingContactFields: [ApplePayContactField.email],
                    shippingMethods: [
                        {
                            amount: quantity.toString(),
                            detail: "Available within an hour",
                            identifier: "in_store_pickup",
                            label: "In-StorePickup"
                        }
                    ],
                    total: {
                        amount: quantity.toString(),
                        label: "TOTAL",
                        type: "final"
                    }
                },
                receivedMessage: {
                    type: "CARD",
                    data: {
                        title: "Please check this payment request",
                        text: "Check this payment request and choose your shipping method",
                        actions: [],
                    }
                }
            }
            console.log(applePayPaymentRequest)
            instance.getVariable().then(
                (client:any)=>{
                    client.pushApplePayPaymentRequestInConversationThread(applePayPaymentRequest)
                }
            )
        }
      )
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
                    {coffees.length == 0 && called ? <p className="rejectMessage">Erreur</p> : <></>}
                    {listCoffee}
                    <div className="sendBundle">
                      <button className="mainButton purpleButton" onClick={() => insertBundle(coffees.filter((coffee => usedWords.includes(coffee.name))).map(coffee=>coffee.id))}>Send suggestions</button>
                      <button className="mainButton" onClick={()=> insertBundle(coffees.filter((coffee) => coffee.discount).map(coffee=>coffee.id))}>Send discounted</button>
                    </div>                  
                  </div>
              </div>
      ):(
        <Profile back={setProfile} insertText={insertText} coffee={profileCoffee} insertCard={insertCard} insertPay={insertPay}></Profile> 
      )}
    </div>
  )
}

