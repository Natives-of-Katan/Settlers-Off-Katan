//Board model goes here

import React from "react";
//import {useState} from 'react';
import {Link} from 'react-router-dom';
import GameBoard from "./Components/GameBoard"

const Game = () => {
    return(
        <div className="App">
            <GameBoard />
            <div className ="content">
            </div><br />
            <Link to="/Results">Results</Link><br />
            <Link to="/">Back Home</Link>
        </div>
      )     
}

export default Game;