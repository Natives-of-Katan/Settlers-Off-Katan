import {useContext} from "react";
import {GameMusicContext} from "../Contexts/GameMusicContext";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import backgroundMusic from './EverDream.mp3';

const GameMusic = () => {
  const {playing, volume} = useContext(GameMusicContext);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (playing) {
        playing(!document.hidden);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

  }, [playing]);

  return (
    <ReactPlayer
      url={backgroundMusic}
      playing={playing}
      volume={volume}
      loop={true}
      muted={false}
      width={0}
      height={0}
    />
  );

};

export default React.memo(GameMusic);