import { HexGrid, Layout, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import {React, useEffect, useState} from 'react';
import configs from './configurations';
import Pattern from '../Models/Pattern'
import CustomHex from '../Models/CustomHex';
import Edge from '../Models/Edge';
import Vertex from '../Models/Vertex';
import { initEdges, initVertices } from './boardUtils';

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
    const [vertices, updateVertice] = useState(initVertices(hexagons, size));
    const [edges, updateEdge] = useState(initEdges(hexagons, size));
    const [hexes, updateHexes] = useState([]);

    const [roadButtonPushed, canBuildRoad] = useState(false);
    const [settlementButtonPushed, canBuildSettlement] = useState(false);
    const [upgradeButtonPushed, canUpgradeSettlement] = useState(false);
    const [firstRounds, setFirstRounds] = useState(ctx.turn < G.players.length * 2);
    const [gameStart, setGameStart] = useState(false);

    const [diceRolled, setdiceRolled] = useState(false);
    const [movingRobber, setMovingRobber] = useState(false);
    const [stealingResource, setStealingResource] = useState(false);
    const [knightPlayed, setKnightPlayed] = useState(false);
    const [roadPlayed, setRoadPlayed] = useState(false);
    const [roadsWhenPlayed, setRoadsWhenPlayed] = useState(0);
    const [robberPosition, setRobberPosition] = useState("");
    const [scoreBoard, setScoreboard] = useState([]);
    const [buildSettlement, setBuildSettlement] = useState(false);
    const [upgradeSettlement, setUpgradeSettlement] = useState(false);
    const [buyCard, setBuyCard] = useState(false);

    const [buildRoad, setBuildRoad] = useState(false);
    const [longestRoad, setLongestRoad] = useState(4);
    const [longestRoadPlayer, setLongestRoadPlayer] = useState();

    //button settings
    const [monopolyPlayed, setMonopolyPlayed] = useState(false);
    const [plentyPlayed, setPlentyPlayed] = useState(false);
    const [plentyFirstChoice, setFirstChoice] = useState('');

    // map numbers
    const [tileNums, setTileNums] = useState([9, 8, 5, 12, 11, 3, 6, 10, 6, "Robber", 4, 11, 2, 4, 3, 5, 9, 10, 8]);
    const tileResource = ["wheat", "wood", "brick", "wheat", "wood", "ore", 
                            "wheat", "ore", "brick", "desert", "wheat", "sheep", 
                            "sheep", "sheep", "wood", "sheep", "wood", "brick", "ore"];

    //Ports
    const portHexagons = [
      { q: 3, r: -3, s: 0 }, { q: 3, r: -1, s: 1 }, { q: 2, r: 1, s: 1 }, { q: 0, r: 3, s: -3 }, { q: -2, r: 3, s: -2 }, 
      { q: -3, r: 2, s: 2 }, { q: -3, r: 0, s: 2 }, { q: -1, r: -2, s: 3 }, { q: 1, r: -3, s: 2 },
    ];
    const portNums = [ "3:1 ?", "2:1 Wheat", "2:1 Ore", "3:1 ?", "2:1 Sheep", "3:1 ?", "3:1 ?", "2:1 Brick", "2:1 Wood"
    ];

    useEffect(() => {
      moves.setPlayerColors();
      updateHexes(renderHexTiles());
    }, []);

    useEffect(() => {
      if (G.longestRoad != longestRoad) {
        setLongestRoad(G.longestRoad)
        setLongestRoadPlayer(ctx.currentPlayer)
      }
    }, [G.longestRoad])

    useEffect(() => {
      moves.addInitialResources(0, 'settlements')
    }, [firstRounds])

    useEffect(() => {
      moves.setHexMap(hexes);
      renderScoreBoard()
    }, [hexes]);

    const playTurn = () => {
      const d1 = 1+Math.floor(Math.random() *6);
      console.log(d1)
      const d2 = 1+Math.floor(Math.random() *6);
      console.log(d2)

      moves.rollDice(d1, d2);

      if (d1+d2 === 7) {
        setMovingRobber(true);
      }
      
      setdiceRolled(true);
    }

    const handleAddResources = id => {
      moves.addDevelopmentResources();
    }

    const handleKnight = id => {
      console.log("Played Knight")
      if (G.players[ctx.currentPlayer].developmentCards.knight > 0) {
        moves.playKnight();
        setKnightPlayed(true);
        setMovingRobber(true);
      }
    }

    const handleDraw = id => {
      moves.drawDevelopmentCard();
    }

    const handleVictoryCard = id => {
      moves.playVictoryCard();
    }

    const handleMonopoly = (choice) => {
      if (!monopolyPlayed) {
        setMonopolyPlayed(true);
      }
      else {
        moves.playMonopoly(choice);
        setMonopolyPlayed(false);
      }
    }

    const handlePlenty = (choice1, choice2) => {
        if (!plentyPlayed) {
          setPlentyPlayed(true);
         }
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

    const handleRoadBuilding = () => {
        if (G.players[ctx.currentPlayer].developmentCards.road > 0) {
          setRoadPlayed(true);
          setRoadsWhenPlayed(G.players[ctx.currentPlayer].totalRoads);
        }
    }

    const handleStealResource = (num) => {
      console.log(ctx.currentPlayer);
      console.log(num);
      if (ctx.currentPlayer != num) {
          moves.stealResource(num);
          setStealingResource(false);
      }
    }

    //function handleEndTurn() {
    const handleEndTurn = () => {
      events.endTurn();
      console.log("player %s ended turn. Current state of player %s: %s", ctx.currentPlayer, ctx.currentPlayer, JSON.stringify(G.players[ctx.currentPlayer]));
      setdiceRolled(false);
      setBuildSettlement(false);
      setGameStart(false);
      if (ctx.turn >= G.players.length * 2)
        setFirstRounds(false)
    }

    const startGame = () => {
      if(ctx.phase !== 'initRound2' && ctx.phase !=='initRound1')
        setFirstRounds(false)
      setGameStart(true)
      setBuildSettlement(true)
      setdiceRolled(true)
    }

    const handleBuildSettlement = () => {
      setBuildSettlement(G.players[ctx.currentPlayer].canBuildSettlement())
    }

    const firstPhasesComplete = () => {
      if (ctx.phase == 'initRound1' && (G.players[ctx.currentPlayer].settlements.length < 1 
        || G.players[ctx.currentPlayer].roads.length < 1)) 
        return false;
      else if  (ctx.phase == 'initRound2' && (G.players[ctx.currentPlayer].settlements.lengthh < 2 
        || G.players[ctx.currentPlayer].roads.length < 2)) 
        return false
      else
        return true
    }
  
    const renderScoreBoard = () => {
      setScoreboard(G.players.map((player, index) => (
        <tr key={index} className={index === Number(ctx.currentPlayer) ? 'current-player' : ''}>
          {console.log(index)}
          <td style={{color: player.color}}>Player{index + 1}</td>
          <td>{player.score}</td>
          </tr>
      )))
    }
                
  const onEdgeClick = (e, i) => {
    if (roadButtonPushed)
      moves.addRoad(e, i, edges, false, false);
    else if (roadPlayed && roadsWhenPlayed === G.players[ctx.currentPlayer].totalRoads) {
      moves.addRoad(e, i, edges, true, false);
    }
    else if (roadPlayed && roadsWhenPlayed + 1 === G.players[ctx.currentPlayer].totalRoads) {
      moves.addRoad(e, i, edges, true, true);
      setRoadPlayed(false);
      setRoadsWhenPlayed(0);
    }
    
    canBuildRoad(false);
    moves.checkLongestRoad(longestRoad, longestRoadPlayer);
  }

  const onVertexClick = (e, i) => {
    if (settlementButtonPushed) {
      moves.addSettlement(e, i, vertices);
      canBuildSettlement(false);
    }
    else if (upgradeButtonPushed) {
      moves.upgradeSettlement(e, i,vertices);
      canUpgradeSettlement(false);
    }
  }

  const onHexClick = (value, tile) => {
    console.log(value);

    const newTileNums = tileNums.map((x) => x);
    const currentValue = value;

    if (movingRobber && currentValue != "Robber") {

      for (let i = 0; i < newTileNums.length; i++) {
        if (newTileNums[i] == "Robber") {
          newTileNums[i] = robberPosition;
        }
      }

      setRobberPosition(currentValue);

      newTileNums[tile] = "Robber";

      setTileNums(newTileNums);
      setMovingRobber(false);
      setKnightPlayed(false);
      setStealingResource(true);

      moves.setTileNums(newTileNums);
    }
  }
  const getResource = (r) => {
    console.log("Resource", r);
  }

  const renderHexTiles = () => {
    const h = hexagons.map((hex, i) => (

      <CustomHex key={i} q={hex.q} r={hex.r} s={hex.s} fill={tileResource[i]} 
      vertices={vertices[i]} edges={edges[i]} onClick={() => onHexClick(tileNums[i], i)}>

      { 
        edges[i].map((e) => (
        <Edge {...e.props} onClick={() => onEdgeClick(e, i)}></Edge>
        ))}
      { 
        vertices[i].map((v) => (
        <Vertex {...v.props} onClick={() => onVertexClick(v, i)}></Vertex>
        ))}
        <Text>{tileNums[i]}</Text>
      </CustomHex>
    ))
    return h;
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

    if(currentPlayer.resources.wheat >= 2 && currentPlayer.resources.ore >= 3 && currentPlayer.settlements.length > 0)
      setUpgradeSettlement(true)
    else
      setUpgradeSettlement(false)

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
                
                  {!firstRounds && diceRolled && !movingRobber && !knightPlayed && !stealingResource && <text>You rolled: {JSON.stringify(G.players[Number(ctx.currentPlayer)].diceRoll)}</text>}
                  {!firstRounds && diceRolled && movingRobber && !knightPlayed && <text>You rolled: {JSON.stringify(G.players[Number(ctx.currentPlayer)].diceRoll)}. Choose a tile to move the Robber to</text>}
                  {diceRolled && movingRobber && knightPlayed && <text>You played a knight. Choose a tile to move the Robber to</text>}
                  {diceRolled && stealingResource && <text>Choose a player to steal a resource from</text>}
                  {!firstRounds && !diceRolled && <text>Roll The Dice!</text>}
                    {!firstRounds && !movingRobber && !knightPlayed && !stealingResource && !diceRolled &&  <button type='button' className='board-btn'onClick={playTurn}>Click to Roll!</button> }
                    {!gameStart && firstRounds && <button type='button' className='board-btn' onClick={startGame}>Place Pieces</button> }
                    {firstPhasesComplete() && !movingRobber && !knightPlayed && !stealingResource && diceRolled && <button type='button' className='board-btn' onClick={handleEndTurn}>End Turn</button> }
                </div>
                <div>
                  {gameStart && <text>Place settlement and road</text>}
                  {!firstRounds && diceRolled && <text>You rolled: {JSON.stringify(G.players[Number(ctx.currentPlayer)].diceRoll)}</text>}
                  {!firstRounds && !gameStart && !diceRolled && <text>Roll The Dice!</text>}
                </div>
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


                {upgradeSettlement && !roadPlayed && !monopolyPlayed && !plentyPlayed && !movingRobber && !knightPlayed && !stealingResource && <button type='button' disabled = {!diceRolled} onClick={() => canUpgradeSettlement(true)}>Upgrade Settlement</button> }
                {buildSettlement && !roadPlayed && !monopolyPlayed && !plentyPlayed && !movingRobber && !knightPlayed && !stealingResource && <button type='button' disabled = {!diceRolled} onClick={() => canBuildSettlement(true)}>Build Settlement</button> }
                {(gameStart || buildRoad) && !roadPlayed && !movingRobber && !monopolyPlayed && !knightPlayed && !stealingResource && <button type='button' disabled = {!diceRolled} onClick={() => canBuildRoad(true)}>Build Road</button> }
                
                {buyCard && !firstRounds && !roadPlayed && !monopolyPlayed && !plentyPlayed && !movingRobber && !knightPlayed && !stealingResource && <button onClick={handleDraw}>Buy Development Card (Costs 1 Sheep, Wheat, and Ore) </button>}
                {!firstRounds && !roadPlayed && !monopolyPlayed && !plentyPlayed && !movingRobber && !knightPlayed && !stealingResource && <button onClick={handleAddResources}>Add 1 of each resource and development card (this button is for dev purposes)</button>}
        

                {G.players[ctx.currentPlayer].canPlayCard && G.players[ctx.currentPlayer].developmentCards.knight > 0 && !monopolyPlayed && !roadPlayed && !plentyPlayed && !movingRobber && !knightPlayed && !stealingResource && plentyFirstChoice === '' && <button onClick={() => handleKnight()}>Play Knight (Move the robber and steal a resource)</button>}

                {G.players[ctx.currentPlayer].canPlayCard && G.players[ctx.currentPlayer].developmentCards.victory > 0 && !monopolyPlayed && !roadPlayed && !plentyPlayed && !movingRobber && !knightPlayed && !stealingResource && <button onClick={handleVictoryCard}>Play Victory Card (gain 1 Victory point)</button>}
        
                {G.players[ctx.currentPlayer].canPlayCard && G.players[ctx.currentPlayer].developmentCards.monopoly > 0 && !monopolyPlayed && !roadPlayed && !plentyPlayed && !movingRobber && !knightPlayed && !stealingResource && plentyFirstChoice === '' && <button onClick={() => handleMonopoly('')}>Play Monopoly (Choose a resource and take all of that resource from each player)</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('wheat')}>Wheat</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('sheep')}>Sheep</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('wood')}>Wood</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('brick')}>Brick</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('ore')}>Ore</button>}
        
                {G.players[ctx.currentPlayer].canPlayCard && G.players[ctx.currentPlayer].developmentCards.plenty > 0 && !plentyPlayed && !roadPlayed && !monopolyPlayed && !movingRobber && !knightPlayed && !stealingResource && <button onClick={() => handlePlenty('')}>Play Year of Plenty (Choose 2 resources and add them to your resources)</button>}
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

                {stealingResource && G.players.length >= 1 && <button onClick={() => handleStealResource(0)}>Player 1</button>}
                {stealingResource && G.players.length >= 2 && <button onClick={() => handleStealResource(1)}>Player 2</button>}
                {stealingResource && G.players.length >= 3 && <button onClick={() => handleStealResource(2)}>Player 3</button>}
                {stealingResource && G.players.length >= 4 && <button onClick={() => handleStealResource(3)}>Player 4</button>}
                {stealingResource && G.players.length >= 5 && <button onClick={() => handleStealResource(4)}>Player 5</button>}
                {stealingResource && G.players.length >= 6 && <button onClick={() => handleStealResource(5)}>Player 6</button>}
                {stealingResource && G.players.length >= 7 && <button onClick={() => handleStealResource(6)}>Player 7</button>}
                {stealingResource && G.players.length >= 8 && <button onClick={() => handleStealResource(7)}>Player 8</button>}

                {G.players[ctx.currentPlayer].canPlayCard && G.players[ctx.currentPlayer].developmentCards.road > 0 && !plentyPlayed && !roadPlayed && !monopolyPlayed && !movingRobber && !knightPlayed && !stealingResource && <button onClick={() => handleRoadBuilding()}>Play Road Building (Place Two Roads)</button>}
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
              renderHexTiles() }
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
          {longestRoad > 4 && <table className='longest-road'>
            <tbody>
              <tr><td>Longest Road:</td></tr>
              <tr><td>{longestRoad}</td></tr>
              <tr><td>{"Player " + (parseInt(longestRoadPlayer, 10) + 1)}</td>
              </tr>
            </tbody>
          </table>}
        </div>
      </div>
    </div>
  );
}


  export default GameBoard;
