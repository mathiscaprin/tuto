import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { coffees } from './products'

const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
})

function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function
  ) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
  
        return resolve(result)
      })
    })
  }


type Message = {
	id : string,
	authorType: string,
	text: string
}

type Action = {
    "highlight":string,
    "intent":{
        "key": string,
        "payload" : {
            any  : any
        }
    }
}
    
type Commande = {
    "type": string,
    "messageId": string,
    "actions": Action[]
}

export default async function handler(req : NextApiRequest,res : NextApiResponse){
    await runMiddleware(req, res, cors)
    const commandes : Commande[] = []
    const messages = req.body.messages
    messages.forEach((message : Message) => {
        coffees.forEach(coffee =>{
            if (message.text.includes(coffee.name)){
                commandes.push(
                  {
                    "type": "addMessageActions",
                    "messageId": message.id,
                    "actions": [
                      {
                        "highlight": coffee.name,
                        "intent": {
                          "key": coffee.name,
                          "payload": {
                            any : coffee,
                          }
                        }
                      }
                    ]
                  },
                )
              }
        })
    });
    res.send({
        "commands" : commandes
      })
}