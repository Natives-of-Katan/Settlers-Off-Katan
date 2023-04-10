import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {GameMusicContext} from "./Contexts/GameMusicContext";

const Options = () => {
    const {playing, setPlaying, volume, setVolume, userTurnedOff, setUserTurnedOff,} = useContext(
        GameMusicContext
    );

    const handleVolumeChange = (event) => {
        setVolume(parseFloat(event.target.value));
    };

    const toggleMusic = () => {
        setPlaying(!playing);
        setUserTurnedOff(!userTurnedOff);
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
   
    return(
        <div className="App">
        <div className="optionsForm">
            <h1>Game Music Options</h1>
            <div>
                <label htmlFor="volume">Volume:</label>
                <input
                    type="range"
                    id="volume"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>
            <div>
                <button onClick={toggleMusic}>
                    {playing ? "Turn Off Music" : "Turn On Music"}
                </button>
            </div>
            <form>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      
                <button class="options-button btn-default-style" type="button" onClick={goBack}>Go Back</button>          
            </form>
            </div><br />  
        </div>
    )    
}

export default Options;
