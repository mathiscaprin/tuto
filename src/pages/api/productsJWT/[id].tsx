import { NextApiRequest, NextApiResponse } from "next"

import Cors from 'cors'
import { coffees } from "../products"
import { jwtMiddleware } from "../jwtMiddleware"

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

const handler = async (req : NextApiRequest,res : NextApiResponse)=>{
    const { query } = req
    const { id } = query
    const filtered = coffees.find(coffee=>(coffee.id.toString() === id))
    res.status(200).json(filtered)
}

export default jwtMiddleware(handler)