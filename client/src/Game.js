//Board model goes here

import React from "react";
//import {useState} from 'react';
import {Link} from 'react-router-dom';
import GameBoard from "./Components/GameBoard"

const Game = () => {
    return(
        <div className="Game">
            <GameBoard />
            <br />
            <Link to={"/Results"}>Results</Link><br />
            <Link to={"/"}>Back Home</Link>
        </div>
      )     
}

export default Game;