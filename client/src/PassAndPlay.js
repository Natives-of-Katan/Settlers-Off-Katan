import React from "react";
import {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { NumPlayersContext } from "./Contexts/NumPlayersContext";
const PassAndPlay = () => {

    const {numPlayers, setNumPlayers} = useContext(NumPlayersContext);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isNaN(numPlayers) && numPlayers >= 4 && numPlayers <= 8) {     //if input is a number and a number between 4 to 8,
            navigate('/Game');                              //go to Game page
        } else {                                                            //else ask user to enter a number between 4 and 8
          alert("Please enter a number between 4 and 8");  
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
                    <input type ="text" name="numPlayers" placeHolder="Enter a number" onChange={handleInputChange}/><br /><br />
                    <button class="start-game-button btn-default-style" type="submit" onSubmit={handleSubmit}>Start Game</button>
                </form>
            </div><br />
            <Link to={"/Play"}>Back to modes</Link>
        </div>
    )    
 }

 export default PassAndPlay;