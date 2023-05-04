import { NextApiRequest, NextApiResponse } from "next"

import Cors from 'cors'
import { coffees } from "../products"

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

export default async function handler(req : NextApiRequest,res : NextApiResponse){
    console.log(req.query)
    const { query } = req
    const { id } = query
    const filtered = coffees.filter(coffee=>(coffee.name === id))

    res.status(200).json(filtered)
}