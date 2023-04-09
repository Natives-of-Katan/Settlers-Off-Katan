import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import GameMusic from "./Components/GameMusic";
import Results from './Results';
import Game from './Game';
import Lobby from './Lobby';
import JoinMatch from './JoinMatch';
import PassAndPlay from './PassAndPlay';
import Options from './Options';
import Rules from './Rules';
import Play from './Play';
import Account from './Account';
import Login from './Login';
import CreateAccount from './CreateAccount';
import Home from './Home';
import Navbar from "./Components/Navbar"
import {GameMusicContext} from "./Contexts/GameMusicContext";
import {AuthContext} from "./Contexts/AuthContext"
import {ProfileContext} from './Contexts/ProfileContext'
import {NumPlayersContext} from './Contexts/NumPlayersContext'
import {OnlineContext} from './Contexts/OnlineContext'
import { MultiplayerContext } from './Contexts/MultiplayerContext';
import { SockContext } from './Contexts/SocketContext';
import { MatchIDContext } from './Contexts/MatchIDContext';
import {SeatNumberContext} from './Contexts/SeatNumberContext';
import { MatchInfoContext } from './Contexts/MatchInfoContext';
import {useState} from 'react'

import io from 'socket.io-client'

function App() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [auth, setAuth] = useState(false);
  const [profile, setProfile] = useState({});
  const [numPlayers, setNumPlayers] = useState({});
  const [online, setOnline] = useState(false);
  const [multiplayer, setMultiplayer] = useState([false, 0]);
  const [socket] = useState(io('/'));
  const [matchID, setMatchID] = useState();
  const [seatNum, setSeatNum] = useState();
  const [matchInfo, setMatchInfo] = useState({});
  const [userTurnedOff, setUserTurnedOff] = useState(false);
  return (
    <div>
        <GameMusicContext.Provider
          value={{playing, setPlaying, volume, setVolume,  userTurnedOff, setUserTurnedOff}}
        >
        <GameMusic />    
        <BrowserRouter>    
          <AuthContext.Provider value={{auth, setAuth}}>
          <ProfileContext.Provider value={{profile, setProfile}}>
            <NumPlayersContext.Provider value={{numPlayers, setNumPlayers}}>
            <OnlineContext.Provider value={{online, setOnline}}>
            <MultiplayerContext.Provider value={{multiplayer, setMultiplayer}}>
            <SockContext.Provider value={{socket}}>
            <MatchIDContext.Provider value={{matchID, setMatchID}}>
            <SeatNumberContext.Provider value={{seatNum, setSeatNum}}>
            <MatchInfoContext.Provider value={{matchInfo, setMatchInfo}}>
            <Navbar />
            <Routes>
            <Route exact path="/Results" element={<Results/>} />
            <Route exact path="/Game" element={<Game/>} />
            <Route exact path="/Lobby" element={<Lobby/>} />
            <Route exact path="/JoinMatch" element={<JoinMatch/>} />
            <Route exact path="/PassAndPlay" element={<PassAndPlay/>} />
            <Route exact path="/Options" element={<Options/>} />
            <Route exact path="/Rules" element={<Rules/>} />
            <Route exact path="/Play" element={<Play/>} />
            <Route exact path="/Account" element={auth ? <Account/> : <Login/>} />
            <Route exact path="/Login" element={<Login/>} />
            <Route exact path="/CreateAccount" element={<CreateAccount/>} />
            <Route exact path="/" element={<Home/>} />
            </Routes>
            </MatchInfoContext.Provider>
            </SeatNumberContext.Provider>
            </MatchIDContext.Provider>
            </SockContext.Provider>
            </MultiplayerContext.Provider>
            </OnlineContext.Provider>
            </NumPlayersContext.Provider>
          </ProfileContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
        </GameMusicContext.Provider>
      </div>
  );
}

export default App;
