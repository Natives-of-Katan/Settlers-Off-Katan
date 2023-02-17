import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import  {useNavigate} from 'react-router-dom'
import axios from "axios";

const CreateAccount = () => {

    const navigate = useNavigate();

    const handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        axios.post("/sign_up", data,
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
                <div className ="createAccountForm">
                    <h1>Create Your Account</h1>
                    <form classname = "post" onSubmit={handleSubmit}>
                        <input type="text" name="username" placeHolder="Enter Username"
                            /><br /><br />
                        <input type="text" name="email" placeHolder="Enter an Email"
                            /><br /><br />                        
                        <input type="password" name="password" placeHolder="Enter Password"
                            /><br /><br />
                        <input type="password" name="passwordCheck" placeHolder="Re-enter Password"
                            /><br /><br />                                                                       
                        <button type="submit">Submit</button>
                    </form>
                </div><br />               
                <Link to="/"><button type="submit">Cancel</button></Link>
            </div>
        </div>    
    );
    
}

export default CreateAccount;