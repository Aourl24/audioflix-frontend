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
  const [showSearch, setShowSearch] = React.useState()
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
    
    <header class=" color-p sz-14 container-fluid color-bg-t sticky-top" style={{maginRight:'-2px'}}>
      <div class="row p-2 sz-16 bold py-3">
        <div class="col font-slick">
           <span class=""> audioflix </span> 
        </div>
        <div  class="col d-md-none right">
          <i class={`fas ${showSearch ? "fas fa-times" : "fa-search"}`} onClick={()=>setShowSearch((prev)=>!prev)}></i>
        </div>
      </div>
      </header>
      
      {showSearch && <div class="row position-absolute py-3 w-100 m-1 d-md-none">
              <div class="col"> <SearchBar className="col-12 w-100 py-3" /> </div>
            </div>}

    <div class="container-fluid">


      <div class="row">
        <div class="col">
          <div class="row gx-md-5">
          <div class="col-2 d-none d-md-none d-lg-block p-0 m-0" style={{backgroundColor:"#F5D0D0",height:"100vh"}}>
          <div class="position-fixed m-0 container col-md-2" style={{backgroundColor:"#F5D0D0",height:"100vh",}} >
            <div class="gy-4  row p-3 sz-16 color-black" >
            <div class="col-12 center pr-3 font-great hide">
           <span class="">  </span> Audio flix
        </div>
  
                <div class="col-12 py-3"> <SearchBar className="col-md-11 rounded-4" /> </div>
                <div class="col-12 py-3"> 
                <span class="cursor color-t-hover" style={{cursor:'pointer'}} onClick={()=>setPageSwitch("home")}><i class="fas fa-home rounded p-2 color-white color-bg-t sz-14 mx-2"></i> Home</span> 
                </div>
                <div class="col-12 py-3"> <span class="cursor color-t-hover" style={{cursor:'pointer'}} onClick={()=>setPageSwitch("history")}> <i class="fas fa-music rounded p-2 color-white color-bg-t sz-14 mx-2"></i> Playing History</span> </div>
                <div class="col-12 position-absolut hide" style={{bottom:"-400px"}}> <button class="color-bg-t color-white rounded p-3 no-border"> Subscribe </button> </div>
            </div>
            </div>
          </div>
          <div class="col">
            <PageSwitch page={pageswitch} />
          </div>
        </div>
      </div>
      </div>
      </div>
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
        <div class="row color-white pointer-cursor" onClick={()=>showDetail()}>
            <div class="rounded color-bg-silve col p-0" style={{height:""}}>
            <img class="img-flui cover rounded" style={{height:"5cm",width:"100%"}} src={data.cover_photo} /> <div class="sz-16 psition-absolute py-md p-3" style={{marginTop:"-40px"}}><span class=" color-white ">{data.name}</span></div>
              <div class="py-3 color-silver sz-sm-12">{data.music.slice(0,3).map((x)=> x.artist + " , ")} and others </div>
            </div>
        </div>
        </>
    )
}

function PlaylistDetail(){

  const [playlist ,setPlaylist] = React.useState()
  const {setPageSwitch,data} = React.useContext(PageContext)

  React.useEffect(()=>{
    // fetch(`http://127.0.0.1:8000/playlist/${id}/api`).then((x)=>x.json()).then((x)=>setPlaylist(x))
  },[])

  return(
      <div class="container positio h-100 colr-bg-p shadow">
          
         <div class="row rounded-4 my-3" style={{backgroundImage:`url(${data.cover_photo})`,height:"10cm",backgroundRepeat:"no-repeat",objectFit:"cover",backgroundSize:"100%",backgroundPosition:"top"}}>              
              <div class="col col-md sz-36 color-white bordr-2 p-3">

          <div class="row align-items-center h-100">

          <div class="col-12">
          {data.name}
          <div class="col-12 color-t sz-20 pb-3"> {data.music.slice(0,3).map((x)=> x.artist + " , ")} and others </div>
          </div>
          
    </div>

            </div>
            </div>

        <div class="row my-3">
        <div class="col sz-20 color-t hide"> {data.name} </div>
        <div class="col right"><span  class="cursor text-danger sz-20" onClick={()=>setPageSwitch("home")} style={{cursor:"pointer"}}> <i class="fas fa-arrow-left"></i>  </span> </div>
          
        </div>
        <br />

        <div>
           <MusicList data={data.music} />
        </div>
      </div>
    )
}

function SearchBar({className}) {
  const searchBar = React.useRef();
  const {setPageSwitch,setData} = React.useContext(PageContext)

  let fetchData = ()=>{
    let url = `${endpoint}/searchapi/` + searchBar.current.value
  //let url = "http://192.168.96.92:8000/searchapi/" + searchBar.current.value
  var data = fetch(url).then((x)=>
    x.json()).then((t)=>{
    setPageSwitch("search")
    setData(t)
  })
  }

  return (
    <>
      
        <input ref={searchBar} type='search' className={`no-decoration no-border rounded-2 sz-16 color-black color-p p-2 p-md-3 ${className}`} placeholder="search music" onChange={()=>fetchData()} />     

    </>
  );
}

function SearchResult(props){
  const {setPageSwitch,data} = React.useContext(PageContext)
  return(
      <div class="container">
        <div class="row my-3">
        <div class="col sz-20 color-t"> Search Result </div>
        <div class="col right color-silver sz-14"><span  class="cursor" onClick={()=>setPageSwitch("home")} style={{cursor:"pointer"}}> <i class="fas fa-arrow-left"></i>  </span> </div>
          
        </div>

        <div>
           <MusicList data={data} />
        </div>

      </div>
    )
}