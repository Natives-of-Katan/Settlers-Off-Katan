import React from "react";
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {AuthContext} from './Contexts/AuthContext';
import {ProfileContext} from './Contexts/ProfileContext';
import {useContext, useState} from 'react';
import axios from "axios";

const CreateAccount = () => {

    const navigate = useNavigate();
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwCheckError, setPwCheckError] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const [nameValid, setNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [pwCheckValid, setPwCheckValid] = useState(false);

    const disabled = !(nameValid && emailValid && pwValid && pwCheckValid);

    const {setAuth} = useContext(AuthContext);
    const {setProfile} = useContext(ProfileContext);

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

    const handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data);
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
                        <p>{formError}</p>
                        <input type="text" name="username" placeHolder="Enter Username" onChange={handleNameChange}
                            /><br /><span>{nameError}</span><br />
                        <input type="text" name="email" placeHolder="Enter an Email" onChange={handleEmailChange}
                            />
                            <br /><span>{emailError}</span><br />                        
                        <input type="password" name="password" placeHolder="Enter Password" onChange={handlePasswordChange}
                            /><br /><span>{pwError}</span><br />
                        <input type="password" name="passwordCheck" placeHolder="Re-enter Password" onChange={handlePwCheck}
                            /><br /><span>{pwCheckError}</span><br />                                                                       
                        <button type="submit" disabled={disabled}>Submit</button>
                    </form>
                </div><br />               
                <Link to="/"><button type="submit">Cancel</button></Link>
            </div>
        </div>    
    );
    
}

export default CreateAccount;