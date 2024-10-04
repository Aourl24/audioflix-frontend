"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link"

const PlayerContext = React.createContext();

export function PlayerContextProvider({ children }) {
  const [currentTrack, setCurrentTrack] = React.useState();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioDuration = React.useRef()
  const [currentTime, setCurrentTime] = React.useState(0);
  const [playingSign, setPlayingSign] = React.useState(false);
  const currentAudio = React.useRef();
  const [nextTrack, setNextTrack] = React.useState();
  const [previousTrack, setPreviousTrack] = React.useState();
  const [random , setRandom] = React.useState(false)
  const [repeat , setRepeat] = React.useState(false)
  const [history , setHistory] = React.useState([])
  const audioManager = React.useRef({})

  const readableTime = (x) => {
    const minutes = Math.floor(x / 60);
    const seconds = Math.floor(x % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

const getOrCreateAudio = (src) => {
    if (!audioManager.current[src]) {
        audioManager.current[src] = new Audio(src);
        audioManager.current[src].preload = 'auto'; // Set preload to auto
        audioManager.current[src].load(); // Load the audio file
    }
    return audioManager.current[src];
}

  const letPlay = (trackSrc) => {

    setCurrentTrack(trackSrc)
    
    if (currentAudio.current) {
      currentAudio.current.pause();
    }
    

    currentAudio.current = getOrCreateAudio(trackSrc.file);
    currentAudio.current.currentTime = 0
    if(!currentAudio.current.duration || isNaN(currentAudio.current.duration)){
      currentAudio.current.addEventListener("loadedmetadata", () => audioDuration.current = currentAudio.current.duration)
    }
      else{
        audioDuration.current = currentAudio.current.duration
        
      }
    currentAudio.current.addEventListener("timeupdate", () => setCurrentTime(currentAudio.current.currentTime));
    currentAudio.current.play();
    setIsPlaying(true);
  };

  const letPause = () => {
    if (currentAudio.current) {
      currentAudio.current.pause();
    }
    setIsPlaying(false);
  };

 const resumePlay = () => {
    if (currentAudio.current) {
      currentAudio.current.play();
    }
    setIsPlaying(true);
  };

  const playNextTrack = () => {
    //currentAudio.current.currentTime = currentAudio.current.duration
    //letPlay(nextTrack);
    if(repeat){
      letPlay(currentTrack)
    }
    else{
      letPlay(nextTrack)
    }
  };

  const playPreviousTrack = () => {
    letPlay(previousTrack);
  };

  React.useEffect(() => {
      setCurrentTime(0)
      if(currentTrack) setHistory((prev)=>[currentTrack,...prev.filter((x)=> x.id !== currentTrack.id)])    
  }, [currentTrack]);

  React.useEffect(()=>{     
    let checkhistory = localStorage.getItem('PlayingHistory')
    try{let data = JSON.parse(checkhistory)}
    catch(e){
      var data = []
      console.log(e)
    }
    console.log(data)
    if (checkhistory) setHistory(data ? [...data] : []) 
  },[])

  React.useEffect(()=>{
        if(history.length) localStorage.setItem('PlayingHistory',JSON.stringify(history))
  },[history])

  React.useEffect(()=>{
    if(repeat){
    currentAudio.current.addEventListener("ended",()=>{
      letPlay(currentTrack)
    })}
  },[repeat])

  React.useEffect(()=>{
    if(currentAudio.current){
    currentAudio.current.addEventListener('ended', ()=> repeat ? letPlay(currentTrack) :letPlay(nextTrack))
    getOrCreateAudio(nextTrack.file)
  }
    
  },[nextTrack])

  return (
    <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying, letPlay, audioDuration,currentTime, setCurrentTime, playingSign, setPlayingSign, letPause, currentAudio, resumePlay, playNextTrack, setNextTrack, previousTrack, setPreviousTrack, playPreviousTrack ,nextTrack,random,repeat,setRepeat,setRandom, readableTime, history, setHistory}}>
      {children}
    </PlayerContext.Provider>
  );
}

function usePlayer() {
  return React.useContext(PlayerContext);
}


function Play({ type, size }) {
  const { resumePlay } = usePlayer();

  return (
    <>
      <i onClick={resumePlay} style={{ cursor: "pointer" }} className={`${!type ? "fas fa-play" : "fas fa-play-circle"} ${size}`}></i>
    </>
  );
}

function Pause({ type, size }) {
  const { letPause } = usePlayer();

  return (
    <>
      <i onClick={letPause} style={{ cursor: "pointer" }} className={`${!type ? "fas fa-pause" : "fas fa-pause-circle"} ${size}`}></i>
    </>
  );
}

function Control({ size, type }) {
  const { isPlaying } = usePlayer();
  return (
    <span class="d-inline-block">
      {isPlaying ? <Pause size={size} type={type} /> : <Play size={size} type={type} />}
    </span>
  );
}

function SeekBar(props){
    const {currentAudio,currentTime,audioDuration,currentTrack} = usePlayer()
    const seekBar = React.useRef();
    const [seek, setSeek] = React.useState(false)

  const handleSeekBarInput = () => {
      const time = (seekBar.current.value / 100) * currentAudio.current.duration;
      setSeek(true)
      currentAudio.current.currentTime = time;

      
    };

  React.useEffect(() => {
    const percent = (currentTime / audioDuration.current) * 100;

  if (!seek) {
    seekBar.current.value = percent;}
  setSeek(false)
  }, [currentTime]);


  React.useEffect(()=>{
    seekBar.current.value = 0
  },[currentTrack])

  return(
          <>
            <input onInput={()=>handleSeekBarInput()} className="color-s" type="range" ref={seekBar}></input>
          </>
    )
}

export function PlayerFullBox({ toggleFullScreen }) {
  const { currentTrack, currentTime, audioDuration, playNextTrack, setCurrentTime, currentAudio, playPreviousTrack, isPlaying ,random ,repeat ,setRepeat,setRandom,readableTime} = usePlayer();
  
  const [option ,setOption] = React.useState(false)
  

  React.useEffect(()=>{

  },[currentTrack])

  return (
    <div className="container-fluid color-bg-s position-fixed vh-100 p-3 animate__animated animate__slideInUp" style={{ top: '0', backgroundRepeat: 'no-repeat', left: '0', right: '0', zIndex: '1000000' ,overflow:"none",heigh:'100%'}}>
      <div className="row color-white py-3 py-md-4">
        <div className="col">
          <button className="btn btn-link color-white left" onClick={toggleFullScreen}><i className="fas fa-chevron-down sz-16 color-white"></i></button>
        </div>
        <div className="col center sz-12">Now Playing</div>
        <div className="col right"><i style={{cursor:"pointer"}} className={`sz-16 fas ${option ? "fas fa-times text-danger" :"fa-ellipsis-v"}`} onClick={()=>setOption((prev)=>!prev)}></i>
        </div>
      </div>
      

      {option && <OptionBar items={currentTrack} close={()=>setOption((prev)=>!prev)}/>}

      <div className="row py-3" style={{backgroundImage: `url(${currentTrack.cover_photo})`,backgroundSize:"100%",backgroundBlur:"2",filter:"blur('2')",height:''}}>
        <div className="col-md col-sm-12 center">
          <img src={currentTrack.cover_photo} className="img-fluid rounded-3" style={{ width: 'auto', height: '450px', objectFit: 'cover' }} />
        </div>
      </div>
      <br />

<div class="row align-items-end">
      <div class="col">
      <div className="row my-md-2 my-1">
        <div className="col-12 sz-20 color-white">{currentTrack.title}</div>
        <div className="col color-grey sz-14">{currentTrack.artist}</div>
      </div>

      <br />
      <div className="row bold pt-2 pt-md-0">
        <div className="col-12">
          <SeekBar />
        </div>
      </div>

      <div className="row">
        <div className="col sz-12 color-grey" style={{ textAlign: 'left' }}>{readableTime(currentTime)}</div>
        <div className="col sz-12 color-grey" style={{ textAlign: 'right' }}>{readableTime(audioDuration.current)}</div>
      </div>
      </div>

      <br />

      <div class="col-12 col-md">
      
      <div className="row color-white m-0 justify-content-center align-items-center mt-4 mt-md-0" style={{marginTo:'800px'}}>

      <div className="col-2 col-md-2 center">
            <i onClick={()=>setRandom((prev)=>!prev)} style={{cursor:"pointer"}} className={`fas fa-random ${random ? 'color-t':'color-grey'} sz-30`}></i>
        </div>

        <div className="col-2 col-md-2 center">
            <i onClick={playPreviousTrack} className="fas fa-step-backward color-t sz-36" style={{cursor:"pointer"}}></i>
        </div>

        <div className="col col-md center">
          <Control size="sz-24 color-t sz-72 " type="play-circle" />
        </div>

        <div className="col-2 col-md-2 center">
            <i className="fas fa-step-forward color-t sz-36" style={{cursor:"pointer"}}  onClick={playNextTrack} ></i>
        </div>

        <div className="col-2 col-md-2 center">
            <i style={{cursor:"pointer"}} onClick={()=>setRepeat((prev)=>!prev)}  className={`fas fa-redo ${repeat ? 'color-t':'color-grey'} sz-30`}></i>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export function PlayerSmallBox({ toggleFullScreen }) {
  const { currentTrack, playNextTrack, playPreviousTrack, readableTime , audioDuration ,currentTime } = usePlayer();

  return (
    <div id="" className="container-fluid p-2 py-md-3 animate__animated animate__slideInUp">
      <div className="row align-items-center rounded bg-lig color-bg-s p-2 m-1 sh dow color-white py-2 py-md-3">
        <div className="col-10 col-md-3" onClick={toggleFullScreen} style={{ cursor: "pointer" }}>
          <div className="row align-items-center gx-2">
            <div className="col-2 col-md-2">
              <img src={currentTrack.cover_photo} className="img-flui" style={{ width: '55px', height: '55px', objectFit: 'cover' }}  />
            </div>
            <div className="col px-4 px-md-5">
              <div className="sz-14 font-poppins">{currentTrack.title}</div>
              <div className="color-silver sz-12">{currentTrack.artist}</div>
            </div>
          </div>
        </div>
        <div className="col-1 col-md-6 d-none display-sm-none  d-md-block">
        <div class="row">
        <div class="col-1 right">{readableTime(currentTime)} </div>
        <div class="col"><SeekBar /> </div>
        <div class="col-1">{audioDuration.current ? readableTime(audioDuration.current) : "0.00"}</div>
         </div>
        </div>         
        <div className="col-1 col-md-1 display-sm-none">
          <button className="btn no-decoration color-dark-white color-white" onClick={playPreviousTrack}>
            <i className="fas fa-step-backward color-t sz-20"></i>
          </button>
        </div>
        <div className="col-1 col-md-1"><Control size="sz-36 color-t" type="circle" /></div>
        <div className="col-1 col-md-1 display-sm-none">
          <button className="btn no-decoration color-dark-white sz-14 color-white" onClick={playNextTrack}>
            <i className="fas fa-step-forward color-t sz-20"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Player(props) {
  const [fullscreen, setFullScreen] = React.useState(false);
  const { currentTrack } = usePlayer();

  const toggleFullScreen = () => {
    setFullScreen((prev) => !prev);
  };

  return (
    <>
      {currentTrack && (
        <div class="">
          {fullscreen ? <PlayerFullBox toggleFullScreen={toggleFullScreen} /> : <PlayerSmallBox toggleFullScreen={toggleFullScreen} />}
        </div>
      )}
    </>
  );
}

export function SideBar({ items }) {
  const navItems = items || [
    { name: 'Home', url: '' },
    { name: 'Discover', url: '' },
    { name: 'Radio', url: '' },
    { name: 'Artist', url: '' },
    { name: 'Library', url: '' }
  ];

  return (
    <div className='container'>
      {navItems.map((x) => (
        <div className='row m-2' key={x.name}>
          <div className='col p-2 sz-20'>
            <a className="no-decoration color-dark-white" href={x.url}>{x.name}</a>
          </div>
        </div>
      ))}
    </div>
  );
}

function OptionBar({ items , mini, close}) {
  const {nextTrack,currentTrack,repeat,setNextTrack} = usePlayer();

  return (
    <div className='col-md-6 container col-12 position-fixed rounded-4 color-bg-black  p-4 color-white shadow animate__animated animate__slideInUp' style={{bottom:'0',zIndex:"1000000000",arginLeft:'-10px',left:0}}>
    
    <div  class="row right sz-24">
      <div class="col"> <i onClick={()=>close()} class="fas fa-times text-danger pointer-cursor"></i>
      </div>
    </div>

      {!mini && <> <div class="row left">
              <div class="col sz-16 bold py-2">
                Now Playing {repeat && <span class="sz-14 color-grey"> On repeat </span>}
              </div>
            </div>
      
            <div class="row py-2 left">
              <div class="col-12">
              <Music data={currentTrack} />
              </div>
            </div>
      
            <hr />
            {nextTrack &&<>
            <div class="row left">
            <div class="col sz-16 left bold py-2">
                Next Track
              </div>
            </div>
      
            <div class="row py-2 left">
            <div class="col-12">
              <Music data={nextTrack} />
            </div>
            </div></>} <hr /> </>}

      
      <div class="row my-4  left">
      <div class="col color-t sz-18">
        <i class="fas fa-music"></i> {items.title} - <span class="color-grey">{items.artist}</span>
      </div>
      </div>

      <div class="row left sz-14">
        <div class="col-1"> <i class="fas fa-download"></i> </div> 
        <div class="col"> Download track </div>
      </div>

      <div class="row py-3 sz-14 left">
        <div class="col-1"> <i class="fas fa-share"></i> </div><div class="col"> Share Track </div>
      </div>

      <div class="row left sz-14">
        <div class="col-1"> <i class="fas fa-download"></i> </div> 
        <div class="col pointer-cursor" onClick={()=>{setNextTrack(items);close()}}> Play Next </div>
      </div>

    </div>
  );
}

export function MusicBox({data}) {

  const { currentTrack, setCurrentTrack, letPlay, setNextTrack, setPreviousTrack, nextTrack , currentAudio,playNextTrack,random,repeat} = usePlayer();
  const [shuffle,setShuffle] = React.useState()

  const nextSong = (x) => {
    const index = data.findIndex((item) => item.id === currentTrack?.id);
    let next;
    if(random){
      next = data[Math.floor(Math.random()*data.length)]
    }

    else{
    if (index + 1 === data.length) {
      next = data[0];

    } else {
      next = data[index + 1];
    }
  }

  if(!x){
    setNextTrack(next) }
     else{
      return next
    }
  };

  const previousSong = (x)=>{
    const index = data.findIndex((item) => item.id === currentTrack?.id);
    let previous;
    if(index === 0){
      previous = data[data.length -1]
    }
    else{
      previous = data[index - 1] 
    }
    setPreviousTrack(previous)
  }

  React.useEffect(() => {
    
    if (currentTrack) {
      currentAudio.current.addEventListener('ended', ()=> repeat ? letPlay(currentTrack) :letPlay(nextSong(true)));
    }
    nextSong()
    previousSong()
  }, [currentTrack,random]);

  return (
    <div className="container-fluid">
     {data && <MusicList data={data} /> }
    </div>
  );
}

export function MusicList({data}){
  
  React.useEffect(()=>{
    
  },[])

  return(
    <>
    {data &&
      <div className='row'>
        {data.map((x) => (
          <div className="col-12 col-md-12 rounded p-2 my-2" key={x.id}>
            <Music data={x}/>        
          </div>
        ))}
      </div>
    }
    </>
    )
}


function Music(props){
  let {letPlay , currentTrack , currentAudio,isPlaying, audioDuration} = usePlayer()
  let [showOption , setShowOption] = React.useState()

  return(
    <div className="row align-items-center">
      <div className="col-2 col-md-1 gx-0 right">
        <img src={props.data.cover_photo} className="img-flui" style={{ width: '55px', height: '55px', objectFit: 'cover' }} loading="lazy" />
      </div>
      <div className="col no-decoration px-3" onClick={() => letPlay(props.data)} style={{ cursor: "pointer" }}>
        <div className="row">
          <div className={`col-12 sz-14 ${props.data.title === currentTrack?.title ? "color-t":"color-white"}`}>{props.data.title}</div>
          <div className="col-12 sz-10 color-grey sz-12" style={{ color: '#d7' }}>{props.data.artist}</div>
        </div>
      </div>
      <div class="col-2 color-t">
        {props.data.title === currentTrack?.title && !currentAudio.current.duration && <i class="spinner-border"></i>}
      </div>
      <div class="col-1 right color-grey">
        <i class={`fas ${showOption ? "fas fa-times color-red" : "fa-ellipsis-v"} sz-18`} onClick={()=>setShowOption((prev)=>!prev)}></i>
      </div>
      {showOption && <OptionBar mini={true} items={props.data} close={()=>setShowOption()} />}
    </div>
  )
} 


export function Menu(props){
  let [menu , setMenu] = React.useState(false)
  return(
    <>
    <i class="fas fa-bars sz-24" style={{cursor:"pointer"}} onClick={()=>setMenu((prev)=>!prev)} > </i>
      {menu && <div class="left container-fluid position-fixed  h-100 color-bg-p color-white w-50">
        <div class="row">
          <div class="col-12 sz-18 color-white p-3 right">History</div>
          <div class="col-12 sz-18 color-white p-3 right">Home</div>
        </div>
      </div>
    }
    </>
    )
}


export function PlayingHistory(props){
  const {currentTrack,history} = usePlayer()
  //const [tracks,setTracks] = React.useState([])

  React.useEffect(()=>{
    
  },[currentTrack])
  
  return(
        <div class="container-fluid">
        <div class="row my-2">
          <div class="col sz-24 p-3 color-t">
            Recent Plays
          </div>
        </div>
          <div class="container-fluid">
            {history.length > 0 ? <MusicList data={history} /> :<div class="sz-18 color-white"> "No history available"</div> }
          </div>
        </div>

    )
}


export function SearchBar({full}) {

  const [showSearch, setShowSearch] = React.useState()
if(full){
  return(<Link href="/search"><input class="`no-decoration no-border rounded-2 sz-16 color-black color-p p-2 p-md-3" /> </Link>)
}

  return(
<Link href="/search"><i class="fas fa-search" ></i> </Link>
)}



export function Playlist({data}){

  const colors = ["255,112,37","255,112,255"]

  return(
        <>
        <Link class="row color-white pointer-cursor no-decoration" href={{pathname:`playlist/${data.id}`,query:{id:data.id}}}>
            <div class="rounde col p-1" style={{height:""}}>
            <img class="img-fluid cover rounded-3" style={{height:"4.5cm",width:"100%"}} src={data.cover_photo} loading="lazy" /> 
            <div class="sz-16 sz-md-18 position-absolut p2 p1 x-md-2 font-montserrt-bold " style={{marginTop:"-35px"}}><span class=" color-black g-light p-2 rounde d-inline-bloc" style={{backdropFilter:"brightness(50%)",background:`rgba(${colors[Math.floor(data.id % 2)]},.8)`}}>{data.name}</span></div>
              <div class="py-3 py-md-4 color-silver sz-sm-12">{data.music.slice(0,3).map((x)=> x.artist + " , ")} and others </div>
            </div>
        </Link>
        </>
    )
}

export function MainLoader(props){
  return(
    <div class="d-flex align-items-center center p-4" style={{height:"5cm"}}>
      <div class="col center"> <div class="spinner-border color-grey"></div> </div>
    </div>

    )
}