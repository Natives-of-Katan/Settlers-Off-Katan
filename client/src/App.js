import logo from './logo.svg';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Account from './Account';
import Login from './Login';
import CreateAccount from './CreateAccount';
import Names from './Names';
import Home from './Home';

function App() {
  return (
        <BrowserRouter>
          <Routes>
          <Route exact path="/Login" element={<Account/>} />
          <Route exact path="/Login" element={<Login/>} />
          <Route exact path="/CreateAccount" element={<CreateAccount/>} />
          <Route exact path="/Names" element={<Names/>} />
            <Route exact path="/" element={<Home/>} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;
