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
    checkBuildActions();
  }, [ctx.currentPlayer, G.players[ctx.currentPlayer].resources]);
  
  
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
    const [buildRoad, setBuildRoad] = useState(false);


    //button settings
    const [monopolyPlayed, setMonopolyPlayed] = useState(false);
    const [plentyPlayed, setPlentyPlayed] = useState(false);
    const [plentyFirstChoice, setFirstChoice] = useState('');

    // map numbers
    const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    const tileResource = ["wheat", "wheat", "wheat", "wheat", "sheep", "sheep", 
                          "wood", "sheep", "wood", "desert", "wood", "wood", 
                          "brick", "brick", "brick", "ore", "ore", "ore", "sheep"];

    //Ports
    const portHexagons = [
      { q: 3, r: -3, s: 0 }, { q: 3, r: -1, s: 1 }, { q: 2, r: 1, s: 1 }, { q: 0, r: 3, s: -3 }, { q: -2, r: 3, s: -2 }, 
      { q: -3, r: 2, s: 2 }, { q: -3, r: 0, s: 2 }, { q: -1, r: -2, s: 3 }, { q: 1, r: -3, s: 2 },
    ];
    const portNums = [ "3:1 ?", "2:1 Wheat", "2:1 Ore", "3:1 ?", "2:1 Sheep", "3:1 ?", "3:1 ?", "2:1 Brick", "2:1 Wood"
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
      moves.rollDice();
      setdiceRolled(true);
  }

    const handleAddResources = id => {
      moves.addDevelopmentResources();
    }

    const handleDraw = id => {
      moves.drawDevelopmentCard();
    }

    const handleVictoryCard = id => {
      moves.playVictoryCard();
    }

    const handleMonopoly = (choice) => {
      if (!monopolyPlayed)
        setMonopolyPlayed(true);
      else {
        moves.playMonopoly(choice);
        setMonopolyPlayed(false);
      }
    }

    const handlePlenty = (choice1, choice2) => {
        if (!plentyPlayed)
          setPlentyPlayed(true);
        else if (choice2 === 'none') {
          if (choice1 === 'wheat')
            setFirstChoice('wheat');
          else if (choice1 === 'sheep')
            setFirstChoice('sheep');
          else if (choice1 === 'wood')
            setFirstChoice('wood');
          else if (choice1 === 'brick')
            setFirstChoice('brick');
          else if (choice1 === 'ore')
            setFirstChoice('ore');
        }
        else {
          moves.playYearOfPlenty(plentyFirstChoice, choice2);
          setFirstChoice('');
          setPlentyPlayed(false);
        }
    }

    //function handleEndTurn() {
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

  const checkBuildActions = () => {
    const currentPlayer = G.players[ctx.currentPlayer]
    let resources = currentPlayer.resources;
    const enoughResources = Object.values(resources).every(value => value >= 1);
    if(enoughResources)
      setBuildSettlement(true);
    else
      setBuildSettlement(false);

    if(currentPlayer.resources.wood >= 1 && currentPlayer.resources.brick >= 1)
      setBuildRoad(true);
    else
      setBuildRoad(false);

    if(currentPlayer.resources.sheep >= 1 && currentPlayer.resources.ore >= 1 && currentPlayer.resources.wheat > 1)
      setBuyCard(true);
    else
      setBuyCard(false);
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
                    Resources
                  </tr>
                  <tr>
                    <td>Wheat</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.wheat)}</td>
                  </tr>
                  <tr>
                    <td>Sheep</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.sheep)}</td>
                  </tr>
                  <tr>
                    <td>Wood</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.wood)}</td>
                  </tr>
                  <tr>
                    <td>Brick</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.brick)}</td>
                  </tr>
                  <tr>
                    <td>Ore</td>
                    <td>{JSON.stringify(G.players[ctx.currentPlayer].resources.ore)}</td>
                  </tr>
                  
                </tbody>
             </table>
          
              <div className='action-btns'>
                {buildSettlement && <button type='button' disabled = {!diceRolled}>Build Settlement</button> }
                {buildRoad && <button type='button' disabled = {!diceRolled}>Build Road</button> }
                {buyCard && <button type='button' disabled = {!diceRolled}>Buy Development Card</button> }
                
                {!monopolyPlayed && !plentyPlayed && <button onClick={handleDraw}>Draw Development Card (Costs 1 Sheep, Wheat, and Ore) </button>}
                {!monopolyPlayed && !plentyPlayed && <button onClick={handleAddResources}>Add 1 of each resource and development card (this button is for dev purposes)</button>}
        
                {G.players[ctx.currentPlayer].canPlayCard && G.players[ctx.currentPlayer].developmentCards.victory > 0 && !monopolyPlayed && !plentyPlayed && <button onClick={handleVictoryCard}>Play Victory Card (gain 1 Victory point)</button>}
        
                {G.players[ctx.currentPlayer].canPlayCard && G.players[ctx.currentPlayer].developmentCards.monopoly > 0 && !monopolyPlayed && !plentyPlayed && plentyFirstChoice === '' && <button onClick={() => handleMonopoly('')}>Play Monopoly (Choose a resource and take all of that resource from each player)</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('wheat')}>Wheat</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('sheep')}>Sheep</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('wood')}>Wood</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('brick')}>Brick</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('ore')}>Ore</button>}
        
                {G.players[ctx.currentPlayer].canPlayCard && G.players[ctx.currentPlayer].developmentCards.plenty > 0 && !plentyPlayed && !monopolyPlayed && <button onClick={() => handlePlenty('')}>Play Year of Plenty (Choose 2 resources and add them to your resources)</button>}
                {plentyPlayed && plentyFirstChoice === '' && <>Choice One</>}
                {plentyPlayed && plentyFirstChoice === '' && <button onClick={() => handlePlenty('wheat', 'none')}>Wheat</button>}
                {plentyPlayed && plentyFirstChoice === '' && <button onClick={() => handlePlenty('sheep', 'none')}>Sheep</button>}
                {plentyPlayed && plentyFirstChoice === '' && <button onClick={() => handlePlenty('wood', 'none')}>Wood</button>}
                {plentyPlayed && plentyFirstChoice === '' && <button onClick={() => handlePlenty('brick', 'none')}>Brick</button>}
                {plentyPlayed && plentyFirstChoice === '' && <button onClick={() => handlePlenty('ore', 'none')}>Ore</button>}
                {plentyPlayed && plentyFirstChoice !== '' && <>Choice Two</>}
                {plentyPlayed && plentyFirstChoice !== '' && <button onClick={() => handlePlenty(plentyFirstChoice, 'wheat')}>Wheat</button>}
                {plentyPlayed && plentyFirstChoice !== '' && <button onClick={() => handlePlenty(plentyFirstChoice, 'sheep')}>Sheep</button>}
                {plentyPlayed && plentyFirstChoice !== '' && <button onClick={() => handlePlenty(plentyFirstChoice, 'wood')}>Wood</button>}
                {plentyPlayed && plentyFirstChoice !== '' && <button onClick={() => handlePlenty(plentyFirstChoice, 'brick')}>Brick</button>}
                {plentyPlayed && plentyFirstChoice !== '' && <button onClick={() => handlePlenty(plentyFirstChoice, 'ore')}>Ore</button>}
                </div>
            </div>
        <HexGrid width={config.width} height={config.height}>

          <Pattern size={size} id="wheat" link="https://static.vecteezy.com/system/resources/thumbnails/005/565/283/small/rural-autumn-landscape-with-windmill-blue-sky-and-yellow-wheat-field-with-spikelet-of-rye-free-vector.jpg" ></Pattern>
          <Pattern size={size} id="sheep" link="https://media.istockphoto.com/id/1163580954/vector/summer-fields-landscape-cartoon-countryside-valley-with-green-hills-blue-sky-and-curly.jpg?s=612x612&w=0&k=20&c=eZFwR7xUp1YCFk7WM4wK4NbOlSXJZRuxzobNoPTWivs=" ></Pattern>
          <Pattern size={size} id="desert" link="https://t3.ftcdn.net/jpg/01/44/97/42/360_F_144974295_zwgoD2Z4wl22POM50B5W2045gDVEEDZ4.jpg"></Pattern>
          <Pattern size={size} id="wood" link="https://i.pinimg.com/originals/20/04/9e/20049e85d9af0e8444fcf38b6e31aa0d.jpg"></Pattern>
          <Pattern size={size} id="brick" link="https://t4.ftcdn.net/jpg/02/79/87/81/360_F_279878111_jpQIKrlz9ElTjSTM8pPiYOp2S1IUPfdy.jpg" ></Pattern>
          <Pattern size={size} id="ore" link="https://www.shutterstock.com/image-vector/mountain-cartoon-landscape-green-hills-260nw-568649782.jpg"></Pattern>
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
                <Pattern id="port" link="https://www.metalearth.com/content/images/thumbs/0004703_uss-constitution_1200.png" size={{x:3, y:9}} />
                <Text className="port-info">{portNums[i]}</Text>
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
