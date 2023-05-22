import type { NextApiRequest, NextApiResponse } from 'next'

export type Product = {
    id : number,
    name : string,
    description : string,
    price : number,
    pricePerTen : number,
    picture : string,
    link : string,
    discount : boolean,
    discountAmount : number
}

export type PartialProduct = {
  id : number,
  name : string,
  price : number,
  pricePerTen : number,
  picture : string,
  discount : boolean,
  discountAmount : number,
}

export const coffees : Product[] = [
    {
        id : 1,
        name : "Vaniglia",
        description : "The coffee blend's mellow, malted cereal notes bring a rounded, silky taste that elegantly complements classic vanilla.",
        price : 0.49,
        pricePerTen : 4.90,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/26731420483614/OL-Vaniglia.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/barista-vaniglia-caspule-cafe",
        discount : false,
        discountAmount : 1
    },{
        id : 2,
        name : "Capriccio",
        description : "Let the combination of light acidity and a savory cereal note surprise you in this refreshing but deep light-roasted Arabica-Robusta espresso blend.",
        price : 0.43,
        pricePerTen : 4.30,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/15900731801630/Capriccio-OL.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/capriccio-capsule-cafe",
        discount : false,
        discountAmount : 1
    },{
        id : 3,
        name : "Napoli",
        description : "Taste our tribute to the Italian coffee capital. A dark roasted Robusta-leavened blend delivers a thick, creamy cup and pleasantly bitter aftertaste.",
        price : 0.46,
        pricePerTen : 4.60,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/16452983881758/Napoli-OL.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/napoli-capsule-cafe",
        discount : true, 
        discountAmount : 0.7
    },{
        id : 4,
        name : "Jamaica Blue Mountain",
        description : "A coffee so treasured they ship it in specially crafted wood barrels SPECIAL RESERVE JAMAICA BLUE MOUNTAIN is rich in exotic woody and spice notes.",
        price : 1.50,
        pricePerTen : 15,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/16603612708894/MicrosoftTeams-image-19-.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/jamaica-blue-mountain-capsule-cafe-7726-50",
        discount : false,
        discountAmount : 1
    },{
        id : 5, 
        name : "Caramello",
        description : "The taste of sweet comfort that comes from blending in a biscuity caramel flavour into our silky-textured South American Arabicas.",
        price : 0.49,
        pricePerTen : 4.90,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/26728687829022/OL-Caramello.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/en/order/capsules/original/barista-caramello-caspule-cafe",
        discount : true,
        discountAmount : 0.8
    }
]

export default async function handler(req : NextApiRequest,res : NextApiResponse){
  res.status(200).json(coffees.map((coffee) => ({
      id: coffee.id,
      name: coffee.name,
      price: coffee.price,
      pricePerTen : coffee.pricePerTen,
      picture: coffee.picture,
      discount: coffee.discount,
      discountAmount: coffee.discountAmount,
    })))
}