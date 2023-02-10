import React from "react";
//import Axios from 'axios';
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const Play = () => {
    
    return(
        <div className="App">
            <div className ="loginForm">
                <h1>Choose Your Game Mode</h1>

                <a href="/PassAndPlay">
                    <button>Pass and Play</button>
                </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="/JoinMatch">
                    <button>Join Online Match</button>
                </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="/Lobby">
                    <button>Create Online Match</button>
                </a><br />

            </div><br />
            <Link to="/">Back</Link>
        </div>
      )    
 }

 export default Play;