import { useEffect, useState } from "react";
import Singleton from "./designpattern/singleton";
import { Product } from "./api/products";
import { api } from "./consts";
import Example from "./indexs/index8";


const instance = Singleton.getInstance()

export default function Home() {

  return(
    <Example />
  )
}
