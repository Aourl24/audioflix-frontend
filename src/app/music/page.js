import Main from "./view.js";
import axiox from "axios";
import {Suspense} from "react";

const fetchData = async () => {
  	try {
    const response = await axios.get('http://127.0.0.1:8000/musicapi');
    console.log(response.data)
    
  	} catch (error) {
    console.log('error occured')
  	}
  	return response.data
};

export default function App(){

	const Loading = ()=> {<p>Loading</p>}
	const data = fetchData()
	return(
		<>
		<Suspense fallback={<Loading />}>
			<Main data={data} />
		</Suspense>
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