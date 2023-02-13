//ReactJS slider components can be built here for volume controls

import React from "react";
//import Axios from 'axios';
//import {useState} from 'react';
import {Link} from 'react-router-dom';

const Options = () => {
    
    return(
        <div className="App">
            <div className ="optionsForm">
                <h1>Game Options</h1>
                <form>
                    <p>
                    Master Volume 
                    </p><br />
                    <p>
                    Music Volume 
                    </p><br />                
                    <p>
                    SFX Volume 
                    </p><br />               
                    <Link to="/"><button type="submit">Accept</button></Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                 
                    <Link to="/"><button type="submit">Cancel</button></Link>            
                </form>
            </div><br />   
        </div>
    )    
}

export default Options;