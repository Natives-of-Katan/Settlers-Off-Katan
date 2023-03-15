import { Client } from 'boardgame.io/react';
import {settlersOffKatan} from './Components/gameLogic';
import GameBoard from './Components/GameBoard';
import { NumPlayersContext } from './Contexts/NumPlayersContext';
import {useContext} from 'react'

const Game = () => {
  
  const {numPlayers} = useContext(NumPlayersContext);

  const GameClient = Client({
    numPlayers: numPlayers,
    game: settlersOffKatan(Number(numPlayers)),
    board: GameBoard,
  });

  return <GameClient />;
};

export default Game;