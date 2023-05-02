import Vaniglia from './pictures/Vaniglia.webp'
import Capriccio from './pictures/Capriccio.webp'
import Napoli from './pictures/Napoli.webp'
import Galapagos from './pictures/Galapagos.webp'
import Etoudiante from './pictures/Etoudiante.jpg'
import { StaticImageData } from 'next/image'
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

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



export type Product = {
    name : string,
    description : string,
    price : number,
    pricePerTen : number,
    picture : string,
    link : string,
    promo : boolean,
    valeurPromo : number
}

export const coffees : Product[] = [
    {
        name : "Vaniglia",
        description : "The coffee blend's mellow, malted cereal notes bring a rounded, silky taste that elegantly complements classic vanilla.",
        price : 0.49,
        pricePerTen : 4.90,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/26731420483614/OL-Vaniglia.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/barista-vaniglia-caspule-cafe",
        promo : false,
        valeurPromo : 1
    },{
        name : "Capriccio",
        description : "Let the combination of light acidity and a savory cereal note surprise you in this refreshing but deep light-roasted Arabica-Robusta espresso blend.",
        price : 0.43,
        pricePerTen : 4.30,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/15900731801630/Capriccio-OL.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/capriccio-capsule-cafe",
        promo : false,
        valeurPromo : 1
    },{
        name : "Napoli",
        description : "Taste our tribute to the Italian coffee capital. A dark roasted Robusta-leavened blend delivers a thick, creamy cup and pleasantly bitter aftertaste.",
        price : 0.46,
        pricePerTen : 4.60,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/16452983881758/Napoli-OL.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/napoli-capsule-cafe",
        promo : true, 
        valeurPromo : 0.7
    },{
        name : "Jamaica Blue Mountain",
        description : "A coffee so treasured they ship it in specially crafted wood barrels SPECIAL RESERVE JAMAICA BLUE MOUNTAIN is rich in exotic woody and spice notes.",
        price : 1.50,
        pricePerTen : 15,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/16603612708894/MicrosoftTeams-image-19-.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/jamaica-blue-mountain-capsule-cafe-7726-50",
        promo : false,
        valeurPromo : 1
    },{
        name : "Caramello",
        description : "The taste of sweet comfort that comes from blending in a biscuity caramel flavour into our silky-textured South American Arabicas.",
        price : 0.49,
        pricePerTen : 4.90,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/26728687829022/OL-Caramello.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/barista-caramello-caspule-cafe",
        promo : true,
        valeurPromo : 0.8
    }
]

export default async function handler(req : NextApiRequest,res : NextApiResponse){
    res.status(200).json(coffees)
}
