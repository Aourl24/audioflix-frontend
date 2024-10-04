"use client"
import React from "react"
import {MusicList} from "../component.js"
import {endpoint} from "../endpoint.js"

export default function Main(){
	  const searchBar = React.useRef();
	  const [result , setResult] = React.useState()

  let fetchData = ()=>{
    let url = `${endpoint}/searchapi/` + searchBar.current.value
  //let url = "http://192.168.96.92:8000/searchapi/" + searchBar.current.value
  var data = fetch(url).then((x)=>
    x.json()).then((t)=>{
    setResult(t)
  })
  }

  React.useEffect(()=>{
    searchBar.current.focus()
  },[])

  return (
    <div class="container">
    <div class="row my-3">
    <div class="col">
        <input ref={searchBar} type='search' className={`no-decoration no-border rounded-2 sz-16 color-black color-p p-3 w-100  `} placeholder="search music" onChange={()=>fetchData()} />     
        </div>
        </div>

        

        <div>
           {result && <><MusicList data={result} /></> }
           {result?.length == 0 && <div class="sz-16 center text-danger">Music not found!!! </div>}
        </div>

      </div>
   
  )
}