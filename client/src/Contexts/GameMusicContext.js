import {createContext} from "react";

export const GameMusicContext = createContext({
    playing: true,
    setPlaying: () => {},
    volume: 0.2,
    setVolume: () => {},
    userTurnedOff: false,
    setUserTurnedOff: () => {},
  });