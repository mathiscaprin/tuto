import { NextApiRequest, NextApiResponse } from "next"
import { coffees } from "../products"

export default async function handler(req : NextApiRequest,res : NextApiResponse){
    const { query } = req
    const { id } = query
    const filtered = coffees.find(coffee=>(coffee.id.toString() === id))
    res.status(200).json(filtered)
}