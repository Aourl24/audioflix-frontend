import React from "react";
import Link from "next/link"

export default function App(props){
	let genres = ["party","pop","electronic","romance"]

	return(
		<div class="container color-white">
			<div class="row my-3">
				<div class="col center sz-18 bold color-t">
					Audioflix
				</div>
			</div>

			<div class="row no-gutters justify-content-center">
				<div class="col-10 p-4 color-bg-s sz-md-18 m-2">
					Recommendations
				</div>
				<div class="col-10 p-4 color-bg-s sz-md-18 m-2">
					<Link href="/music" class="no-decoration color-white">Discover</Link>
				</div>
				<div class="col-10 p-4 color-bg-s sz-md-18 m-2">
					Generate Playlist
				</div>
			</div>
		</div>
		)
}


/*			<div class="row">
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