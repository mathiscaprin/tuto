import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "../designpattern/singleton"
import { Product,PartialProduct } from "../api/products";
import { api } from "../consts";

const instance = Singleton.getInstance()

async function productAPI(jwt: string) : Promise<[PartialProduct[], number, string]>{
  //jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  const res = await fetch(api, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}` // Add the JWT to the Authorization header
    }
  })
  let coffees : any[] = []
  if (res.status == 200){
     coffees = await res.json()
  }
  return [coffees,res.status,res.statusText]
}

async function getProduct(id : number, jwt:string) : Promise<[Product, number, string]>{
  //jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

  const res = await fetch(api+ `/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}` // Add the JWT to the Authorization header
    }
  })
  const coffee = await res.json()
  return [coffee, res.status, res.statusText]
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

function Profile({back, insertText, insertCard, coffee} : {back : Dispatch<SetStateAction<number>>, insertText : (str : string)=>void, insertCard : (id : number)=>void, coffee : Product}){

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
  const [jwt, setJwt] = useState("")
  const [getProductsError, setGetProductsError] = useState<[number,string]>([0,""])
  const [getProductError, setGetProductError] = useState<[number, string]>([200,""])
  const [showAlert, setShowAlert] = useState(false)
  const [lastTriggerDatas, setLastTriggerDatas] = useState<string[]>([])
  let triggerData : string[] = []

  useEffect(()=>{
    instance.setVariable((window as any).idzCpa.init({
      onIntent : handleIntent,
      onTrigger : handleTrigger
    }))
    
    if (!called){
      setCalled(true)
      instance.getVariable().then((client : any)=>{
        client.getJWT().then(
          (newJwt : string)=>{
            setJwt(newJwt)
            productAPI(newJwt).then((res : [PartialProduct[],number,string])=> {
              const tempCoffees = res[0]
              setCoffees(tempCoffees)
              setGetProductsError([res[1],res[2]])
              if (triggerData.length != 0){
                const product = tempCoffees.findLast((coffee)=>coffee.name == triggerData[0])
                if (typeof product != "undefined"){
                  launchProduct(product.id,newJwt)
                }
              }
            })
          }
        )
      })
    }
  })

  function launchProduct(id : number, newjwt = jwt){
    //jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    console.log(newjwt)
    getProduct(id,newjwt).then((result  : [Product, number, string])=>{
      setGetProductError([result[1],result[2]])
      if (result[1] == 200){
        setProfileCoffee(result[0])
        setProfile(id)
      }else{
          setShowAlert(true)
          setTimeout(() => {
             setShowAlert(false)
          }, 2000)
      }
    })
  }

  function insertText(text : string){
    instance.getVariable().then((client : any)=>{
      client.insertTextInComposeBox(text)
    })
  }

  function insertCard(id : number){
    getProduct(id,jwt).then((result  : [Product, number, string])=>{
      const coffee = result[0]
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
      return(getProduct(id,jwt))
    })

    Promise.all(promises).then(coffees=>{coffees.forEach(((result : [Product, number, string])=>{
      const coffee = result[0]
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

  function handleTrigger(productNames : string[]){
    if (coffees.length == 0){
      triggerData = productNames
    }else{
      const product = coffees.findLast((coffee)=>coffee.name == productNames[0])
      if (typeof product != "undefined"){
        launchProduct(product.id)
      }
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
                    {getProductsError[0] != 200 ? <p className="rejectMessage">Erreur {getProductsError[0] + " : " + getProductsError[1]}</p> : <></>}
                    {listCoffee}
                    <div className="sendBundle">
                      <button className="mainButton purpleButton" onClick={() => insertBundle(coffees.filter((coffee => usedWords.includes(coffee.name))).map(coffee=>coffee.id))}>Send suggestions</button>
                      <button className="mainButton" onClick={()=> insertBundle(coffees.filter((coffee) => coffee.discount).map(coffee=>coffee.id))}>Send discounted</button>
                    </div>                  
                  </div>
                  {showAlert ? 
                    <div className="alert">
                      <p>{getProductError[0] + " : " + getProductError[1]}</p>
                    </div>  :
                    <></>
                }
                  
              </div>
      ):(
        <Profile back={setProfile} insertText={insertText} coffee={profileCoffee} insertCard={insertCard}></Profile> 
      )}
    </div>
  )
}

