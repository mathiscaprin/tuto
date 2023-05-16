import { NextApiRequest, NextApiResponse } from "next"

import { coffees } from "../products"
import { jwtMiddleware } from "../jwtMiddleware"

const handler = async (req : NextApiRequest,res : NextApiResponse)=>{
    const { query } = req
    const { id } = query
    const filtered = coffees.find(coffee=>(coffee.id.toString() === id))
    res.status(200).json(filtered)
}

export default jwtMiddleware(handler)