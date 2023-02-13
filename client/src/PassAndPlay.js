import React from "react";
//import Axios from 'axios';
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const PassAndPlay = () => {
    
    return(
        <div className="App">
            <div className ="loginForm">
                <h1>Pass and Play mode</h1>
                <form>
                    <p>Number of players (4-8):</p>
                    <input type ="text" name="numPlayers" placeHolder="Enter a number" /><br /><br />
                    <Link to="/Game"><button type="submit">Start Game</button></Link>
                </form>
            </div><br />
            <Link to="/Play">Back to modes</Link>
        </div>
    )    
 }

 export default PassAndPlay;