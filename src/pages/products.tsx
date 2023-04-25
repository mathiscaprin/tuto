import Vaniglia from './pictures/Vaniglia.webp'
import Capriccio from './pictures/Capriccio.webp'
import Napoli from './pictures/Napoli.webp'
import Galapagos from './pictures/Galapagos.webp'
import Etoudiante from './pictures/Etoudiante.jpg'
import { StaticImageData } from 'next/image'


export type Product = {
    name : string,
    description : string,
    price : number,
    pricePerTen : number,
    picture : string,
    link : string
}

export const coffees : Product[] = [
    {
        name : "Vaniglia",
        description : "Un café aromatisé onctueux au parfum de vanille réconfortant.",
        price : 0.49,
        pricePerTen : 4.9,
        picture : "https://www.nespresso.com/ecom/medias/sys_master/public/26731420483614/OL-Vaniglia.png?impolicy=product&imwidth=90",
        link : "https://www.nespresso.com/fr/fr/order/capsules/original/barista-vaniglia-caspule-cafe"
    },{
        name : "Capriccio",
        description : "Un café affirmé, avec une fine acidité. Notes de céréales.",
        price : 0.43,
        pricePerTen : 4.3,
        picture : "Capriccio",
        link : "https://www.nespresso.com/fr/fr/order/capsules/original/capriccio-capsule-cafe"
    },{
        name : "Napoli",
        description : "Le plus intense. Notes de cacao amer.",
        price : 0.46,
        pricePerTen : 4.6,
        picture : "Napoli",
        link : "https://www.nespresso.com/fr/fr/order/capsules/original/napoli-capsule-cafe"
    },{
        name : "Galapagos",
        description : "Un café rare, cultivé sur des sols riches en biodiversité.",
        price : 1.5,
        pricePerTen : 15,
        picture : "Galapagos",
        link : "https://www.nespresso.com/fr/fr/order/capsules/original/galapagos-caspule-cafe"
    },{
        name : "Etoudiante",
        description : "Un café au bon goût de pâtes qui ravira les papilles des jeunes et des moins jeunes",
        price : 0.05,
        pricePerTen : 0.5,
        picture : "Etoudiante",
        link : "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
]
