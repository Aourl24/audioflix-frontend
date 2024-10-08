"use client"
import React from "react";
import {Playlist,MainLoader} from "../component.js"
import {endpoint} from "../endpoint.js"

export default function App(){
	const [playlist , setPlaylist] = React.useState([])
	const [page , setPage] = React.useState()


	React.useEffect(()=>{
		if(page){
		fetch(`${endpoint}/playlistviewapi/${page}`).then((x)=>x.json()).then((x)=>{setPlaylist((prev)=>[...prev,...x.data])
		if(x.has_next) setPage((prev)=>prev+1)
		console.log(x.data)
	}
			)
		
	}
	else{
		setPage(1)
	}
	
	},[page])


	return(
			<div class="container">
			<div class="row my-md-4 my-3">
              <div class="col sz-20 font-montserrat-bold color-t">  Playlist Made for You  </div>
             </div>
             {!playlist && <MainLoader />}

             {playlist && <div  class="row">
                            {playlist.map((x)=>(
                              <div class="col-md-3 col-6 p-4"> <Playlist data={x} /> </div>  
                            ))}
                            </div>}

            </div>

		)
}