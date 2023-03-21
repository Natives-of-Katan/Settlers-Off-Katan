import React from "react";
import {Link} from 'react-router-dom';
const Play = () => {
    
    return(
        <div className="App">
            <div className ="content">
                <h1>Choose Your Game Mode</h1>
                <a href={"/PassAndPlay"}>
                    <button class="play-button btn-default-style">Pass and Play</button>
                </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a href={"/JoinMatch"}>
                    <button class="play-button btn-default-style">Join Online Match</button>
                </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a href={"/Lobby"}>
                    <button class="play-button btn-default-style">Create Online Match</button>
                </a><br />
            </div><br />
            <Link to={"/"}>Back</Link>
        </div>
    )    
}

export default Play;