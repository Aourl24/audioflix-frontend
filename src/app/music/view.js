"use client"
import React from "react";
import {SideBar,MusicBox,PlayingHistory,MusicList} from "../component.js";
import avatar from './avatar.jpeg';
import Link from "next/link";
import {Suspense} from "react";
import Image from "next/image";
//import asake from "./asake.mp3"
import {endpoint} from "../endpoint.js"
const PageContext = React.createContext()

export default function Main() {
  const [pageswitch , setPageSwitch] = React.useState("home")
  const [data,setData] = React.useState()
  var [music , setMusic] = React.useState()
  const [playlist ,setPlaylist] = React.useState()

  React.useEffect(()=>{
  let url = `${endpoint}/musicapi`
  //let url = "http://192.168.96.92:8000/musicapi"
  var data = fetch(url).then((x)=>
    x.json()).then((t)=>{
    setMusic(t)
  })
  
  fetch(`${endpoint}/playlistviewapi`).then((x)=>x.json()).then((x)=>setPlaylist(x))
},[])

  return(
    <PageContext.Provider value={{setPageSwitch,data,setData,pageswitch,music,playlist}}>
    
    <Home />

      </PageContext.Provider>
    )
}

function PageSwitch({page}){
  if(page === "home"){
    return (<><Home /></>)
  }
  else if (page === "history"){
    return(<><PlayingHistory /></>)
  }
  else if(page === "detail"){
    return (<> <PlaylistDetail /> </> )
  }
  else if(page === "search"){
    return(<> <SearchResult /> </> )
  }
}


function Home(props) {
  
// var [music , setMusic ] = React.useState([{title:'Yoga',album:'',artist:'Asake',size:'3.40mb',file:'asake.mp3',cover_photo:avatar,id:5},{title:'Another Music',album:'',artist:'Papy',size:'3.40mb',file:'music.mp3',cover_photo:avatar,id:6}])
const {music ,playlist} = React.useContext(PageContext) 
 const scroll = React.useRef()
 const [scrollValue, setScrollValue] = React.useState(100)

const changeScroll = (verdict) =>{
  
  scroll.current.scroll({left:scrollValue ,behaviour:"auto"}) 
 
  if(verdict) setScrollValue((prev)=>prev + 100 )
  else setScrollValue((prev)=>prev - 100 )
}


  return (
            
            <div class="container-fluid">
    
            <div class="row rounded-4 my-md-3 align-items-center" style={{backgroundImage:"url('lady.jpg')",height:"8.5cm",backgroundRepeat:"no-repeat",objectFit:"cover",backgroundSize:"100%",backgroundPosition:"top"}}>              
              <div class="col col-md sz-36 color-white bordr-2 p-3">

          <div class="row">

          <div class="col-12 font-montserrat-bold">
          Find Your Rhythm
          <div class="col-12 color-t sz-20"> Personalized Music Journey Just for you </div>
          </div>
          
    </div>

            </div>
            </div>
    
            <div class="row my-md-4 my-3">
              <div class="col sz-20 color-t">  Playlist Made for You  </div>
            </div>

              {playlist && <div ref={scroll} class="d-flex" style={{overflow:"auto"}}>
                            {playlist.map((x)=>(
                              <div class="col-md-3 col-6 p-4"> <Playlist data={x} /> </div>  
                            ))}
                            </div>}

                <div class="row my-3 sz-16 color-white d-md-block d-none">
                  <div class="col"><i class="fas fa-chevron-left" onClick={()=>changeScroll()}></i></div>
                  <div class="col right" ><i class="fas fa-chevron-right" onClick={()=>changeScroll(true)}></i></div>
                </div>

            
            <div class="row my-3">
              <div class="col sz-20 color-t"> Quick Music </div>
            </div>

              <div>{music && <MusicBox data={music} />  } </div>
            </div>
        
  );
}



function Playlist({data}){
  const {setPageSwitch,setData} = React.useContext(PageContext)

  const showDetail = ()=>{
  
    setData(data)
    setPageSwitch("detail")
  }

  return(
        <>
        <Link class="row color-white pointer-cursor no-decoration" href={{pathname:`playlist/${data.id}`,query:{id:data.id}}} onClick={()=>showDetail()}>
            <div class="rounded color-bg-silve col p-0" style={{height:""}}>
            <img class="img-flui cover rounded" style={{height:"5cm",width:"100%"}} src={data.cover_photo} /> <div class="sz-16 psition-absolute py-md p-3" style={{marginTop:"-40px"}}><span class=" color-white ">{data.name}</span></div>
              <div class="py-3 color-silver sz-sm-12">{data.music.slice(0,3).map((x)=> x.artist + " , ")} and others </div>
            </div>
        </Link>
        </>
    )
}


