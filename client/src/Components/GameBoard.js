import { HexGrid, Layout, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import {React, useEffect, useState} from 'react';
import configs from './configurations';
import Pattern from '../Models/Pattern'
import Vertex from '../Models/Vertex';
import Edge from '../Models/Edge';
import CustomHex from '../Models/CustomHex';

const GameBoard = ({ctx, G, moves, events}) => {

  useEffect(() => {
    renderScoreBoard();
  }, [ctx.currentPlayer]);
  
  
    // map settings
    const config = configs['hexagon'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexagons = generator.apply(this, config.mapProps);
    const layout = config.layout;
    const size = { x: 10, y: 10 };
  
    // initialize map
    const [pointCoords, setPoints] = useState([]);
    const [diceRolled, setdiceRolled] = useState(false);
    const [scoreBoard, setScoreboard] = useState([]);
    const [buildSettlement, setBuildSettlement] = useState(false);
    const [upgradeSettlement, setUpgradeSettlement] = useState(false);
    const [buyCard, setBuyCard] = useState(false);

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
      console.log(id);
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
        return new Vertex(type,  user, pointCoords[0][int].x, pointCoords[0][int].y, onClick);
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
      moves.rollDice();
      setdiceRolled(true);
  }

    const handleEndTurn = () => {
      events.endTurn();
      console.log("player %s ended turn. Current state of player %s: %s", ctx.currentPlayer, ctx.currentPlayer, JSON.stringify(G.players[ctx.currentPlayer]));
      setdiceRolled(false);
      setBuildSettlement(false);
  }
  
  const renderScoreBoard = () => {
    setScoreboard(G.players.map((player, index) => (
      <tr key={index} className={index === Number(ctx.currentPlayer) ? 'current-player' : ''}>
        {console.log(index)}
        <td>Player{index + 1}</td>
        <td>{player.score}</td>
        </tr>
    )
    )
    )
  }

  //rendering (comment for visual clarity)-------------------------------------------------------------------
    return (
    <div className="Game">
      <div className="GameBoard">
            <div className='board-text board-header'>
              <div className='board-header-center'>
                <div className='current-player'>Player {Number(ctx.currentPlayer) + 1}
                </div>
                <div>
                    {!diceRolled &&  <button type='button' className='board-btn'onClick={playTurn}>Click to Roll!</button> }
                    {diceRolled && <button type='button' className='board-btn' onClick={handleEndTurn}>End Turn</button> }
                </div>
                  {diceRolled && <text>You rolled: {JSON.stringify(G.players[Number(ctx.currentPlayer)].diceRoll)}</text>}
                  {!diceRolled && <text>Roll The Dice!</text>}
              </div>
            </div>
              
          <div className= 'grid-container'>
            <div className='turn-actions board-text'>
              <table>
               <tbody>
                  <tr>
                    <td>Grain</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.grain)}</td>
                  </tr>
                  <tr>
                    <td>Pasture</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.pasture)}</td>
                  </tr>
                  <tr>
                    <td>Hill</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.hill)}</td>
                  </tr>
                  <tr>
                    <td>Mountain</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.mountain)}</td>
                  </tr>
                  <tr>
                    <td>Forest</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.forest)}</td>
                  </tr>
                </tbody>
             </table>
          
              <div className='action-btns'>
                {G.players[ctx.currentPlayer].canBuildSettlement && <button type='button' disabled = {!diceRolled}>Build Settlement</button> }
                {G.players[ctx.currentPlayer].canBuildRoad && <button type='button' disabled = {!diceRolled}>Build Road</button> }
                {G.players[ctx.currentPlayer].canBuyCard && <button type='button' disabled = {!diceRolled}>Buy Development Card</button> }
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
              {scoreBoard}
            </tbody>
          </table>
        </div>
      </div>
    </div>
   </div>
  );
}

  export default GameBoard;