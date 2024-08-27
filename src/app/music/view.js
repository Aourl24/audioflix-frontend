"use client"
import React from "react";
import {SearchBar,SideBar,MusicBox} from "../component.js";
import avatar from './avatar.jpeg';
import Link from "next/link";
import {Suspense} from "react";
//import asake from "./asake.mp3"

export default function Main() {
  
// var [music , setMusic ] = React.useState([{title:'Yoga',album:'',artist:'Asake',size:'3.40mb',file:'asake.mp3',cover_photo:avatar,id:5},{title:'Another Music',album:'',artist:'Papy',size:'3.40mb',file:'music.mp3',cover_photo:avatar,id:6}])
 
 var [music , setMusic] = React.useState()
React.useEffect(()=>{
  //let url = "http://localhost:8000/musicapi"
  let url = "http://192.168.103.92:8000/musicapi"
  var data = fetch(url).then((x)=>
    x.json()).then((t)=>{
    console.log(t)
    setMusic(t)
  })
},[])

  return (
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="row">
            <div class="col">
              <SearchBar />
            </div>
          </div>
          <div class="row">
            <div class="col">
              {music && <MusicBox data={music} title="Trending Song"/> }
            </div>
          </div>
        </div>
        </div>
      </div>
  );
}