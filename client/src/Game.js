//Board model goes here

import React from "react";
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const Game = () => {
    return(
        <div className="App">
            <div className ="content">
                <h1>*Board Model goes here*</h1>
            </div><br />
            <Link to="/Results">Results</Link><br />
            <Link to="/">Back Home</Link>
        </div>
      )     
 }

 export default Game;