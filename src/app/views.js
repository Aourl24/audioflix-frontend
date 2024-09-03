import React from "react";
import Link from "next/link"
import Image from "next/image"
import {SearchBar} from "./component.js"

export default function App(props){
	let genres = ["party","pop","electronic","romance"]

	return(
		<div class="container color-white">
		<div class="row d-md-none">
		<div class="col py-4">
		<SearchBar />
		</div>
		</div>
			<div class="row align-items-stretch align-items-md-center justify-content-center gx-md-4 gy-0 vh-80 vh-md-90 font-adventor" stye={{marginTop:'-40px'}}>

				<div class="col-12 col-md sz-36 color-white bordr-2 border-start p-3">

					<div class="row">

					<div class="col-12">
					Find Your Rhythm
					</div>
					<div class="col-12 color-t sz-20 pb-3"> Personalized Music Journey Just for you </div>
					<div class="col-12 d-md-block d-none py-3">
		<SearchBar />
		</div>
		
		<div classs="col">
		<div class="row align-items-center gx-1">
		<div class="col">
		<hr class="d-block d-md-none" />
		</div>

		<div class="col">

			<button class="color-bg-t p-3 no-border color-white sz-18 no-decoration rounded-3 w-100"> Discover Music </button>
		</div>
		</div>
		</div>


				</div>
				</div>
				<div class="col-12 col-md order-first p-3">
					<img src="lady.jpg"  class="img-fluid rounded h-100 cover"/>
				</div>
			</div>
		</div>

				)
}



/*		<div class="row">
				{genres.map((genre)=>{
					return(
						<div class="col col-md-6 m-2">
						<div class="rounded color-bg-t p-3">
						{genre}
						</div></div>	
					)	
				})
				}
			</div>
*/