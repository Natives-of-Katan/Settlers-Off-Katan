import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import  {useNavigate} from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate();

    const handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        axios.post("/sign_in", data,
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        }).then(res=> (res.data.sessionID !=null) ? navigate('/Account'): navigate('/'))
        .catch(err => console.log(err));
    };

    return(
        <div className="App">
            <div className="content">
                <div className="loginForm">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="username" placeHolder="Enter Username" required /><br /><br />                
                        <input type="password" name="password" placeHolder="Enter Password" required /><br /><br />                                                                      
                        <button type="submit">Submit</button>
                    </form>
                    </div><br />               
                <Link to="/"><button type="submit">Cancel</button></Link>
            </div>
        </div>    
    );
}

export default Login;