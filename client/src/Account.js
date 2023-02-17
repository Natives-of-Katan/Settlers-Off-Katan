import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Account = () => {

   const [accountData, setAccountData] = useState({});
   const navigate = useNavigate();

    useEffect(() => {
        axios.get("/account").then((response) => {
            setAccountData(response.data);
            console.log(response.data);
        })
    }, []);

    const deleteAcct = () => {
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
                <form>
                    <fieldset disabled="disabled">
                        <input type="text" name="username" placeHolder="{Username}" /><br />
                        <input type="text" name="email" placeHolder="{Email Address}" /><br />                        
                        <input type="text" name="settlerWins" placeHolder="{Settler Wins}" /><br />
                        <input type="text" name="settlerLosses" placeHolder="{Settler Losses}" /><br />                                                                        
                        <input type="text" name="nativeWins" placeHolder="{Native Wins}" /><br />           
                        <input type="text" name="nativeLosses" placeHolder="{Native Losses}" /><br />
                    </fieldset>
                </form>
                <button onClick={deleteAcct}>Delete Account</button>
            </div>
            <span><Link to={"/"}>Home Page</Link> </span>
        </div>    
     )
}

export default Account;