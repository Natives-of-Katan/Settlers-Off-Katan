import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {GameMusicContext} from '../Contexts/GameMusicContext';
import {AuthContext} from '../Contexts/AuthContext';
import {ProfileContext} from '../Contexts/ProfileContext';
import {useContext} from 'react';
import axios from 'axios';
import MusicModal from './MusicModal.js';

function Navbar() {
  const {auth, setAuth} = useContext(AuthContext);
  const {profile, setProfile} = useContext(ProfileContext);
  const {setPlaying, userTurnedOff} = useContext(GameMusicContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('/api/logout', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setAuth(false);
          setProfile({});
          navigate('/');
        }
      })
      .catch((err) => console.log(err));
  };

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  useEffect(() => {
    if (showOptionsModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showOptionsModal]);

  return (
    <div>
      <ul id="navbar">
        <li id="logo" class="nav-button">
          <Link
            to={location.pathname === "/Game" ? "#" : "/"}
            onClick={(e) => {
              if (location.pathname === "/Game") {
                e.preventDefault();
                if (
                  window.confirm(
                    "Leaving while the game is in progress will terminate the game. Are you sure you want to leave?"
                  )
                ) {
                  if (!userTurnedOff) setPlaying(true);
                  navigate("/");
                }
              } else {
                if (!userTurnedOff) setPlaying(true);
              }
            }}
          >
            Settlers Of Katan
          </Link>
        </li>
        <li class="nav-button nav-options-button">
          <button class="home-button btn-default-style-options"
            onClick={() => {
              if (!userTurnedOff) setPlaying(true);
              setShowOptionsModal(true);
            }}
          >
            Options
          </button>
        </li>
        {location.pathname !== "/Game" && (
          <li class="nav-button">
            <Link
              to="/" onClick={() => {
                if (!userTurnedOff) setPlaying(true);
              }}
            >
              Home
            </Link>
          </li>
        )}
        {auth && (
          <li class="nav-button">
            <Link to="/Account">{profile.username}</Link>
          </li>
        )}
        {auth && (
          <li class="nav-logout">
            <button className="online-btn-default" onClick={handleSubmit}>
              Logout
            </button>
          </li>
        )}
      </ul>
      <MusicModal shouldCloseOnOverlayClick={false} show={showOptionsModal} onClose={() => setShowOptionsModal(false)} />
    </div>
  );
}

export default Navbar;
