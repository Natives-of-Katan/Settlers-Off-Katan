import { createContext, useEffect, useState } from "react";
import backgroundMusic from "../Components/EverDream.mp3";

export const GameMusicContext = createContext({
    playing: true,
    setPlaying: () => {},
    volume: 0.2,
    setVolume: () => {},
    userTurnedOff: false,
    setUserTurnedOff: () => {},
    audio: null,
});

export const GameMusicProvider = ({ children }) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.2);
    const [userTurnedOff, setUserTurnedOff] = useState(false);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        const audioInstance = new Audio(backgroundMusic);
        audioInstance.loop = true;
        setAudio(audioInstance);

        const handleVisibilityChange = () => {
          if (playing) {
            setPlaying(!document.hidden);
          }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          if (audioInstance) {
            audioInstance.pause();
            setAudio(null);
          }
        };
    }, []);

    useEffect(() => {
      if (audio) {
        audio.volume = volume;
      }
    }, [volume, audio]);

    useEffect(() => {
      if (playing && audio) {
        audio.play();
      } else if (!playing && audio) {
        audio.pause();
      }
    }, [playing, audio]);

    return (
      <GameMusicContext.Provider
        value={{ playing, setPlaying, volume, setVolume, userTurnedOff, setUserTurnedOff, audio }}
      >
        {children}
      </GameMusicContext.Provider>
    );
};
