import { Client } from 'boardgame.io/react';
import {settlersOffKatan} from './Components/gameLogic';
import GameBoard from './Components/GameBoard';

const Game = Client({
  numPlayers: 4,
  game: settlersOffKatan,
  board: GameBoard,
});

export default Game;