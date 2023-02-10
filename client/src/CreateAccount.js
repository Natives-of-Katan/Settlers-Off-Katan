//import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
//import Axios from "axios";

const CreateAccount = () => {

return(
    <div className="App">
        <div className="content">
            <div className ="createAccountForm">
            <h1>Create Your Account</h1>
            <form>
                <input type ="text" placeHolder="Enter Username" 
                    /><br /><br />
                <input type ="text
                " placeHolder="Enter an Email" 
                    /><br /><br />                        
                <input type ="text
                " placeHolder="Enter Password" 
                    /><br /><br />
                <input type ="text
                " placeHolder="Re-enter Password" 
                    /><br /><br />                                                                       
            <Link to="/"><button type="submit">Submit</button></Link>
            </form>
            </div><br />               
            <Link to="/"><button type="submit">Cancel</button></Link>
        </div>
    </div>    
);
}

export default CreateAccount;