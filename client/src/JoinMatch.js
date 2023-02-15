//Board model goes here
import React from "react";
//import Axios from 'axios';
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const JoinMatch = () => {
    
    return(
        <div className="App">
            <div className ="content">
                <h1>Join Match</h1>
                <form>
                    <p>Invite Code:</p>
                    <input type ="text" name="joinMatchCode" placeHolder="Enter code here" /><br /><br />
                    <Link to="/Lobby"><button type="submit">Join Public</button></Link>
                </form>
            </div><br />
            <Link to="/Play">Back</Link>
        </div>
    )     
}

export default JoinMatch;