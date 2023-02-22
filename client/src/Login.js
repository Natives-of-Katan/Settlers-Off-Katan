//import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
//import Axios from "axios";

const Login = () => {

    return(
        <div className="App">
            <div className="content">
                <div className="loginForm">
                    <h1>Login</h1>
                    <form>
                        <input type="text" name="name" placeHolder="Enter Username" required /><br /><br />                
                        <input type="password" name="password" placeHolder="Enter Password" required /><br /><br />                                                                      
                        <Link to={"/"}><button type="submit">Submit</button></Link>
                    </form>
                    </div><br />               
                <Link to={"/"}><button type="submit">Cancel</button></Link>
            </div>
        </div>    
    );
}

export default Login;