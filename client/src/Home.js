import React from "react";
//import Axios from 'axios';
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
    
    return(
        <div className="App">
            <div className ="loginForm">
                <h1>Welcome to Settlers Off Katan</h1>
                <a href="/Play">
                    <button>Play</button>
                </a><br /><br />
                <a href="/Rules">
                    <button>Rules</button>
                </a><br /><br />
                <a href="/Options">
                    <button>Options</button>
                </a><br />
            </div><br />
            <div className="Link">
                <Link to={"/Login"}>Log in to start a new game</Link>
            </div><br />
            <div className="Link">
                <Link to={"/CreateAccount"}>Not yet a member? Create an Account</Link>
            </div>
        </div>
      )    
 }

 export default Home;