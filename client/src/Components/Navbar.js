import React from 'react'
import {Link} from 'react-router-dom';

function Navbar() {
  return (
    <ul>
    <li id="logo"><Link to="/">Settlers Off Katan</Link></li>
    <li><Link to="/Options">Options</Link></li>
    <li><Link to="/">Home</Link></li>
  </ul> 
  )
}

export default Navbar