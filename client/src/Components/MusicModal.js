import React, {useContext} from 'react';
import {GameMusicContext} from '../Contexts/GameMusicContext';

const MusicModal = ({ show, onClose, shouldCloseOnOverlayClick = true }) => {
  const {
    playing,
    setPlaying,
    volume,
    setVolume,
    userTurnedOff,
    setUserTurnedOff,
  } = useContext(GameMusicContext);

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
  };

  const toggleMusic = () => {
    setPlaying(!playing);
    setUserTurnedOff(!userTurnedOff);
  };

  if (!show) {
    return null;
  }

  return (
    <>
        <div className="modal-overlay" 
            onClick={() => {
                if (shouldCloseOnOverlayClick) {
                onClose();
                }
            }}
        >
        <div className="modal"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
         <div className="optionsForm">
            <h1>Game Music Options</h1>
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
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
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button class="btn-default-style-onOff" onClick={toggleMusic}>
                  {playing ? 'Turn Off Music' : 'Turn On Music'}
                </button>
              </div>
            </div>
              <button onClick={onClose} className="modal-close">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicModal;
