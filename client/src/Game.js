import { Client } from 'boardgame.io/react';
import { SocketIO, Local} from 'boardgame.io/multiplayer';
import { GameCodeContext } from './Contexts/gameCodeContext';
import {settlersOffKatan} from './Components/gameLogic';
import GameBoard from './Components/GameBoard';
import { NumPlayersContext } from './Contexts/NumPlayersContext';
import {useContext} from 'react'

const Game = async () => {
  const {gameCode} = useContext(GameCodeContext);
  const {numPlayers} = useContext(NumPlayersContext);

  
  if(gameCode === 0) {
    console.log('local game');
    const GameClient = Client({
    numPlayers: numPlayers,
    game: settlersOffKatan(Number(numPlayers)),
    board: GameBoard,
    mulltiplayer: Local({
      // Enable localStorage cache
      persist: true,
      storageKey: 'bgio',
    })
  });
  return <GameClient/>;
}
else {
  console.log('online game created, game code is %s', gameCode);
  const GameClient = Client({
    numPlayers: 4,
    multiplayer: SocketIO({server: 'http://localhost:8000'}),
    game: settlersOffKatan(4),
    board: GameBoard,
  });

  return <GameClient matchID={gameCode}/>;
}
};

export default Game;