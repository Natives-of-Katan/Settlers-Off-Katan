//import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
//import Axios from "axios";

const CreateAccount = () => {

return(
    <div className="App">
    <div className="content">
        <div className ="createAccountForm">
        <h1>Create Account</h1>
                <form>
                    <input type ="text" placeHolder="Enter Username" 
                        /><br />
                    <input type ="text
                    " placeHolder="Enter an Email" 
                        /><br />                        
                    <input type ="text
                    " placeHolder="Enter Password" 
                        /><br />
                    <input type ="text
                    " placeHolder="Re-enter Password" 
                        /><br />                                                                        
                    <button type="submit"> Submit </button>
                </form>
            </div>

            <span><Link to={"/"}>Home Page</Link> </span>

    </div>
    </div>    
);
}

export default CreateAccount;