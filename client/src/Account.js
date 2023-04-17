import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from './Contexts/AuthContext'
import {ProfileContext} from './Contexts/ProfileContext';
import {useContext} from 'react'


const Account = () => {

    //states representing modal visibility
   const [edit, setEdit] = useState(false);
   const [editEmail, setEditEmail] = useState(false);
   const [editUserName, setEditUserName] = useState(false);
   const [isEdited, setIsEdited] = useState(false);
   const [pwModal, setPwModal] = useState(false);

   //used when comparing password and passwordCheck
   const [password, setPassword] = useState('');

   //Strings to alert user to respective input fields' requirements
   const [formError, setFormError] = useState(false);
   const [nameError, setNameError] = useState('');
   const [emailError, setEmailError] = useState('');
   const [pwCheckError, setPwCheckError] = useState('');
   const [pwError, setPwError] = useState('');

   //using the auth and profile contexts (logged in status and profile data)
   const {setAuth} = useContext(AuthContext);
   const {profile, setProfile} = useContext(ProfileContext);

   //navigate function to route to other pages
   const navigate = useNavigate();

   //all must be true for buttons to be active
   const [pwValid, setPwValid] = useState(false);
   const [pwCheckValid, setPwCheckValid] = useState(false);
   const [emailValid, setEmailValid] = useState(false);
   const [nameValid, setNameValid] = useState(false);
   
   //variables representing whether their respective buttons are enabled or disabled 
   const disabledNameBtn = !nameValid;
   const disabledEmailBtn = !emailValid;
   const disabledPwBtn = !(pwValid && pwCheckValid);


   //on page render, get user data to display on profile page
    useEffect(() => {
        axios.get("/api/userData").then((response) => {
            setProfile(response.data.userData);
        });
        //occurs after an account is edited, if so then the new data is renderd
        if(isEdited)
            axios.get("/api/userData").then((response) => {
                setProfile(response.data.userData);
            });
            setIsEdited(false);
    }, [isEdited]);

    //delete acct function, invoked when user clicks 'delete account'. on successful server response redirects to home page
    const deleteAcct = () => {
        axios.post("/api/delete_acct",
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        }).then(res=> {
            if(res.status===200) {
            setAuth(false);
            setProfile({}); //set the profile object to empty so that it does not render again on the page
            navigate('/');
            }
        }).catch(err => console.log(err));
    }

    //handleChange function while user enters a username in edit window; error displayed if less than four characters
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

    //handleChange function while user enters a new email address; if it does not follow a proper email format error is shown
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

    //handleChange function for when user enters a new password, error shown if password is 8 characters
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

    //handleChange function for when user confirms their password, error shown if it does not match the first password entry 
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


    //when an edit-account form is submitted successfully, the current modal closes and is replaced by the original edit-account modal
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
        setPwModal(false);     //ensure password modal is hidden
        setEditEmail(false);    //ensure email modal is hidden
        setEditUserName(false); //ensure usernmae modal is hidden
        setFormError(false);    //ensure no form error is displayed
        setEdit(true);          //show the original edit-account modal
            }
        })
        .catch(err => console.log(err));
    };

    //show the edit username modal, hide the original edit account modal
    const showUsername = () => {
        setEdit(false);
        setEditUserName(true);
    }

    //show the edit-email modal, hide the original edit email modal
    const showEmail = () => {
        setEdit(false);
        setEditEmail(true);
    }

    //show the edit password modal, hide the original edit email modal
    const showPassword = () => {
        setEdit(false);
        setPwModal(true);
    }

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
                                <button onClick={() => {setEdit(false)}}>Cancel</button>
                                </div>
                            }

                            {editUserName && <div className="modal">
                                <h1>Edit Username</h1>
                                <form onSubmit={handleSubmit}>
                                    {formError && <p className='error-msg'>username taken, please choose another!</p>}
                                    <label for='new-username'>New Username:</label>
                                    <p className='error-msg'>{nameError}</p>
                                    <input type='text' name='username' onChange={handleNameChange}/>
                                    <button type='submit' disabled={disabledNameBtn}>Submit</button>
                                 </form>
                                 <button onClick={() =>{setEditUserName(false); setFormError(false); setEdit(true)}}>Cancel</button>
                                 </div>
                                 }

                            {editEmail && <div className="modal">
                                <h1>Edit Email</h1>
                                <form onSubmit={handleSubmit}>
                                    <p className='error-msg'>{emailError}</p>
                                    <label for='new-email'>New Email:</label>
                                    <input type='text' name='email' onChange={handleEmailChange}/>
                                    <button type='submit' disabled={disabledEmailBtn}>Submit</button>
                                </form>
                                <button onClick={() => {setEditEmail(false); setEdit(true)}}>Cancel</button>
                                </div>
                                 }

                            {pwModal && <div className="modal">
                                 <h1>Edit Password</h1>
                                 <form onSubmit={handleSubmit}>
                                    <p className='error-msg'>{pwError}</p>
                                    <label for='new-password'>New Password:</label>
                                    <input type='password' name='password' onChange={handlePasswordChange}/>
                                    <label for='new-passwordCheck'>Confirm New Password:</label>
                                    {pwCheckError}
                                    <input type='password' name='passwordCheck' onChange={handlePwCheck}/>
                                    <button type='submit' disabled={disabledPwBtn}>Submit</button>
                                 </form>
                                 <button onClick={() => {setPwModal(false); setEdit(true)}}>Cancel</button>
                                 </div>}
                        </div>
                    </div>
                <button  className="btn-default-style" onClick={() => {setEdit(true)}}>Edit Account</button>
                <button className="btn-default-style" onClick={deleteAcct}>Delete Account</button>
            </div>
            <span><Link to={"/"}>Home Page</Link> </span>
        </div>    
     )
}

export default Account; 