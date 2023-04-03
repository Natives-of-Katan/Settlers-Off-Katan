import React from "react";
import {Link} from 'react-router-dom';
const Play = () => {
    
    return(
        <div className="App">
            <div className ="content">
                <h1>Choose Your Game Mode</h1>
                <Link to={"/PassAndPlay"}>
                    <button class="play-button btn-default-style">Pass and Play</button>
                </Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link to={"/JoinMatch"}>
                    <button class="play-button btn-default-style">Join Online Match</button>
                </Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link to={"/Lobby"}>
                    <button class="play-button btn-default-style">Create Online Match</button>
                </Link><br />
            </div><br />
            <Link to={"/"}>Back</Link>
        </div>
    )    
}

export default Play;