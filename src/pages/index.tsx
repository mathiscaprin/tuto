import Example from "./indexs/index4a";

export default function Home() {

  async function productAPI(){
    const res = await fetch("http://localhost:3000/api/products/Vaniglia")
    const coffees = await res.json()
    return coffees
  }

  console.log(productAPI())
  return(
    <Example/>
  )
}
