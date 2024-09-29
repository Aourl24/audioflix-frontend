"use client"
import React from "react";
import {SideBar,MusicBox,PlayingHistory,MusicList,Playlist,MainLoader} from "./component.js";
import Link from "next/link";
import {Suspense} from "react";
import Image from "next/image";
//import asake from "./asake.mp3"
import {endpoint} from "./endpoint.js"
import {useRouter} from "next/navigation"

export default function Main() {
  const [refresh,setRefresh] = React.useState(1)
  var [music , setMusic] = React.useState()
  const [playlist ,setPlaylist] = React.useState()

  React.useEffect(()=>{
  let url = `${endpoint}/musicapi`
  //let url = "http://192.168.96.92:8000/musicapi"
  var data = fetch(url).then((x)=>
    x.json()).then((t)=>{
    setMusic(t)
  })
  
},[refresh])

  React.useEffect(()=>{
      fetch(`${endpoint}/playlistviewapi`).then((x)=>x.json()).then((x)=>setPlaylist(x))
  },[])

  return(
    
    <Home setRefresh={setRefresh} music={music} playlist={playlist} />
    )
}


function Home({playlist, music, setRefresh}) {
  
// var [music , setMusic ] = React.useState([{title:'Yoga',album:'',artist:'Asake',size:'3.40mb',file:'asake.mp3',cover_photo:avatar,id:5},{title:'Another Music',album:'',artist:'Papy',size:'3.40mb',file:'music.mp3',cover_photo:avatar,id:6}]) 
 const scroll = React.useRef()
 const [scrollValue, setScrollValue] = React.useState(100)
 const images = ["guy.jpeg","lady.jpeg"]
 const [chosenImage, setChosenImage] = React.useState(0)
 const router = useRouter()

const changeScroll = (verdict) =>{
  
  scroll.current.scroll({left:scrollValue ,behaviour:"auto"}) 
 
  if(verdict) setScrollValue((prev)=>prev + 100 )
  else setScrollValue((prev)=>prev - 100 )
}

React.useEffect(()=>{
const timer = setTimeout(()=>setChosenImage((prev)=>prev+1 >= images.length ? 0 : prev+1),5000)
return ()=> clearTimeout(timer)
},[chosenImage])


  return (
            
            <div class="container-fluid">
          
          <div class="row ">
            <div class="col">
            <div class="row rounded-4 my-md-1 align-items-center color-bg-p hero-poster" style={{backgroundImage:`url(${images[chosenImage]})`,heigh:"8cm",backgroundRepeat:"no-repeat",objectFit:"cover",backgroundSize:"100%",}}>              
              <div class="col col-md sz-36 color-white bordr-2 p-3">

          <div class="row">

          <div class="col-12 font-montserrat-bold sz-sm-30 center">
          Find Your Rhythm
          <div class="col-12 color-t sz-18 display-sm-non py-2">
          <input class="rounded-5 no-border p-3 sz-14 col-md-6 col-8" type="search" onClick={()=>router.push("/search")} placeholder="Search For music" />
          <span class=" color-bg-p color-t rounded p-2 d-none w-100"> Personalized Music Journey Just for you </span></div>
          </div>
          
    </div>

    </div>

            </div>
            </div>

            <div class="col p-2 display-sm-none d-none">

            <div class="row ronded-4 my-3 my-md-3 align-items-center color-bg-p hero-poster" style={{backgroundImage:`url(${images[chosenImage + 1]})`,heigh:"8cm",backgroundRepeat:"no-repeat",objectFit:"cover",backgroundSize:"100%",}}>              
              <div class="col col-md sz-36 color-white bordr-2 p-3">
    
    </div>

            </div>
</div>
            </div>
            <br />
            <div class="row my-3">
              <div class="col sz-20 font-montserrat-bold color-t">  Playlist for You  </div>
              <div class="col right"> <Link href="/playlist" class="no-decoration color-white sz-12"> view all </Link> </div>
            </div>

              {playlist && <div ref={scroll} class="d-flex" style={{overflow:"auto"}}>
                            {playlist.map((x)=>(
                              <div class="col-md-3 col-6 px-3 px-md-4"> <Playlist data={x} /> </div>  
                            ))}
                            </div>}

              {!playlist && <MainLoader /> }

                <div class="row my-4 sz-16 color-white display-sm-none">
                  <div class="col "><i class="fas fa-chevron-left" onClick={()=>changeScroll()}></i></div>
                  <div class="col right" ><i class="fas fa-chevron-right" onClick={()=>changeScroll(true)}></i></div>
                </div>

            <br />
            <div class="row">
              <div class="col sz-20 color-t font-montserrat-bold"> Quick Music </div>
              <div class="col right"> <span class="no-decoration color-white sz-12 pointer-cursor" onClick={()=>setRefresh((prev)=>prev+1)}> refresh </span> </div>
            </div>

              <div class="">{music && <MusicBox data={music} />  } </div>
              {!music && <MainLoader /> }
            </div>
        
  );
}



