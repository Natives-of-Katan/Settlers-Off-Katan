import React from "react";
//import Axios from 'axios';
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const Lobby = () => {
    
    return(
        <div className="App">
            <div className ="content">
                <form>
                    <h1>*Lobby content goes here*</h1>
                    <p>Invite Code:</p>
                        <input disabled="disabled" name="inviteCode" type ="text" placeHolder="Invite Code #" /><br /><br />
                    <p>Looking for players~</p><br />
                    <Link to="/Game"><button type="submit">Start Game</button></Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                 
                    <Link to="/Lobby"><button type="submit">Make Private/Make Public</button></Link>
                </form>
            </div><br />
            <Link to="/">To Home</Link>
        </div>
    )     
}

 export default Lobby;