import { HexGrid, Layout, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import {React, useEffect, useState, useContext} from 'react';
import { SockContext } from "../Contexts/SocketContext";
import { MatchIDContext } from '../Contexts/MatchIDContext';
import { MatchInfoContext } from '../Contexts/MatchInfoContext';
import { SeatNumberContext } from '../Contexts/SeatNumberContext';
import { AuthContext } from '../Contexts/AuthContext';
import { SessionContext } from '../Contexts/SessionContext';
import {useNavigate} from 'react-router-dom';
import configs from './configurations';
import Pattern from '../Models/Pattern'
import Vertex from '../Models/Vertex';
import Edge from '../Models/Edge';
import CustomHex from '../Models/CustomHex';

//need to set gamestate to G with a useEffect to upate things like diceroll, etc.

const OnlineBoard = ({ctx, G, moves, events}) => {

    // map settings
    const config = configs['hexagon'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexagons = generator.apply(this, config.mapProps);
    const layout = config.layout;
    const size = { x: 10, y: 10 };

    //socket
    const { socket } = useContext(SockContext);
    const { matchID } = useContext(MatchIDContext);
    const {seatNum } = useContext(SeatNumberContext);
    const {matchInfo} = useContext(MatchInfoContext);
    const {auth} = useContext(AuthContext);
    const {sessionID} = useContext(SessionContext);

    // initialize map
    const [pointCoords, setPoints] = useState([]);
    const [diceRolled, setdiceRolled] = useState(false);
    const [buildSettlement, setBuildSettlement] = useState(false);
    const [upgradeSettlement, setUpgradeSettlement] = useState(false);
    const [buyCard, setBuyCard] = useState(false);
    const [gameState, setGameState] = useState({});
    const [isMounted, setIsMounted] = useState(false);
    const [turnEnabled, setTurnEnabled] = useState(false);
    const [winner, setWinner] = useState('');
    const [gameOver, setGameOver] = useState(false);

    const navigate = useNavigate();


  //G is the template for our gameState, will use gameState going forward. page renders (isMounted) when gameState is set
    useEffect(() => {
      setGameState(G);
      setIsMounted(true);
    }, []);
    
    //whenever gameState changes, check if you're the current player to enable turn actions
    useEffect(() => {
      checkIfCurrentPlayer();
    }, [gameState]);

  useEffect(()=> {

    //check if you're the current player when new turn state is received
    socket.on('game-over', (newState) => {
      setGameState(newState);
      console.log(newState);
      setGameOver(true);
      setTurnEnabled(false);
      if(auth){
        (seatNum === newState.winner) ? socket.emit('winner', sessionID) : socket.emit('not-winner', sessionID)
      }
    })

    socket.on('roll-success', (newState) => {
      setGameState(newState);
    })

    socket.on('new-turn-update', (newState) => {
      setGameState(newState);
    })

  },[socket]);

    // map numbers
    const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    const tileResource = ["grain", "grain", "grain", "grain", "pasture", "pasture", 
                          "forest", "pasture", "forest", "desert", "forest", "forest", 
                          "hill", "hill", "hill", "mountain", "mountain", "mountain", "pasture"];

    //Ports
    const portHexagons = [
      { q: 3, r: -3, s: 0 }, { q: 3, r: -1, s: 1 }, { q: 2, r: 1, s: 1 }, { q: 0, r: 3, s: -3 }, { q: -2, r: 3, s: -2 }, 
      { q: -3, r: 2, s: 2 }, { q: -3, r: 0, s: 2 }, { q: -1, r: -2, s: 3 }, { q: 1, r: -3, s: 2 },
    ];

    // When an element is clicked, it's passed to the appropriate function                    
    const onClick = (id) => {
      // moves.callFunction(id);
    }

    // on initial render, get coordinates for vertices
    useEffect(() => {
      const polygons = Array.from(
        document.getElementsByTagName('polygon')
      );
      setPoints(polygons.map( (obj) => obj.points));
    }, []);

    // add button to specified vertex
    const addVertex = (int, type, user) => {
      // render grid first, or points don't exist
      if (pointCoords[0] != undefined) {
        return new Vertex(type,  user, pointCoords[0][int].x, pointCoords[0][int].y, onClick(int));
      }
    }

    // add edge to specified vertex
    const addEdge = (int, user) => {
      if (pointCoords[0] != undefined) {
        return (
          int < 5 ? new Edge(pointCoords[0][int], pointCoords[0][int + 1], user, onClick) : 
          new Edge(pointCoords[0][int], pointCoords[0][0], user,  onClick)
        )
      }
    }

    const playTurn = () => {
      socket.emit('dice-roll', ({gameState, matchID, seatNum}));
      setdiceRolled(true);
  }

    const handleEndTurn = () => {
      setdiceRolled(false);
      setBuildSettlement(false);
      setTurnEnabled(false);
      socket.emit('end-turn', ({gameState, matchID}));
  }

  
  const checkIfCurrentPlayer = () => {
    if(seatNum === gameState.currentPlayer)
      setTurnEnabled(true);
  }

  //rendering (comment for visual clarity)-------------------------------------------------------------------
    return (
    <div className="Game">
      {isMounted && <div className="GameBoard">
          <div className='board-text board-header'>
              <div className='board-header-center'>
                <div className='current-player'>{turnEnabled ? "Your" : matchInfo.players[gameState.currentPlayer] + "'s"} Turn!</div>
                
                <div>
                    {!diceRolled && turnEnabled &&  <button type='button' className='board-btn'onClick={playTurn}>Click to Roll!</button> }
                    {diceRolled && turnEnabled && <button type='button' className='board-btn' onClick={handleEndTurn}>End Turn</button> }
                
                </div>
                <div>
                  {diceRolled && <text>You rolled: {gameState.currentRoll}</text>}
                  {!turnEnabled && <text>{matchInfo.players[gameState.currentPlayer]} Rolled: {gameState.currentRoll}</text>}
                  {turnEnabled && !diceRolled && <text>Roll The Dice!</text>}
                  </div>
              </div>
            </div>
              
          <div className= 'grid-container'>
            <div className='turn-actions board-text'>
              <table>
               <tbody>
                  <tr>
                    <td>Grain</td>
                    <td>{gameState.players[seatNum].resources.wheat}</td>
                  </tr>
                  <tr>
                    <td>Pasture</td>
                    <td>{gameState.players[seatNum].resources.sheep}</td>
                  </tr>
                  <tr>
                    <td>Hill</td>
                    <td>{gameState.players[seatNum].resources.brick}</td>
                  </tr>
                  <tr>
                    <td>Mountain</td>
                    <td>{gameState.players[seatNum].resources.ore}</td>
                  </tr>
                  <tr>
                    <td>Forest</td>
                    <td>{gameState.players[seatNum].resources.wood}</td>
                  </tr>
                </tbody>
             </table>
          
              <div className='action-btns'>
                {gameState.players[gameState.currentPlayer].canBuildSettlement && <button type='button' disabled = {!diceRolled}>Build Settlement</button> }

                {gameState.players[gameState.currentPlayer].canBuildRoad && <button type='button' disabled = {!diceRolled}>Build Road</button> }
                {gameState.players[gameState.currentPlayer].canBuyCard && <button type='button' disabled = {!diceRolled}>Buy Development Card</button> }
              </div>
            </div>
        <HexGrid width={config.width} height={config.height}>

          <Pattern size={size} id="grain" link="https://static.vecteezy.com/system/resources/thumbnails/005/565/283/small/rural-autumn-landscape-with-windmill-blue-sky-and-yellow-wheat-field-with-spikelet-of-rye-free-vector.jpg" ></Pattern>
          <Pattern size={size} id="pasture" link="https://media.istockphoto.com/id/1163580954/vector/summer-fields-landscape-cartoon-countryside-valley-with-green-hills-blue-sky-and-curly.jpg?s=612x612&w=0&k=20&c=eZFwR7xUp1YCFk7WM4wK4NbOlSXJZRuxzobNoPTWivs=" ></Pattern>
          <Pattern size={size} id="desert" link="https://t3.ftcdn.net/jpg/01/44/97/42/360_F_144974295_zwgoD2Z4wl22POM50B5W2045gDVEEDZ4.jpg"></Pattern>
          <Pattern size={size} id="forest" link="https://i.pinimg.com/originals/20/04/9e/20049e85d9af0e8444fcf38b6e31aa0d.jpg"></Pattern>
          <Pattern size={size} id="hill" link="https://t4.ftcdn.net/jpg/02/79/87/81/360_F_279878111_jpQIKrlz9ElTjSTM8pPiYOp2S1IUPfdy.jpg" ></Pattern>
          <Pattern size={size} id="mountain" link="https://www.shutterstock.com/image-vector/mountain-cartoon-landscape-green-hills-260nw-568649782.jpg"></Pattern>
          <Pattern size={{x:1, y:2}} id="settlement" link="http://atlas-content-cdn.pixelsquid.com/stock-images/simple-house-NxE5a78-600.jpg"></Pattern>
          <Pattern size={{x:1, y:2}} id="city" link="https://img.lovepik.com/free-png/20210918/lovepik-city-png-image_400225367_wh1200.png"></Pattern>

          <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={config.origin}>
            { 
              hexagons.map((hex, i) => (
                <CustomHex key={i} q={hex.q} r={hex.r} s={hex.s} fill={tileResource[i]} vertices="" edges="">
                  {addEdge(0, 'none')}
                  {addEdge(1, 'none')}
                  {addEdge(2, 'none')}
                  {addEdge(3, 'none')}
                  {addEdge(4, 'none')}
                  {addEdge(5, 'none')}
                  {addVertex(0, 'none', 'none')} 
                  {addVertex(1, 'settlement', 'none')}
                  {addVertex(2, 'none', 'none')}
                  {addVertex(3, 'city', 'none')}
                  {addVertex(4, 'none', 'none')}
                  {addVertex(5, 'free', 'none')}
                  {/* <Text>{HexUtils.getID(hex)}</Text> */}
                  <Text>{tileNums[i]}</Text>
                </CustomHex>
              ))
            }
            { 
              portHexagons.map((hex, i) => (
               <CustomHex className='port-hex' key={i} q={hex.q} r={hex.r} s={hex.s} fill={"port"} vertices="" edges="">
                <Pattern id="port" link="https://www.metalearth.com/content/images/thumbs/0004703_uss-constitution_1200.png" size={{x:3, y:8.5}} />
                </CustomHex>
              ))
            }
          </Layout>
        </HexGrid>
        <div>
          <table className='scoreboard board-text'>
            <tbody>
              {gameState.players.map((player, index) => (
                <tr key={index} className={index == gameState.currentPlayer ? 'current-player' : ''}>
                  <td>{matchInfo.players[index]}</td><td>{player.score}</td>
               </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>}
     {gameOver &&
      <div className='modal game-over-modal'>
        We Have A Winner!
        <table className='end-game-scoreboard'>
          {gameState.players.map((player, index) => (
            <tr key={index} className={index === gameState.currentPlayer ? 'current-player' : ''}>
              <td>{matchInfo.players[index]}</td><td>{player.score}</td>
            </tr>
          ))}
        </table>
        <button onClick={ () => {navigate('/Play')}}>Play Again!</button>
        <button onClick={ () => {navigate('/')}}>No Thanks</button>
      </div>}
   </div>
  );
}

  export default OnlineBoard;