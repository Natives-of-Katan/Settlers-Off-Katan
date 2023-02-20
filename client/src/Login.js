import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import  {useNavigate} from 'react-router-dom'
import {AuthContext} from './Contexts/AuthContext'
import {useContext} from 'react'

const Login = () => {

    const {setAuth} = useContext(AuthContext);
    const [loginError, setLoginError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        axios.post("/sign_in", data,
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        }).then(res=> {
            if(res.status===200) {
             setAuth(true);
             navigate('/Account');
            }
            else {
                setLoginError(true)
            }
        }).catch(err => console.log(err));
    };

    return(
        <div className="App">
            <div className="content">
                <div className="loginForm">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        {loginError && <div>username or password incorrect, did you mean to <Link to='/CreateAccount'>create an account?</Link></div>}
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