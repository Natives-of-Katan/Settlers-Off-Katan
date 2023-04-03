import React from "react";
import {useEffect, useContext, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { OnlineContext } from './Contexts/OnlineContext';
import { MultiplayerContext } from "./Contexts/MultiplayerContext";
import { SockContext } from "./Contexts/SocketContext";
import { MatchIDContext } from "./Contexts/MatchIDContext";
import {SeatNumberContext} from "./Contexts/SeatNumberContext";
import { MatchInfoContext } from "./Contexts/MatchInfoContext";
import { ProfileContext } from "./Contexts/ProfileContext";
import { AuthContext } from "./Contexts/AuthContext";

const Lobby = () => {

    //navigate to game component
    const navigate = useNavigate();

    //contexts 
    const { socket } = useContext(SockContext);
    const { online } = useContext(OnlineContext);
    const {setMultiplayer} = useContext(MultiplayerContext);
    const {setSeatNum} = useContext(SeatNumberContext);
    const {setMatchInfo} = useContext(MatchInfoContext);
    const {profile } = useContext(ProfileContext);
    const {auth} = useContext(AuthContext);

    //local vars
    const {matchID, setMatchID} = useContext(MatchIDContext);
    const [lobbyStarted, setLobbyStarted] = useState(false);
    const [name, setName] = useState('');
    const [players, setPlayers] = useState([]);
    const [disableStart, setDisableStart] = useState(true);


    /*if online is false, then you are creating a lobby and so a game code is generated
      if online is true, then you were redirected here after joining the lobby*/
    useEffect(() => {
        if(!online) {
        setMatchID(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000));
        }
        if(auth)
            setName(profile.username);
    }, []);

    //useEffect hooks for socket events/when players array is updated
    useEffect(() => {
        
        checkMinPlayers();

        //when we receive a confirmation the lobby was created, we update the lobby data and set lobby started to true
        socket.on('lobby-created', (lobbyData) => {
            setPlayers(lobbyData.players);
            setSeatNum(0);
            setLobbyStarted(true);
        });

        //playrs array updated if player joins the lobby
        socket.on('player-joined', (response) => {
            setPlayers(response.players);
            setMatchID(response.matchID);
        });

        socket.on('confirm-start', (response) => {
            console.log('starting!');
            setMultiplayer([true, players.length]);
            setMatchInfo(response);
            console.log(response);
            navigate('/Game');
        });

    }, [socket, players]);

    //update state of name field
    const handleNameChange = event => {
        setName(event.target.value);
    }

    //runs every time the players array is updated, once it is 4 or longer then the start button is enabled (game requires at least 4 players)
    const checkMinPlayers = () => {
        //players.length < 4 ? setDisableStart(true) : setDisableStart(false);
        setDisableStart(false);
    }

    //emit to the server that we are creating a lobby with our username and the generated game code 
    const createLobby = () => {
        socket.emit('create-lobby', {
            matchID: matchID,
            name: name
        });
    }

    //any player can start teh game once there are at least four in the lobby
    const startGame = () => {
        console.log('starting game');
        socket.emit('start-game', matchID);
    }

    return(
        <div className="App">
            <div className ="content">
            <h1>Welcome To The Lobby!</h1>
            {!lobbyStarted && !online &&
                <form>
                    <p>Invite Code:</p>
                        <input disabled="disabled" name="inviteCode" type ="text" value={ matchID } /><br /><br />   
                        <input type='text' name='username' value ={auth ? profile.username : ''} placeholder = {auth ? 'Enter Username' : ''}onChange={handleNameChange}/>          
                    <Link to={"/Lobby"}><button class="lobby-button btn-default-style" type="submit" onClick= {createLobby}>Create Lobby</button></Link>
                </form>}

            {lobbyStarted | online && 
            <div>
                Players in Lobby....MatchID {matchID}
                <div>
                {players.map((player, index) => (
                    <div key={index}>{player}</div>
                     ))}
                 </div>
            <button type='button' disabled={disableStart} onClick={startGame}>Start Game</button>
            </div>}

            </div><br />
            <Link to={"/"}>To Home</Link>
        </div>
    )     
}

 export default Lobby;