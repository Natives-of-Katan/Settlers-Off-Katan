import React from "react";
import Axios from 'axios';
import {useState} from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
    const [name, setName] = useState([""]);
    const [displayName, setdisplayName] = useState([""]);


    const submitName = () => {
      setdisplayName("hello "  + name +" !");
      Axios.post("http://localhost:8080/name", {name}).then((response) => {
        alert("Your  name was added to the database!");
      });
    }

    return(
        <div className="App">
            <div className ="nameForm">
                <h1>Enter Name to Log into Database</h1>
                <form onSubmit={submitName}>
                    <input type ="text" placeHolder="Enter Name" 
                        onChange={(event)=> {
                            setName(event.target.value);
                        }} />
                    <button type="submit"> Submit </button>
                </form>
            </div>
            <div className="Link">
                <Link to={"/Names"}>View Submitted Names</Link>
                <h1>{displayName}</h1>
            </div>
        </div>
      )    
 }

 export default Home;