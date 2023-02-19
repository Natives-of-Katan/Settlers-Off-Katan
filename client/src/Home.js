import React from 'react';
import {useContext} from 'react';
import {AuthContext} from './Contexts/AuthContext';
import {Link} from 'react-router-dom';

const Home = () => {

    const {auth} = useContext(AuthContext);

    return(
        <div className="App">
            <div className ="content">
                <h1>Welcome to Settlers Off Katan</h1>
                <Link to={"/Play"}>
                    <button>Play</button>
                </Link>
                <br /><br />
                <Link to={"/Rules"}>
                    <button>Rules</button>
                    </Link>
                <br/><br />
                <Link to={"/Options"}>
                    <button>Options</button>
                </Link>
                <br />
            </div><br />

            {!auth && 
            <div> 
                <div className="Link">
                    <Link to={"/Login"}>Log in to start a new game</Link>
                </div><br />
                <div className="Link">
                    <Link to={"/CreateAccount"}>Not yet a member? Create an Account</Link>
                </div>
            </div>}
        </div>
      )    
}

export default Home;