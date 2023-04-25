import type { NextApiRequest, NextApiResponse } from 'next'

type  Message = {
	id : string,
	authorType: string,
	text: string
}



export default async function handler(req : NextApiRequest,res : NextApiResponse){

}