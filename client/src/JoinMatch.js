import React from "react";
import {Link} from 'react-router-dom';
import { useContext, useState, useEffect } from 'react'
import { OnlineContext } from "./Contexts/OnlineContext";
import { SockContext } from "./Contexts/SocketContext";
import { useNavigate } from 'react-router-dom';

const JoinMatch = () => {
    
    //context vars
    const {setOnline} = useContext(OnlineContext);
    const {socket} = useContext(SockContext);

    //local vars
    const [matchID, setMatchID] = useState('');
    const [name, setName] = useState('');
    const [requested, setRequested] = useState(false);

    //used to navigate to /Lobby after successful join request
    const navigate = useNavigate();

    //received when we've successfully added ourselves to the lobby
    useEffect( () => {
        socket.on('player-joined', (response) => {
            console.log(response);
        })
    })

    //handle state changes for match ID input
    const handleMatchIdChange = event => {
        setMatchID(event.target.value);
        setOnline(true);
    }

    //handle state changes for username change input
    const handleNameChange = event => {
        setName(event.target.value);
    }

    //when submitting, we emit a join request to the server, with the match ID and username, then navigate to the lobby
    const handleSubmit = () => {
        socket.emit('join', {
            matchID: Number(matchID),
            name: name
        })
        setRequested(true);
        setOnline(true);
        navigate('/Lobby');
    }

    return(
        <div className="App">
            <div className ="content">
                <h1>Got a Game Code?</h1>
                {!requested && 
                <form>
                    <p>Invite Code:</p>
                    <input type ="text" name="joinMatchCode" placeHolder="Enter code here" onChange={handleMatchIdChange} /><br /><br />
                    <input type='text' name='username' placeholder='enter username' onChange={handleNameChange}/> 
                    <button class="btn-default-style" type="submit" onClick={handleSubmit}>Enter Lobby</button>
                </form>
                }
                {requested && <div>Waiting for lobby Validation....</div>}
            </div><br />
            <Link to={"/Play"}>Back</Link>
        </div>
    )     
}

export default JoinMatch;