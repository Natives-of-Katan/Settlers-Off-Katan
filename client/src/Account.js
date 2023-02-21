//import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
//import Axios from "axios";

const Account = () => {

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
            </div>
            <span><Link to={"/"}>Home Page</Link> </span>
        </div>    
    );
}

export default Account;