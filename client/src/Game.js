import { Client } from 'boardgame.io/react';
import { MultiplayerContext } from './Contexts/MultiplayerContext';
import {settlersOffKatan} from './Components/gameLogic';
import GameBoard from './Components/GameBoard';
import OnlineBoard from './Components/onlineBoard';
import { NumPlayersContext } from './Contexts/NumPlayersContext';
import { SeatNumberContext } from './Contexts/SeatNumberContext';
import {useContext} from 'react'

const Game = () => {

  const {multiplayer} = useContext(MultiplayerContext);
  const {numPlayers} = useContext(NumPlayersContext);
  const {seatNum} = useContext(SeatNumberContext);

  if(!multiplayer[0]) {
   
    const GameClient = Client({
    numPlayers: numPlayers,
    game: settlersOffKatan(Number(numPlayers)),
    board: GameBoard
  });

  return (
    <div>
      <GameClient />
    </div>
  );

}

else {
  const GameClient = Client({
    numPlayers: multiplayer[1],
    game: settlersOffKatan(multiplayer[1]),
    board: OnlineBoard
  })

  return (
    <div>
      <GameClient />
    </div>
  );

}
};

export default Game;