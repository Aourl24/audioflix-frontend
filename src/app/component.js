"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link"

const PlayerContext = React.createContext();

export function PlayerContextProvider({ children }) {
  const [currentTrack, setCurrentTrack] = React.useState();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioDuration, setAudioDuration] = React.useState();
  const [currentTime, setCurrentTime] = React.useState();
  const [playingSign, setPlayingSign] = React.useState(false);
  const currentAudio = React.useRef();
  const [nextTrack, setNextTrack] = React.useState();
  const [previousTrack, setPreviousTrack] = React.useState();
  const [random , setRandom] = React.useState(false)
  const [repeat , setRepeat] = React.useState(false)
  const [history , setHistory] = React.useState([])

  const readableTime = (x) => {
    const minutes = Math.floor(x / 60);
    const seconds = Math.floor(x % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  const letPlay = (trackSrc) => {
    if (currentAudio.current) {
      currentAudio.current.pause();
    }
    currentAudio.current = new Audio(trackSrc.file);
    currentAudio.current.play();
    currentAudio.current.addEventListener("loadedmetadata", () => setAudioDuration(currentAudio.current.duration));
    currentAudio.current.addEventListener("timeupdate", () => setCurrentTime(currentAudio.current.currentTime));
    setCurrentTrack(trackSrc);
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
      if(currentTrack) setHistory((prev)=>[...prev,currentTrack])    
  }, [currentTrack]);

  React.useEffect(()=>{
    if(repeat){
    currentAudio.current.addEventListener("ended",()=>{
      letPlay(currentTrack)
    })}
  },[repeat])

  React.useEffect(()=>{
    if(currentAudio.current){
    currentAudio.current.addEventListener('ended', ()=> repeat ? letPlay(currentTrack) :letPlay(nextTrack))}
  },[nextTrack])

  return (
    <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying, letPlay, audioDuration, setAudioDuration, currentTime, setCurrentTime, playingSign, setPlayingSign, letPause, currentAudio, resumePlay, playNextTrack, setNextTrack, previousTrack, setPreviousTrack, playPreviousTrack ,nextTrack,random,repeat,setRepeat,setRandom, readableTime, history, setHistory}}>
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
    <>
      {isPlaying ? <Pause size={size} type={type} /> : <Play size={size} type={type} />}
    </>
  );
}

function SeekBar(props){
    const {currentAudio,currentTime,audioDuration} = usePlayer()
    const seekBar = React.useRef();
    const [seek, setSeek] = React.useState(false)

  const handleSeekBarInput = () => {
      const time = (seekBar.current.value / 100) * currentAudio.current.duration;
      setSeek(true)
      currentAudio.current.currentTime = time;

      
    };

  React.useEffect(() => {
    const percent = (currentTime / audioDuration) * 100;

  if (!seek) {
    seekBar.current.value = percent;}
  setSeek(false)
  }, [currentTime]);

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
    <div className="container-fluid color-bg-s position-fixed vh-100 p-3" style={{ top: '0', backgroundRepeat: 'no-repeat', left: '0', right: '0', zIndex: '1000000' ,overflow:"hidden",}}>
      <div className="row color-white py-3 py-md-4">
        <div className="col">
          <button className="btn btn-link color-white left" onClick={toggleFullScreen}><i className="fas fa-chevron-down sz-16 color-white"></i></button>
        </div>
        <div className="col center sz-12">Now Playing</div>
        <div className="col right"><i style={{cursor:"pointer"}} className={`sz-16 fas ${option ? "fas fa-times text-danger" :"fa-ellipsis-v"}`} onClick={()=>setOption((prev)=>!prev)}></i>
        </div>
      </div>

      {option && <OptionBar items={currentTrack} close={()=>setOption((prev)=>!prev)}/>}

      <div className="row py-3" style={{backgroundImage: `url(${currentTrack.cover_photo})`,backgroundSize:"100%",backgroundBlur:"2",filter:"blur('2')"}}>
        <div className="col-md col-sm-12 center">
          <img src={currentTrack.cover_photo} className="img-flui rounded-3" style={{ width: '370px', height: '450px', objectFit: 'cover' }} />
        </div>
        <div className="col-md-6 col-sm-12 sz-24 center color-white py-4 d-none">
        <div class="color-bg- p-3 py-4 rounded">No Lyrics Available yet</div></div>
      </div>
      <br />

<div class="row align-items-center">
      <div class="col">
      <div className="row my-md-2 my-1 font-poppins">
        <div className="col-12 sz-18 color-white">{currentTrack.title}</div>
        <div className="col color-grey sz-12">{currentTrack.artist}</div>
      </div>

      
      <div className="row bold pt-2 pt-md-0">
        <div className="col-12">
          <SeekBar />
        </div>
      </div>
      <div className="row">
        <div className="col sz-12 color-grey" style={{ textAlign: 'left' }}>{readableTime(currentTime)}</div>
        <div className="col sz-12 color-grey" style={{ textAlign: 'right' }}>{readableTime(audioDuration)}</div>
      </div>
      </div>

      <div class="col-12 col-md">
      
      <div className="row color-white m-0 justify-content-center align-items-center mt-4 mt-md-0">

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
    <div id="" className="container-fluid p-2 py-md-3">
      <div className="row align-items-center rounded bg-lig color-bg-s p-2 m-1 sh dow color-white py-md-4">
        <div className="col-10 col-md-3" onClick={toggleFullScreen} style={{ cursor: "pointer" }}>
          <div className="row align-items-center gx-2">
            <div className="col-2 col-md-2">
              <img src={currentTrack.cover_photo} className="img-flui" style={{ width: '50px', height: '50px', objectFit: 'cover' }}  />
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
        <div class="col-1">{readableTime(audioDuration)}</div>
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
        <div>
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
    <div className='col-md-6 container col-12 position-fixed rounded-4 color-bg-black  p-4 color-white shadow' style={{bottom:'0',zIndex:"1000000000",arginLeft:'-10px',left:0}}>
    
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
        <div class="col pointer-cursor" onClick={()=>setNextTrack(items)}> Play Next </div>
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
      next = data[Math.floor(Math.random()*props.data.length)]
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
    <div className="container-fluid py-3">
     {data && <MusicList data={data} /> }
    </div>
  );
}

export function MusicList({data}){
  
  React.useEffect(()=>{
    console.log(data)
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
  let {letPlay , currentTrack , currentAudio} = usePlayer()
  let [showOption , setShowOption] = React.useState()

  return(
    <div className="row align-items-center">
      <div className="col-2 col-md-1 gx-0 right">
        <img src={props.data.cover_photo} className="img-flui" style={{ width: '55px', height: '55px', objectFit: 'cover' }}  />
      </div>
      <div className="col no-decoration px-3" onClick={() => letPlay(props.data)} style={{ cursor: "pointer" }}>
        <div className="row">
          <div className={`col-12 sz-14 ${props.data.title === currentTrack?.title ? "color-t":"color-white"}`}>{props.data.title}</div>
          <div className="col-12 sz-10 color-grey sz-12" style={{ color: '#d7' }}>{props.data.artist}</div>
        </div>
      </div>
      <div class="col-2 color-t">
        {props.data.title === currentTrack?.title && currentAudio.current.play && <i class="spinner-grow"></i>}
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
            {history.length > 0 ? <MusicList data={history} /> :<div class="sz-24 color-white"> "No history available"</div> }
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
