import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Account = () => {

   const [user, setUser] = useState(['hi']);
   const [edit, setEdit] = useState(false);
   const [isEdited, setIsEdited] = useState(false);
   const [password, setPassword] = useState(false);
   const navigate = useNavigate();


    useEffect(() => {
        axios.get("/account").then((response) => {
            setUser([response.data.userData]);
        });
        if(isEdited)
            axios.get("/account").then((response) => {
                setUser([response.data.userData]);
            });
            setIsEdited(false);
    }, [isEdited]);

    const deleteAcct = () => {
        console.log(user);
        axios.post("/delete_acct",
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        }).then(res=> (res.status===200) ? navigate('/'): navigate('/'))
        .catch(err => console.log(err));
    }

    const showEdit= () => {
        setEdit(true);
    }

    const hideEdit = () => {
        setEdit(false);
    }

    const showPassword = () => {
        hideEdit();
        setPassword(true);
    }

    const hidePassword = () => {
        setPassword(false);
    }

    const handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        axios.post("/edit_account", data,
        {
          headers:  {
            'Content-Type': 'application/json'
          } 
        })
        .catch(err => console.log(err));
        setIsEdited(true);
        hideEdit();
        hidePassword();
    };

     return(
        <div className="App">
            <div className="content">
                {user.map((acct) => {
                return (
                    <div className="content">
                        <h1>{acct.username}</h1>
                        <h2>{acct.email}</h2>
                        <h3>Settler Wins: {acct.settlerWins}</h3>
                        <h3>Settler Losses: {acct.settlerLosses}</h3>
                        <h3>Native Wins: {acct.nativeWins}</h3>
                        <h3>Native Losses: {acct.nativeLosses}</h3>
                        <div>
                            {edit && <div className="modal">
                                 <h1>Edit Account</h1>
                                 <form onSubmit={handleSubmit}>
                                <label for='new-username'>New Username:</label>
                                <input type='text' name='username' value={acct.username}/>
                                <label for='new-email'>New Email:</label>
                                <input type='text' name='email' value={acct.email}/>
                                <button type='submit'>Submit</button>
                                <button onClick={hideEdit}>Cancel</button>
                                <button onClick={showPassword}>Change Password</button>
                                 </form>
                                 </div>}

                                 {password && <div className="modal">
                                 <h1>Edit Password</h1>
                                 <form onSubmit={handleSubmit}>
                                <label for='new-password'>New Password:</label>
                                <input type='password' name='password'/>
                                <label for='new-email'>Confirm New Password:</label>
                                <input type='password' name='passwordCheck'/>
                                <button type='submit'>Submit</button>
                                <button onClick={hidePassword}>Cancel</button>
                                 </form>
                                 </div>}
                        </div>
                    </div>
                )
            })}  
                <button onClick={showEdit}>Edit Account</button>
                <button onClick={deleteAcct}>Delete Account</button>
            </div>
            <span><Link to={"/"}>Home Page</Link> </span>
        </div>    
     )
}

export default Account;