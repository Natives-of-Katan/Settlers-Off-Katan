import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Results from './Results';
import Game from './Game';
import Lobby from './Lobby';
import JoinMatch from './JoinMatch';
import PassAndPlay from './PassAndPlay';
import Options from './Options';
import Rules from './Rules';
import Play from './Play';
import Account from './Account';
import Login from './Login';
import CreateAccount from './CreateAccount';
import Names from './Names';
import Home from './Home';
import Navbar from "./Components/Navbar"

function App() {
  return (
        <BrowserRouter>
          <Navbar />
          <Routes>
          <Route exact path="/Results" element={<Results/>} />
          <Route exact path="/Game" element={<Game/>} />
          <Route exact path="/Lobby" element={<Lobby/>} />
          <Route exact path="/JoinMatch" element={<JoinMatch/>} />
          <Route exact path="/PassAndPlay" element={<PassAndPlay/>} />
          <Route exact path="/Options" element={<Options/>} />
          <Route exact path="/Rules" element={<Rules/>} />
          <Route exact path="/Play" element={<Play/>} />
          <Route exact path="/Account" element={<Account/>} />
          <Route exact path="/Login" element={<Login/>} />
          <Route exact path="/CreateAccount" element={<CreateAccount/>} />
          <Route exact path="/Names" element={<Names/>} />
            <Route exact path="/" element={<Home/>} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;
