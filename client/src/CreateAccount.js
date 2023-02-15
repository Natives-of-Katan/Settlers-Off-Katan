//import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

const CreateAccount = () => {

    const onUserChange = e => {
        this.setState({
          username: e.target.value
        });
      };
    
     const  onEmailChange = e => {
        this.setState({
          email: e.target.value
        });
      };

      const onPasswordChange = e => {
        this.setState({
          password: e.target.value
        });
      };
    
      const onPasswordTwoChange = e => {
        this.setState({
          passwordCheck: e.target.value
        });
      };

   const handleSubmit = e => {
        e.preventDefault();
        const data = {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          passwordCheck: this.state.passwordCheck
        };
        axios
        .post("/sign_up", data)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }


    return(
        <div className="App">
            <div className="content">
                <div className ="createAccountForm">
                    <h1>Create Your Account</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="username" placeHolder="Enter Username" value={this.state.username}
                            onChange={this.onUserChange}/><br /><br />
                        <input type="text" name="email" placeHolder="Enter an Email" value={this.state.email}
                            onChange={this.onEmailChange}/><br /><br />                        
                        <input type="password" name="password" placeHolder="Enter Password" value={this.state.password}
                            onChange={this.onPasswordChange}/><br /><br />
                        <input type="password" name="passwordCheck" placeHolder="Re-enter Password" value={this.state.passwordCheck}
                            onChange={this.onPasswordTwoChange}/><br /><br />                                                                       
                        <Link to="/"><button type="submit">Submit</button></Link>
                    </form>
                </div><br />               
                <Link to="/"><button type="submit">Cancel</button></Link>
            </div>
        </div>    
    );
}

export default CreateAccount;