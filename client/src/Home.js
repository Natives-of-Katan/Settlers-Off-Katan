import React from 'react';
import {useContext} from 'react';
import {AuthContext} from './Contexts/AuthContext';
import {Link} from 'react-router-dom';
import {GameMusicContext} from './Contexts/GameMusicContext';

const Home = () => {

    const {auth, setAuth} = useContext(AuthContext);
    const {setPlaying, userTurnedOff} = useContext(GameMusicContext);

    return(
        <div className="App home">
            <div className ="content">
                <h1>Welcome to Settlers Off Katan</h1>
                <Link to={"/Play"}>
                    <button class="home-button btn-default-style" onClick={() => {if (!userTurnedOff) setPlaying(true);}}>Play</button>
                </Link>
                <br /><br />
                <Link to={"/Rules"}>
                    <button class="home-button btn-default-style" onClick={() => {if (!userTurnedOff) setPlaying(true);}}>Rules</button>
                    </Link>
                <br/><br />
                <Link to={"/Options"}>
                    <button class="home-button btn-default-style" onClick={() => {if (!userTurnedOff) setPlaying(true);}}>Options</button>
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