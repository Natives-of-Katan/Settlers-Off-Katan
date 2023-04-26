import React from 'react';
import {useContext} from 'react';
import {AuthContext} from './Contexts/AuthContext';
import {Link} from 'react-router-dom';
import {GameMusicContext} from './Contexts/GameMusicContext';

const Home = () => {
  const {auth, setAuth} = useContext(AuthContext);
  const {setPlaying, userTurnedOff} = useContext(GameMusicContext);

  const musicPlay = () => {
    if (!userTurnedOff) setPlaying(true);
  };
  
  return(
      <div className="App home">
          <div className ="content">
              <h1>Welcome to Settlers Of Katan</h1>
              <Link to={"/Play"}>
                  <button class="home-button btn-default-style" onClick={musicPlay}>Play</button>
              </Link>
              <br /><br />
              <Link to={"/Rules"}>
                  <button class="home-button btn-default-style" onClick={musicPlay}>Rules</button>
                  </Link>
              <br/><br />

          </div><br />

          {!auth && 
          <div> 
              <div className="Link">
                  <Link to={"/Login"} onClick={musicPlay}>Log in to start a new game</Link>
              </div><br />
              <div className="Link">
                  <Link to={"/CreateAccount"} onClick={musicPlay}>Not yet a member? Create an Account</Link>
              </div>
          </div>}
      </div>
    )    
}

export default Home;
