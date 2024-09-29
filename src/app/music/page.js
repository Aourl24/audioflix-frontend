import Main from "./view.js";
import {Suspense} from "react";


export default function App(){

	const Loading = ()=> {<p>Loading</p>}
	return(
		<>
			<Main />
		</>
		)
}


// const options = {
//   method: 'GET',
//   url: 'https://spotify23.p.rapidapi.com/tracks/',
//   params: {
//     ids: '4WNcduiCmDNfmTEz7JvmLv'
//   },
//   headers: {
//     'X-RapidAPI-Key': 'b1539cf82fmsh9cecf507142d6a1p18f910jsn37b5e7b8bbd1',
//     'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
//   }
// };