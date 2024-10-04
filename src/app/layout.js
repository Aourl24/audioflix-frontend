"use client"
import { Inter } from "next/font/google";
import "./css/acss/acss.css";
import "./css/bootstrap-5/css/bootstrap.css";
import "./css/fontawesome/css/all.min.css";
import "./css/animate.min.css";
import "./globals.css";
import {PlayerContextProvider,Player,Menu,SearchBar,PlayingHistory} from "./component.js";
import Link from "next/link"
import React from "react"
import {usePathname,useRouter} from "next/navigation"

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  const path = usePathname()
  const router = useRouter()
  const [showMenu , setShowMenu] = React.useState()

  React.useEffect(()=>{
    setShowMenu()
  },[path])

  return (
    <html lang="en">
      <body className="font-montserrat color-bg-p">
      
      <PlayerContextProvider>
      <header class=" color-p sz-14 container-fluid color-bg-black sticky-top d-lg-none py-4" style={{maginRight:'-2px'}}>
      <div class="row p-2 sz-16 bold py-3">
        <div class="col col-md-2 font-slick">
           <span class="color-white"> Audi <i class="fas fa-play-circle color-white sz-20"></i> flix </span> 
        </div>
        <div  class="col right color-t center">
          <i class={`bold fas ${showMenu ? "fa-times":"fa-bars"} sz-24 d-md-none`} onClick={()=>setShowMenu((prev)=>!prev)}></i>
        </div>
      </div>
      </header>

      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <div class="row gx-md-5">


              <div class={`col-md-2 col-lg-2 col-12 sz-12  ${!showMenu && "d-none d-md-none"} d-lg-block p-0 m-0`} style={{backgrounColo:"#F5D0D0",height:"100vh"}}>
                              <div class="position-fixed m-0 container animate__animated animate__slideInLeft col-md-2 col-lg-2 color-bg-black" style={{backgroundColo:"#F5D0D0",height:"100vh",}} >
                                
                                <div class=" row p-3 sz-14 color-p sz-14 color-bg-black color-white d-none d-md-block center py-4" >
                                  <div class="col-12 p-2 px-4">
                                     Audi <i class="fas fa-play-circle color-white sz-16"></i> flix
                                  </div>
                                </div>
                  
              
                                <div class="row">
                                  <div class="col-12 p-4"> 
                                    <Link class="cursor color-t-hover sz-12 sz-sm-16 no-decoration color-white" style={{cursor:'pointer'}} href="/"><i class="fas fa-home rounded p-2 color-white color-bg-t sz-12 mx-2"></i> Home</Link> 
                                    </div>
                                  </div>
              
                                <div class="row">
                                  <div class="col-12 p-4"> 
                                    <Link class="cursor color-t-hover sz-12 no-decoration sz-sm-16 color-white" style={{cursor:'pointer'}} href="/search"><i class="fas fa-search rounded p-2 color-white color-bg-t sz-12 mx-2"></i> Search </Link>
                                  </div>
                                </div>
              
                                  <div class="row">
                                  <div class="col-12 p-4"> 
                                    <Link class="cursor color-t-hover sz-12 no-decoration color-white sz-sm-16" style={{cursor:'pointer'}} href="/history"><i class="fas fa-music rounded p-2 color-white color-bg-t sz-12 mx-2"></i> History</Link>
                                  </div>
                                </div>

                                <div class="row">
                                  <div class="col-12">
                                    
                                  </div>
                                </div>
              
                              </div>
                            </div>

              <div class="col">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/*showSearch && <div class="row position-absolute py-3 w-100 m-1 d-md-none">
              <div class="col"> <SearchBar className="col-12 w-100 py-3" /> </div>
            </div>*/}
      
      <br />
      <br />
      <br />
      <br class="d-md-block d-none" />
      <br class="d-md-block d-none" />
      <div id="fixed-bottom" class="fixed-bottom" style={{bottom:'0px'}} >
      
      <Player />
      </div>
      
      </PlayerContextProvider>
      </body>
    </html>
  );
}


