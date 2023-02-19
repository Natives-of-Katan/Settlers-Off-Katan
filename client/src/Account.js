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
   const {auth, setAuth} = useContext(AuthContext);
   const {profile, setProfile} = useContext(ProfileContext);
   const navigate = useNavigate();
   

   
    useEffect(() => {
        axios.get("/account").then((response) => {
            setProfile(response.data.userData);
        });
        if(isEdited)
            axios.get("/account").then((response) => {
                setProfile(response.data.userData);
            });
            setIsEdited(false);
    }, [isEdited]);

    const deleteAcct = () => {
        axios.post("/delete_acct",
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        }).then(res=> {
            if(res.status===200) {
            setAuth(false);
            navigate('/');
            }
        }).catch(err => console.log(err));
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
        axios.post("/edit_account", data,
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        }).then( () => {
        setIsEdited(true);
        setPassword(false);
        setEditEmail(false);
        setEditUserName(false);
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
                                    <label for='new-username'>New Username:</label>
                                    <input type='text' name='username'/>
                                    <button type='submit'>Submit</button>
                                 </form>
                                 <button onClick={() => setEditUserName(false)}>Cancel</button>
                                 </div>
                                 }

                            {editEmail && <div className="modal">
                                <h1>Edit Email</h1>
                                <form onSubmit={handleSubmit}>
                                    <label for='new-email'>New Email:</label>
                                    <input type='text' name='email'/>
                                    <button type='submit'>Submit</button>
                                </form>
                                <button onClick={() => setEditEmail(false)}>Cancel</button>
                                </div>
                                 }

                            {password && <div className="modal">
                                 <h1>Edit Password</h1>
                                 <form onSubmit={handleSubmit}>
                                    <label for='new-password'>New Password:</label>
                                    <input type='password' name='password'/>
                                    <label for='new-passwordCheck'>Confirm New Password:</label>
                                    <input type='password' name='passwordCheck'/>
                                    <button type='submit'>Submit</button>
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