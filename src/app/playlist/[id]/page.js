"use client"
import React from "react"
import { useRouter ,useSearchParams } from 'next/navigation'
import {MusicList, MainLoader} from "../../component.js";
import {endpoint} from "../../endpoint.js";

export default function Main(){
	return(<> <PlaylistDetail /> </>)
}


function PlaylistDetail(){

  const [playlist ,setPlaylist] = React.useState()
  const router = useSearchParams()
  const id = router.get("id")

  React.useEffect(()=>{
    fetch(`${endpoint}/playlist/${id}/api`).then((x)=>x.json()).then((x)=>setPlaylist(x))
  },[])

  return(
      <div class="container positio h-100 colr-bg-p shadow">
          {!playlist && <MainLoader /> }
         <div class="row rounde my-3" style={{backgroundImage:`url(${playlist?.cover_photo})`,height:"10cm",backgroundRepeat:"no-repeat",objectFit:"cover",backgroundSize:"100%",backgroundPosition:"top"}}>              
              <div class="col col-md sz-36 color-white bordr-2 p-3">

          <div class="row align-items-end h-100">

          <div class="col-12">
          {playlist?.name}
          <div class="col-12 color-t sz-20 pb-3"> {playlist?.music.slice(0,3).map((x)=> x.artist + " , ")} </div>
          </div>
          
    </div>

            </div>
            </div>

        <div class="row my-3 d-none">
        <div class="col sz-20 color-t hide"> </div>
        <div class="col right"><span  class="cursor text-danger sz-20" onClick={()=>setPageSwitch("home")} style={{cursor:"pointer"}}> <i class="fas fa-arrow-left"></i>  </span> </div>
          
        </div>
        <br />

        <div>
           <MusicList data={playlist?.music} />
        </div>
      </div>
    )
}