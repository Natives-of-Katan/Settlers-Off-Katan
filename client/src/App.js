import './App.css';
import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Names from './Names';
import Home from './Home';
import Navbar from "./Components/Navbar"

function App() {
  return (
        <BrowserRouter>
          <Navbar />
          <Routes>
          <Route exact path="/Names" element={<Names/>} />
            <Route exact path="/" element={<Home/>} />
          </Routes>
        </BrowserRouter>
  );
}

export default App;
