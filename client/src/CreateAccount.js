import React from "react";
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {AuthContext} from './Contexts/AuthContext';
import {useContext, useState} from 'react';
import axios from "axios";

const CreateAccount = () => {
    
    //used to navigating to account page upon successful login
    const navigate = useNavigate();

    //states for error messages
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwCheckError, setPwCheckError] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    //become true when their respective fields satisfy their criteria
    const [nameValid, setNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [pwCheckValid, setPwCheckValid] = useState(false);

    //create account submission button disabled if any of the inputs are invalid
    const disabled = !(nameValid && emailValid && pwValid && pwCheckValid);

    //function used to set authentication status, using AuthContext that was imported
    const {setAuth} = useContext(AuthContext);

    //as long as their username is <n4 characters, user is told so
    const handleNameChange = event => {
        if(event.target.value.length < 4) {
            setNameError('username must be at least 4 characters!')
            setNameValid(false);
        }
        else {
            setNameError('');
            setNameValid(true);
        }
    }

    //user notified their email does not match the required format, until it does 
    const handleEmailChange = event => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if( !emailRegex.test(event.target.value)) {
            setEmailError('not a valid email format')
            setEmailValid(false);
        } 
         else {
            setEmailError('');
            setEmailValid(true);
         }
    }

    //user notified of password requirements (8 chars long) until it satisfies requirement
    const handlePasswordChange = event => {
        if(event.target.value.length < 8) {
            setPwError('password must be minimum 8 characters!');
            setPwCheckValid(false);
        }
        else {
            setPwError('');
            setPassword(event.target.value);
            setPwValid(true);
        }
    }

    //as user retypes their chosen password, they are notified as long as it is not equivalent to the original
    const handlePwCheck = event => {
        if(event.target.value!= password) {
            setPwCheckError('passwords do not match!');
            setPwCheckValid(false);
        }
        else {
            setPwCheckError('');
            setPwCheckValid(true);
        }
    }

    /*n submit, account creation data sent to server, if successful user is routed to their account
    if username is taken, user is notified
    */
    const handleSubmit = event => {
        event.preventDefault();
        //capture the form data
        const data = new FormData(event.target);
        axios.post("/api/sign_up", data,
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
                setFormError('The username you selected was already taken!');
            }
        }).catch(err => console.log(err));
    };

    return(
        <div className="App">
            <div className="content">
                <div className ="createAccountForm">
                    <h1>Create Your Account</h1>
                    <form classname = "post" onSubmit={handleSubmit}>
                        <p className='error-msg'>{formError}</p>
                        <input type="text" name="username" placeHolder="Enter Username" onChange={handleNameChange}
                            /><br /><span className='error-msg'>{nameError}</span><br />
                        <input type="text" name="email" placeHolder="Enter an Email" onChange={handleEmailChange}
                            />
                            <br /><span className='error-msg'>{emailError}</span><br />                        
                        <input type="password" name="password" placeHolder="Enter Password" onChange={handlePasswordChange}
                            /><br /><span className='error-msg'>{pwError}</span><br />
                        <input type="password" name="passwordCheck" placeHolder="Re-enter Password" onChange={handlePwCheck}
                            /><br /><span className='error-msg'>{pwCheckError}</span><br />                                                                       
                        <button class="create-acct-button btn-default-style" type="submit" disabled={disabled}>Submit</button>
                    </form>
                </div><br />               
                <Link to={"/"}><button class="create-acct-button btn-default-style" type="submit">Cancel</button></Link>
            </div>
        </div>    
    );
    
}

export default CreateAccount;