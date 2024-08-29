"use client";
import React from "react";
import Image from "next/image";

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

  const readableAudioDuration = (x) => {
    const minutes = Math.floor(x.duration / 60);
    const seconds = Math.floor(x.duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const readableAudioCurrentTime = (x) => {
    const minutes = Math.floor(x.currentTime / 60);
    const seconds = Math.floor(x.currentTime % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const letPlay = (trackSrc) => {
    if (currentAudio.current) {
      currentAudio.current.pause();
    }
    currentAudio.current = new Audio(trackSrc.file);
    currentAudio.current.play();
    currentAudio.current.addEventListener("loadedmetadata", () => setAudioDuration(readableAudioDuration(currentAudio.current)));
    currentAudio.current.addEventListener("timeupdate", () => setCurrentTime(readableAudioCurrentTime(currentAudio.current)));
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
    
  }, [currentTrack]);

  React.useEffect(()=>{
    if(repeat){
    currentAudio.current.addEventListener("ended",()=>{
      letPlay(currentTrack)
    })}
  },[repeat])

  return (
    <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying, letPlay, audioDuration, setAudioDuration, currentTime, setCurrentTime, playingSign, setPlayingSign, letPause, currentAudio, resumePlay, playNextTrack, setNextTrack, previousTrack, setPreviousTrack, playPreviousTrack ,nextTrack,random,repeat,setRepeat,setRandom}}>
      {children}
    </PlayerContext.Provider>
  );
}

function usePlayer() {
  return React.useContext(PlayerContext);
}

export function SearchBar() {
  const searchBar = React.useRef();
  const [result , setResult] = React.useState()

  let fetchData = ()=>{
    //let url = "http://localhost:8000/searchapi/" + searchBar.current.value
  let url = "http://192.168.96.92:8000/searchapi/" + searchBar.current.value
  var data = fetch(url).then((x)=>
    x.json()).then((t)=>{
    setResult(t)
  })
  }

  return (
    <div class="container">
      <div  className=''>
        <br />
        <input ref={searchBar} type='search' className="form-control sz-16 color-black color-p" placeholder="search music" onChange={()=>fetchData()} />
        <br />
      </div>
      {result &&
      <div class="position-fixed color-bg-p container vh-100" style={{marginLeft:'-10px',overflow:'auto'}}>
      <div class="row">
      <div class="col"> <i class="fas fa-times sz-15 text-danger" onClick={()=>setResult()}></i> </div>
      </div>
        <MusicBox data={result} />
      </div>
      }
      

    </div>
  );
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

export function PlayerFullBox({ toggleFullScreen }) {
  const { currentTrack, currentTime, audioDuration, playNextTrack, setCurrentTime, currentAudio, playPreviousTrack, isPlaying ,random ,repeat ,setRepeat,setRandom} = usePlayer();
  const [audioPercent, setAudioPercent] = React.useState('0%');
  const seekBar = React.useRef();
  const [option ,setOption] = React.useState(false)

  const toSeconds = (x) => {
    const [minutes, seconds] = x.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  React.useEffect(() => {
    const t = audioDuration ? toSeconds(audioDuration) : 0;
    const c = currentTime ? toSeconds(currentTime) : 0;
    const percent = (c / t) * 100;
    setAudioPercent(`${percent}%`);
    if (seekBar.current) seekBar.current.value = percent;
  }, [currentTime]);

  const handleSeekBarInput = () => {
      const time = (seekBar.current.value / 100) * currentAudio.current.duration;
      currentAudio.current.currentTime = time;
    };

  React.useEffect(() => {
    seekBar.current.addEventListener("input", handleSeekBarInput);
  }, []);

  return (
    <div className="container-fluid color-bg-s position-fixed vh-100 p-3" style={{ top: '0', backgroundRepeat: 'no-repeat', left: '0', right: '0', zIndex: '1000000' }}>
      <div className="row color-white py-3 py-md-4">
        <div className="col">
          <button className="btn btn-link color-white left" onClick={toggleFullScreen}><i className="fas fa-chevron-down sz-16 color-white"></i></button>
        </div>
        <div className="col center sz-12">Now Playing</div>
        <div className="col right"><i style={{cursor:"pointer"}} className={`sz-16 fas ${option ? "fas fa-times text-danger" :"fa-ellipsis-v"}`} onClick={()=>setOption((prev)=>!prev)}></i>
        </div>
      </div>

      {option && <OptionBar items={currentTrack} />}

      <div className="row py-3">
        <div className="col-md-6 col-sm-12 center">
          <img src={currentTrack.cover_photo} className="img-flui rounded-3" style={{ width: '370px', height: '370px', objectFit: 'cover' }} />
        </div>
        <div className="col-md-6 col-sm-12 sz-24 center color-white py-4 d-none d-md-block">
        <div class="color-bg- p-3 py-4 rounded">No Lyrics Available yet</div></div>
      </div>
      <br />
      <div className="row my-md-2 my-1 font-poppins">
        <div className="col-12 sz-18 color-white">{currentTrack.title}</div>
        <div className="col color-grey sz-12">{currentTrack.artist}</div>
      </div>
      <div className="row bold pt-2">
        <div className="col-12">
          <input className="color-s" type="range" onInput={()=>handleSeekBarInput()} ref={seekBar}></input>
        </div>
      </div>
      <div className="row">
        <div className="col sz-12 color-grey" style={{ textAlign: 'left' }}>{currentTime}</div>
        <div className="col sz-12 color-grey" style={{ textAlign: 'right' }}>{audioDuration}</div>
      </div>
      
      <div className="row color-white m-0 justify-content-center align-items-center mt-4">

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
  );
}

export function PlayerSmallBox({ toggleFullScreen }) {
  const { currentTrack, playNextTrack, playPreviousTrack } = usePlayer();

  return (
    <div id="fixed-bottom" className="container-fluid p-2" style={{overflow:"hidden"}}>
      <div className="row align-items-center rounded bg-lig color-bg-s p-2 m-1 sh dow color-white">
        <div className="col-10 col-md-5" onClick={toggleFullScreen} style={{ cursor: "pointer" }}>
          <div className="row align-items-center">
            <div className="col-2 col-md-1">
              <img src={currentTrack.cover_photo} className="img-flui" style={{ width: '50px', height: '50px', objectFit: 'cover' }}  />
            </div>
            <div className="col px-4 px-md-5">
              <div className="sz-14 font-poppins">{currentTrack.title}</div>
              <div className="color-silver sz-12">{currentTrack.artist}</div>
            </div>
          </div>
        </div>
        <div className="col-1 col-md-4 display-sm-none d-none d-md-block"> <i> Lyrics not Available </i> </div>
        <div className="col-1 col-md-1 display-sm-none">
          <button className="btn no-decoration color-dark-white color-white" onClick={playPreviousTrack}>
            <i className="fas fa-step-backward color-t sz-20"></i>
          </button>
        </div>
        <div className="col-1 col-md-1"><Control size="sz-36 color-t" /></div>
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

function OptionBar({ items }) {
  const {nextTrack,currentTrack,repeat} = usePlayer();

  return (
    <div className='col-md-6 container position-absolute rounded color-bg-p  p-4 color-white' style={{bottom:'0',zIndex:"1000000000",marginLeft:'-10px'}}>
      <div class="row left">
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

      <div class="row left">
      <div class="col sz-16 left bold py-2">
          Next Track
        </div>
      </div>

      <div class="row py-2 left">
      <div class="col-12">
        <Music data={nextTrack} />
      </div>
      </div>
      <hr />
      <div class="row py-3 sz-14 left">
        <div class="col-1"> <i class="fas fa-download"></i> </div><div class="col"> Download track </div>
      </div>

      <div class="row py-3 sz-14 left">
        <div class="col-1"> <i class="fas fa-share"></i> </div><div class="col"> Share Track </div>
      </div>

    </div>
  );
}

export function MusicBox(props) {
  const { currentTrack, setCurrentTrack, letPlay, setNextTrack, setPreviousTrack, nextTrack , currentAudio,playNextTrack,random,repeat} = usePlayer();
  const [shuffle,setShuffle] = React.useState()

  const nextSong = (x) => {
    const index = props.data.findIndex((item) => item.id === currentTrack?.id);
    let next;
    if(random){
      next = props.data[Math.floor(Math.random()*props.data.length)]
    }

    else{
    if (index + 1 === props.data.length) {
      next = props.data[0];

    } else {
      next = props.data[index + 1];
    }
  }

  if(!x){
    setNextTrack(next) }
     else{
      return next
    }
  };

  const previousSong = (x)=>{
    const index = props.data.findIndex((item) => item.id === currentTrack?.id);
    let previous;
    if(index === 0){
      previous = props.data[props.data.length -1]
    }
    else{
      previous = props.data[index - 1] 
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
      <div className='row'>
        {props.data.map((x) => (
          <div className="col-12 col-md-6 rounded p-2 my-2" key={x.id}>
            <Music data={x}/>        
          </div>
        ))}
      </div>
    </div>
  );
}


function Music(props){
  let {letPlay , currentTrack } = usePlayer()
  return(
    <div className="row align-items-center">
      <div className="col-2 col-md-2 right">
        <img src={props.data.cover_photo} className="img-flui" style={{ width: '55px', height: '55px', objectFit: 'cover' }}  />
      </div>
      <div className="col no-decoration px-3" onClick={() => letPlay(props.data)} style={{ cursor: "pointer" }}>
        <div className="row">
          <div className={`col-12 sz-14 ${props.data.title === currentTrack?.title ? "color-t":"color-white"}`}>{props.data.title}</div>
          <div className="col-12 sz-10 color-grey sz-12" style={{ color: '#d7' }}>{props.data.artist}</div>
        </div>
      </div>
    </div>
  )
} 