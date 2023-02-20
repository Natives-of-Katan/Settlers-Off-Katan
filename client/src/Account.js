import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from './Contexts/AuthContext'
import {ProfileContext} from './Contexts/ProfileContext';
import {useContext} from 'react'


const Account = () => {

   const [edit, setEdit] = useState(false);
   const [editEmail, setEditEmail] = useState(false);
   const [editUserName, setEditUserName] = useState(false);
   const [isEdited, setIsEdited] = useState(false);
   const [password, setPassword] = useState(false);
   const [pwValid, setPwValid] = useState(false);
   const [pwCheckValid, setPwCheckValid] = useState(false);
   const [emailValid, setEmailValid] = useState(false);
   const [nameValid, setNameValid] = useState(false);
   const [formError, setFormError] = useState(false);
   const [nameError, setNameError] = useState('');
   const [emailError, setEmailError] = useState('');
   const [pwCheckError, setPwCheckError] = useState('');
   const [pwError, setPwError] = useState('');
   const {setAuth} = useContext(AuthContext);
   const {profile, setProfile} = useContext(ProfileContext);
   const navigate = useNavigate();
   
   const disabledNameBtn = !nameValid;
   const disabledEmailBtn = !emailValid;
   const disabledPwBtn = !(pwValid && pwCheckValid);


    useEffect(() => {
        axios.get("/api/userData").then((response) => {
            setProfile(response.data.userData);
        });
        if(isEdited)
            axios.get("/api/userData").then((response) => {
                setProfile(response.data.userData);
            });
            setIsEdited(false);
    }, [isEdited]);

    const deleteAcct = () => {
        axios.post("/api/delete_acct",
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        }).then(res=> {
            if(res.status===200) {
            setAuth(false);
            setProfile({});
            navigate('/');
            }
        }).catch(err => console.log(err));
    }

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

    const showEdit= () => {
        setEdit(true);
    }

    const showUsername = () => {
        setEdit(false);
        setEditUserName(true);
    }

    const showEmail = () => {
        setEdit(false);
        setEditEmail(true);
    }

    const showPassword = () => {
        setEdit(false);
        setPassword(true);
    }

    const handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        axios.post("/api/edit_account", data,
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        }).then((res) => {
            if(res.status===201) {
                setFormError(true);
            }
            else {
        setIsEdited(true);
        setPassword(false);
        setEditEmail(false);
        setEditUserName(false);
        setFormError(false);
            }
        })
        .catch(err => console.log(err));
    };

     return(
        <div className="App">
            <div className="content">
                    <div className="content">
                        <h1>{profile.username}</h1>
                        <h2>{profile.email}</h2>
                        <h3>Settler Wins: {profile.settlerWins}</h3>
                        <h3>Settler Losses: {profile.settlerLosses}</h3>
                        <h3>Native Wins: {profile.nativeWins}</h3>
                        <h3>Native Losses: {profile.nativeLosses}</h3>
                        <div>
                            {edit && <div className="modal">
                                <h1>Edit Account</h1>
                                <button onClick={showUsername}>Edit Username</button>
                                <button onClick={showEmail}>Edit Email</button>
                                <button onClick={showPassword}>Edit Password</button>
                                </div>
                            }

                            {editUserName && <div className="modal">
                                <h1>Edit Username</h1>
                                <form onSubmit={handleSubmit}>
                                    {formError && <p>username taken, please choose another!</p>}
                                    <label for='new-username'>New Username:</label>
                                    <p>{nameError}</p>
                                    <input type='text' name='username' onChange={handleNameChange}/>
                                    <button type='submit' disabled={disabledNameBtn}>Submit</button>
                                 </form>
                                 <button onClick={() =>{setEditUserName(false); setFormError(false)}}>Cancel</button>
                                 </div>
                                 }

                            {editEmail && <div className="modal">
                                <h1>Edit Email</h1>
                                <form onSubmit={handleSubmit}>
                                    <p>{emailError}</p>
                                    <label for='new-email'>New Email:</label>
                                    <input type='text' name='email' onChange={handleEmailChange}/>
                                    <button type='submit' disabled={disabledEmailBtn}>Submit</button>
                                </form>
                                <button onClick={() => setEditEmail(false)}>Cancel</button>
                                </div>
                                 }

                            {password && <div className="modal">
                                 <h1>Edit Password</h1>
                                 <form onSubmit={handleSubmit}>
                                    <p>{pwError}</p>
                                    <label for='new-password'>New Password:</label>
                                    <input type='password' name='password' onChange={handlePasswordChange}/>
                                    <label for='new-passwordCheck'>Confirm New Password:</label>
                                    {pwCheckError}
                                    <input type='password' name='passwordCheck' onChange={handlePwCheck}/>
                                    <button type='submit' disabled={disabledPwBtn}>Submit</button>
                                 </form>
                                 <button onClick={() =>setPassword(false)}>Cancel</button>
                                 </div>}
                        </div>
                    </div>
                <button onClick={showEdit}>Edit Account</button>
                <button onClick={deleteAcct}>Delete Account</button>
            </div>
            <span><Link to={"/"}>Home Page</Link> </span>
        </div>    
     )
}

export default Account; 