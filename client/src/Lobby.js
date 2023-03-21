import React from "react";
import {useEffect, useContext, useState } from 'react';
import {Link} from 'react-router-dom';
import { OnlineContext } from './Contexts/OnlineContext';
import { SockContext } from "./Contexts/SocketContext";

const Lobby = () => {

    //contexts 
    const { socket } = useContext(SockContext);
    const { online } = useContext(OnlineContext);

    //local vars
    const [gameCode, setGameCode] = useState(0);
    const [lobbyStarted, setLobbyStarted] = useState(false);
    const [name, setName] = useState('');
    const [players, setPlayers] = useState([]);
    const [disableStart, setDisableStart] = useState(true);


    /*if online is false, then you are creating a lobby and so a game code is generated
      if online is true, then you were redirected here after joining the lobby*/
    useEffect(() => {
        if(!online) {
        setGameCode(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000));
        }
    }, []);

    //emit to the server that we are creating a lobby with our username and the generated game code 
    const createLobby = () => {
        socket.emit('create-lobby', {
            matchID: gameCode,
            name: name
        });
    }

    //when the lobby is created, we receive a confirmation respones with your player name
    useEffect( () => {
        socket.on('lobby-created', (lobbyData) => {
            setPlayers(lobbyData.players);
            setLobbyStarted(true);
        });
    })

    //whenever a player joins the match, the players array is updated
    useEffect( () => {
        socket.on('player-joined', (response) => {
            setPlayers(response.players);
            setGameCode(response.matchID);
        })
    })

    //whenever players array changes, startGame() is called to see if the start game button should be enabled
    useEffect(() => {
        startGame();
    }, [players]);

    //update state of name field
    const handleNameChange = event => {
        setName(event.target.value);
    }

    //runs every time the players array is updated, once it is 4 or longer then the start button is enabled (game requires at least 4 players)
    const startGame = () => {
        players.length < 4 ? setDisableStart(true) : setDisableStart(false);
    }


    return(
        <div className="App">
            <div className ="content">
            <h1>*Lobby content goes here*</h1>
            {!lobbyStarted && !online &&
                <form>
                    <p>Invite Code:</p>
                        <input disabled="disabled" name="inviteCode" type ="text" value={ gameCode } /><br /><br />   
                        <input type='text' name='username' placeholder='enter username' onChange={handleNameChange}/>          
                    <Link to={"/Lobby"}><button class="lobby-button btn-default-style" type="submit" onClick= {createLobby}>Create Lobby</button></Link>
                </form>}

            {lobbyStarted | online && 
            <div>
                Players in Lobby....MatchID {gameCode}
                <div>
                {players.map((player, index) => (
                    <div key={index}>{player}</div>
                     ))}
                 </div>
            <button type='button' disabled={disableStart}>Start Game</button>
            </div>}

            </div><br />
            <Link to={"/"}>To Home</Link>
        </div>
    )     
}

 export default Lobby;