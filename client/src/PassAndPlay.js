import React from "react";
import {useState} from 'react';
import {Link} from 'react-router-dom';

const PassAndPlay = () => {

    const [numPlayers, setNumPlayers] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isNaN(numPlayers) && numPlayers >= 4 && numPlayers <= 8) {     //if input is a number and a number between 4 to 8,
            window.location.href = "/Game";                                 //go to Game page
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
                    <input type ="text" name="numPlayers" placeHolder="Enter a number" value={numPlayers} onChange={handleInputChange}/><br /><br />
                    <button type="submit">Start Game</button>
                </form>
            </div><br />
            <Link to={"/Play"}>Back to modes</Link>
        </div>
    )    
 }

 export default PassAndPlay;