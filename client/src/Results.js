//Board model goes here
import React from "react";
//import Axios from 'axios';
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const Results = () => {
    
    return(
        <div className="App">
            <div className ="content">
                <h1>*Results go here*</h1>

            </div><br />
            <br />
            <Link to="/Lobby">Rematch</Link><br />
            <Link to="/">Back home</Link>
        </div>
      )     
 }

 export default Results;