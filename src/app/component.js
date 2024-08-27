"use client";
import React from "react";
import Image from "next/image";

const PlayerContext = React.createContext();

export function PlayerContextProvider({ children }) {
  const [currentTrack, setCurrentTrack] = React.useState({});
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioDuration, setAudioDuration] = React.useState();
  const [currentTime, setCurrentTime] = React.useState();
  const [playingSign, setPlayingSign] = React.useState(false);
  const currentAudio = React.useRef();
  const [nextTrack, setNextTrack] = React.useState();
  const [previousTrack, setPreviousTrack] = React.useState();

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
    setCurrentTrack(trackSrc);
    setIsPlaying(true);

    currentAudio.current.addEventListener("loadedmetadata", () => setAudioDuration(readableAudioDuration(currentAudio.current)));
    currentAudio.current.addEventListener("timeupdate", () => setCurrentTime(readableAudioCurrentTime(currentAudio.current)));
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
    letPlay(nextTrack);
  };

  const playPreviousTrack = () => {
    letPlay(previousTrack);
  };

  React.useEffect(() => {
    if (currentAudio.current) {
      currentAudio.current.addEventListener('ended', playNextTrack);
    }
  }, [currentTrack]);

  return (
    <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying, letPlay, audioDuration, setAudioDuration, currentTime, setCurrentTime, playingSign, setPlayingSign, letPause, currentAudio, resumePlay, playNextTrack, setNextTrack, previousTrack, setPreviousTrack, playPreviousTrack }}>
      {children}
    </PlayerContext.Provider>
  );
}

function usePlayer() {
  return React.useContext(PlayerContext);
}

export function SearchBar() {
  const searchBar = React.useRef();

  const showSearchBar = () => {
    searchBar.current.classList.toggle('display-sm-none');
  };

  return (
    <form>
      <i onClick={showSearchBar} className='fas fa-search display-md-none color-p'></i>
      <div ref={searchBar} className=''>
        <br />
        <input type='search' className="form-control sz-16 color-black color-p" placeholder="search music" />
        <br />
      </div>
    </form>
  );
}

function Play({ type, size }) {
  const { resumePlay } = usePlayer();

  return (
    <span onClick={resumePlay} style={{ cursor: "pointer" }}>
      <i className={`${!type ? "fas fa-play" : "fas fa-play-circle"} ${size}`}></i>
    </span>
  );
}

function Pause({ type, size }) {
  const { letPause } = usePlayer();

  return (
    <span class="" onClick={letPause} style={{ cursor: "pointer" }}>
      <i className={`${!type ? "fas fa-pause" : "fas fa-pause-circle"} ${size}`}></i>
    </span>
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
  const { currentTrack, currentTime, audioDuration, playNextTrack, setCurrentTime, currentAudio, playPreviousTrack, isPlaying } = usePlayer();
  const [audioPercent, setAudioPercent] = React.useState('0%');
  const seekBar = React.useRef();

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

  React.useEffect(() => {
    const handleSeekBarInput = () => {
      const time = (seekBar.current.value / 100) * currentAudio.current.duration;
      currentAudio.current.currentTime = time;
    };
    seekBar.current.addEventListener("input", handleSeekBarInput);
    //return () => seekBar.current.removeEventListener("input", handleSeekBarInput);
  }, [audioDuration]);

  return (
    <div className="container-fluid color-bg-s position-fixed vh-100 p-3" style={{ top: '0', backgroundRepeat: 'no-repeat', left: '0', right: '0', zIndex: '1000000' }}>
      <div className="row color-white py-3 py-md-4">
        <div className="col">
          <button className="btn btn-link color-white left" onClick={toggleFullScreen}><i className="fas fa-chevron-down sz-16 color-white"></i></button>
        </div>
        <div className="col center sz-12">Now Playing</div>
        <div className="col right"><i className="fas fa-ellipsis-v"></i><OptionBar items={currentTrack} /></div>
      </div>
      <div className="row py-3">
        <div className="col-md-6 col-sm-12 center">
          <img src={currentTrack.cover_photo} className="img-flui rounded-3" style={{ width: '370px', height: '370px', objectFit: 'cover' }} />
        </div>
        <div className="col-md-6 col-sm-12 sz-24 center color-white py-4 d-none d-md-block">
        <div class="color-bg-p p-3 py-4 rounded">No Lyrics Available yet</div></div>
      </div>
      <br />
      <div className="row my-md-2 my-1 font-poppins">
        <div className="col-12 sz-18 color-white">{currentTrack.title}</div>
        <div className="col color-grey sz-12">{currentTrack.artist}</div>
      </div>
      <div className="row bold pt-2">
        <div className="col-12">
          <input className="color-s" type="range" ref={seekBar}></input>
        </div>
      </div>
      <div className="row">
        <div className="col sz-12 color-grey" style={{ textAlign: 'left' }}>{currentTime}</div>
        <div className="col sz-12 color-grey" style={{ textAlign: 'right' }}>{audioDuration}</div>
      </div>
      
      <div className="row color-white sz-20 justify-content-center align-items-center mt-4">
        <div className="col col-md-1 right">
          <button className="btn no-decoration color-dark-white color-t" onClick={playPreviousTrack}>
            <i className="fas fa-step-backward color-t sz-36"></i>
          </button>
        </div>

        <div className="col col-md-1 center">
          <Control size="sz-72 color-t" type="play-circle" />
        </div>

        <div className="col col-md-1 left">
          <button className="btn no-decoration color-dark-white sz-24 color-white" onClick={playNextTrack}>
            <i className="fas fa-step-forward color-t sz-36"></i>
          </button>
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
        <div className="col-1 col-md-4 sz-14 display-sm-none d-none d-md-block"> <i> Lyrics not Available </i> </div>
        <div className="col-1 col-md-1 display-sm-none">
          <button className="btn no-decoration color-dark-white color-white" onClick={playPreviousTrack}>
            <i className="fas fa-step-backward color-t"></i>
          </button>
        </div>
        <div className="col-1 col-md-1"><Control size="sz-14 color-t" /></div>
        <div className="col-1 col-md-1 display-sm-none">
          <button className="btn no-decoration color-dark-white sz-14 color-white" onClick={playNextTrack}>
            <i className="fas fa-step-forward color-t"></i>
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
      {currentTrack.file && (
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
  return (
    <div id={`${items.id}optionbar`} className='alert col-4 position-absolute bg-light rounded p-2 hide' style={{ left: '0', right: '0' }}>
      <a href={items.url} className='color-p no-decoration sz-12' download>Download</a>
    </div>
  );
}

export function MusicBox(props) {
  const { currentTrack, setCurrentTrack, letPlay, setNextTrack, setPreviousTrack } = usePlayer();

  const nextSong = () => {
    const index = props.data.findIndex((item) => item.id === currentTrack.id);
    if (index + 1 === props.data.length) {
      setNextTrack(props.data[0]);
    } else {
      setNextTrack(props.data[index + 1]);
    }
    setPreviousTrack(index === 0 ? props.data[props.data.length - 1] : props.data[index - 1]);
  };

  React.useEffect(() => {
    nextSong();
  }, [currentTrack]);

  return (
    <div className="container-fluid py-3">
      <div className='row'>
        {props.data.map((x) => (
          <div className="col-12 col-md-6 rounded p-2 my-2" key={x.id}>
            <div className="row align-items-center">
              <div className="col-2 col-md-2 right">
                <img src={x.cover_photo} className="img-flui" style={{ width: '55px', height: '55px', objectFit: 'cover' }}  />
              </div>
              <div className="col no-decoration px-3" onClick={() => letPlay(x)} style={{ cursor: "pointer" }}>
                <div className="row">
                  <div className={`col-12 sz-14 ${x.title === currentTrack.title ? "color-t":"color-white"}`}>{x.title}</div>
                  <div className="col-12 sz-10 color-grey sz-12" style={{ color: '#d7' }}>{x.artist}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
