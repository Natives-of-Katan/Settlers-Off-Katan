import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from '../Contexts/AuthContext'
import {ProfileContext} from '../Contexts/ProfileContext';
import {useContext} from 'react'
import axios from "axios";


function Navbar() {

  const {auth, setAuth} = useContext(AuthContext);
  const {profile, setProfile} = useContext(ProfileContext);
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    axios.post("/api/logout",
    {
      headers:  {
        'Content-Type': 'application/json'
      } 
    }).then(res=>{
        if(res.status===200) {
          setAuth(false);
          setProfile({});
          navigate('/');
        }
    }).catch(err => console.log(err));
};

  return (
    <ul id="navbar"> 
    <li id="logo" className="nav-button"><Link to="/">Settlers Off Katan</Link></li>
    <li className="nav-button"><Link to="/Options">Options</Link></li>
    <li className="nav-button"><Link to="/">Home</Link></li>
    {auth && <li><Link to='/Account'>{profile.username}</Link></li>}
    {auth && <button onClick={handleSubmit}>Logout</button>}
  </ul> 
  )
}

export default Navbar