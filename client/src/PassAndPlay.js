import React from "react";
import {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { NumPlayersContext } from "./Contexts/NumPlayersContext";
import { MultiplayerContext } from "./Contexts/MultiplayerContext";
const PassAndPlay = () => {

    const {setMultiplayer} = useContext(MultiplayerContext);
    const {numPlayers, setNumPlayers} = useContext(NumPlayersContext);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        setMultiplayer([0,0]);
        event.preventDefault();
        if (!isNaN(numPlayers) && numPlayers >= 3 && numPlayers <= 4) {     
            navigate('/Game');                              
        } else {                                                     
          alert("Please enter 3 or 4 to represent the number of players.");  
        }
    };

    const handleInputChange = (event) => {
        setNumPlayers(event.target.value);
    };

    return(
        <div className="App">
            <div className ="loginForm">
                <h1>Pass and Play mode</h1>
                <form onSubmit={handleSubmit}>
                    <p>Number of players (4-8):</p>
                    <input type ="text" name="numPlayers" placeholder="Enter a number" onChange={handleInputChange}/><br /><br />
                    <button className="start-game-button btn-default-style" type="submit" onSubmit={handleSubmit}>Start Game</button>
                </form>
            </div><br />
            <Link to={"/Play"}>Back to modes</Link>
        </div>
    )    
 }

 export default PassAndPlay;