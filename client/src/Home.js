import React from "react";
import Axios from 'axios';
import {useState} from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
    
    const [name, setName] = useState([""]);
    const [displayName, setdisplayName] = useState([""]);

    const submitName = () => {
      setdisplayName("Hello "  + name +" !");
      Axios.post("/name", {name}).then((response) => {
        alert("You have logged in!");
      });
    }

    return(
        <div className="App">
            <div className ="loginForm">
                <h1>Welcome to Settlers Off Katan</h1>

                <a href="/Play">
                    <button>Play</button>
                </a>

                <h3>Enter Your Username</h3>
                <form onSubmit={submitName}>
                    <input type ="text" placeHolder="Enter Username" 
                        onChange={(event)=> {
                            setName(event.target.value);
                        }} />
                    <button type="submit"> Submit </button>
                </form>
            </div>
            <div className="Link">
                <Link to={"/CreateAccount"}>Not yet a member? Create an Account</Link>
                <h1>{displayName}</h1>
            </div>
        </div>
      )    
 }

 export default Home;