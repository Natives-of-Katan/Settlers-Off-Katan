//import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
//import Axios from "axios";

const Login = () => {

return(
    <div className="App">
        <div className="content">
            <div className ="loginForm">
            <h1>Login</h1>
            <form>
                <input type ="text" placeHolder="Enter Username" 
                    /><br /><br />                
                <input type ="text
                " placeHolder="Enter Password" 
                    /><br /><br />                                                                      
                <Link to="/"><button type="submit">Submit</button></Link>
            </form>
            </div><br />
        <span><Link to={"/"}>Back</Link> </span>
        </div>
    </div>    
);
}

export default Login;