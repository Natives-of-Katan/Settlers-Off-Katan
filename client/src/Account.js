import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Account = () => {

   const [user, setUser] = useState(['hi']);
   const navigate = useNavigate();

    useEffect(() => {
        axios.get("/account").then((response) => {
            setUser([response.data.userData]);
        })
    }, []);

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

     return(
        <div className="App">
            <div className="content">
                <h1>Your Account</h1>
                {user.map((acct) => {
                return (
                    <div className="content">
                        <form>
                        <fieldset disabled="disabled">
                            <label for='username'>Username</label>
                                <input type='text' name='username' placeholder={acct.username}/><br/>
                            <label for='username'>Email</label>
                                <input type='text' name='username' placeholder={acct.email}/><br/>
                            <label for='username'>Settler Wins</label>
                                <input type='text' name='username' placeholder={acct.settlerWins}/><br/>
                            <label for='username'>Settler Losses</label>
                                <input type='text' name='username' placeholder={acct.settlerLosses}/><br/>
                            <label for='username'>Native Wins</label>
                                <input type='text' name='username' placeholder={acct.nativeWins}/><br/>
                            <label for='username'>Native Losses</label>
                                <input type='text' name='username' placeholder={acct.nativeLosses}/><br/>
                        </fieldset>
                        </form>
                    </div>
                )
            })}  
                <button class='btn-small'>Edit Account</button>
                <button class='btn-small' onClick={deleteAcct}>Delete Account</button>
            </div>
                
            <span><Link to={"/"}>Home Page</Link> </span>
        </div>    
     )
}

export default Account;