import { HexGrid, Layout, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import {React, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import configs from './configurations';
import Pattern from '../Models/Pattern'
import CustomHex from '../Models/CustomHex';
import Edge from '../Models/Edge';
import Vertex from '../Models/Vertex';
import { initEdges, initVertices } from './boardUtils';
import Modal from 'react-modal';



const GameBoard = ({ctx, G, moves, events, playerID}) => {

    useEffect(() => {
      if(G.players) {
        checkBuildActions();
      }
      renderScoreBoard();
      checkVictory();
  }, [G, ctx]);
    
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
    const [scoreBoard, setScoreboard] = useState([]);
    
    //trade hooks
    const [initiateTrade, setInitiateTrade] = useState(false); 
    const [tradeModalIsOpen, setTradeModalIsOpen] = useState(false);
    const [tradeWarning, setTradeWarning] = useState("");
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(
      ctx.currentPlayer === 0 ? 1 : 0
    );

    const [buildSettlement, setBuildSettlement] = useState(false);
    const [upgradeSettlement, setUpgradeSettlement] = useState(false);
    const [buyCard, setBuyCard] = useState(false);

    const [buildRoad, setBuildRoad] = useState(false);
    const [longestRoad, setLongestRoad] = useState(4);
    const [longestRoadPlayer, setLongestRoadPlayer] = useState();
    const [victory, setVictory] = useState(false);
    const navigate = useNavigate();


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
      moves.rollDice();
      setdiceRolled(true);
    }

    //Trade functions
    const openTradeModal = () => {
      setTradeModalIsOpen(true);
    };

    const [tradeCounts, setTradeCounts] = useState({
      wheat: 0,
      sheep: 0,
      wood: 0,
      brick: 0,
      ore: 0,
    });

    const [wantedResourceCounts, setWantedResourceCounts] = useState({
      wheat: 0,
      sheep: 0,
      wood: 0,
      brick: 0,
      ore: 0,
    });

    const resetTradeWantedResources = () => {
      setTradeCounts({
        wheat: 0,
        sheep: 0,
        wood: 0,
        brick: 0,
        ore: 0,
      });
    
      setWantedResourceCounts({
        wheat: 0,
        sheep: 0,
        wood: 0,
        brick: 0,
        ore: 0,
      });
    };

    const handleTradeButtonClick = (resource) => {
      setTradeCounts((prevCounts) => {
        const availableResource = G.players[ctx.currentPlayer].resources[resource];
        if (prevCounts[resource] < availableResource) {
          return {
            ...prevCounts,
            [resource]: prevCounts[resource] + 1,
          };
        }
        return prevCounts;
      });
    };

    const handleWantedResourceButtonClick = (resource) => {
      setWantedResourceCounts((prevCounts) => ({
        ...prevCounts,
        [resource]: prevCounts[resource] + 1,
      }));
    }; 

    const getOtherPlayerOptions = () => {
      return G.players
        .map((player, index) => {
          if (index !== parseInt(ctx.currentPlayer, 10)) {
            return (
              <option key={index} value={index}>
                Player {index + 1}
              </option>
            );
          }
          return null;
        })
        .filter((option) => option !== null);
    };

    const handlePlayerSelect = (event) => {
      console.log("Selected player:", event.target.value);
      if (event.target.value === "") {
        setSelectedPlayerIndex(null);
      } else {
        setSelectedPlayerIndex(parseInt(event.target.value));
      }
      console.log("Selected player index in handlePlayerSelect (gameboard.js):", selectedPlayerIndex);
      console.log("Selected player g.players.find:", G.players.find(player => player.id === playerID));
    };

    const handleMakeTrade = () => {
      const currentPlayerIndex = parseInt(ctx.currentPlayer, 10);
      const tradeResources = tradeCounts;
      const wantedResources = wantedResourceCounts;
    
      const selectedPlayerHasEnoughResources = Object.keys(wantedResources).every(resource => {  //check if enough resources to trade with
        return G.players[selectedPlayerIndex].resources[resource] >= wantedResources[resource];
      });
    
      if (!selectedPlayerHasEnoughResources) {
        setTradeWarning("The selected player cannot perform this trade.");
        return;
      } else {
        setTradeWarning("");
      }
    
      console.log('tradeResources before maketrade:', tradeResources);
      console.log('wantedResources before maketrade:', wantedResources);
      console.log('G before makeTrade:', G);
    
      moves.makeTrade(G, currentPlayerIndex, selectedPlayerIndex, tradeResources, wantedResources);
    
      setTradeModalIsOpen(false);
      resetTradeWantedResources();
    };
        
    useEffect(() => {
      console.log('Selected Player Index (inside useEffect):', selectedPlayerIndex);
    }, [selectedPlayerIndex]);

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
      setGameStart(false)
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
      moves.addRoad(e, i, edges);
    canBuildRoad(false);
    moves.checkLongestRoad(longestRoad, longestRoadPlayer);
  }

  const onVertexClick = (e, i) => {
    const playerV = G.players[ctx.currentPlayer].settlements.length;
    if (settlementButtonPushed) {
      moves.addSettlement(e, i, vertices);
    }
    else if (upgradeButtonPushed) {
      moves.upgradeSettlement(e, i,vertices);
      canUpgradeSettlement(false);
    }
    // if a player added a settlement since clicking, they can't build anymore
    if (G.players[ctx.currentPlayer].settlements.length > playerV)
      canBuildSettlement(false);

  }

  const getResource = (r) => {
    console.log("Resource", r);
  }

  const checkInvalid = (v) => {
    if (v.props.displayTooltip == "block")  {
      v.props.displayTooltip = "none";
    }
  }

  const renderHexTiles = () => {
    const h = hexagons.map((hex, i) => (
      <CustomHex key={i} q={hex.q} r={hex.r} s={hex.s} fill={tileResource[i]} number={tileNums[i]}
      vertices={vertices[i]} edges={edges[i]} onClick={() => getResource(tileResource[i])}>
      { 
        edges[i].map((e) => (
        <Edge {...e.props} onClick={() => onEdgeClick(e, i)}></Edge>
        ))}
      { 
        vertices[i].map((v) => (
        <Vertex {...v.props} onMouseOut={() => checkInvalid(v)} onClick={() => onVertexClick(v, i)}></Vertex>
        ))}
        <Text>{tileNums[i]}</Text>
      </CustomHex>
    ))
    return h;
  }

  const checkBuildActions = () => {
    if (!G.players) {
      return;
    }

    const currentPlayer = G.players[ctx.currentPlayer]
    let resources = currentPlayer.resources;
    const enoughResources = Object.values(resources).every(value => value >= 1);
    if(enoughResources || !firstPhasesComplete())
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

    if(currentPlayer.resources.wheat >= 1 || currentPlayer.resources.sheep >= 1 || currentPlayer.resources.wood >= 1 || currentPlayer.resources.brick >= 1 || currentPlayer.resources.ore >= 1)
      setInitiateTrade(true);
    else
      setInitiateTrade(false);  
    }

  const checkVictory = ()=> {
    if(G.players[ctx.currentPlayer].score >= 10)
      setVictory(true);
  }

  //rendering (comment for visual clarity)-------------------------------------------------------------------
    return (
    <div className="Game">
      <div className="GameBoard">
            <div className='board-text board-header'>
              <div className='board-header-center'>
                {!victory && <div className='current-player'>Player {Number(ctx.currentPlayer) + 1} 
                </div>}
                <div>
                    {!firstRounds && !diceRolled && !victory &&  <button type='button' className='board-btn'onClick={playTurn}>Click to Roll!</button> }
                    {!gameStart && firstRounds && !victory && <button type='button' className='board-btn' onClick={startGame}>Place Pieces</button> }
                    {firstPhasesComplete() && diceRolled && !victory && <button type='button' className='board-btn' onClick={handleEndTurn}>End Turn</button> }
                </div>
                <div>
                  {gameStart && !victory && <text>Place settlement and road</text>}
                  {!firstRounds && diceRolled && !victory &&  <text>You rolled: {JSON.stringify(G.players[Number(ctx.currentPlayer)].diceRoll)}</text>}
                  {!firstRounds && !gameStart && !diceRolled && !victory && <text>Roll The Dice!</text>}
                  {victory && <text>Game Over!</text>}
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

                {initiateTrade && <button type='button' disabled={!diceRolled} onClick={openTradeModal}>Trade</button>}
                {upgradeSettlement && <button type='button' disabled = {!diceRolled} onClick={() => canUpgradeSettlement(true)}>Upgrade Settlement</button> }
                {buildSettlement && <button type='button' disabled = {!diceRolled} onClick={() => canBuildSettlement(true)}>Build Settlement</button> }
                {(gameStart || buildRoad) && <button type='button' disabled = {!diceRolled} onClick={() => canBuildRoad(true)}>Build Road</button> }
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

        <Modal className='modal' shouldCloseOnOverlayClick={false} isOpen={tradeModalIsOpen} onRequestClose={() => setTradeModalIsOpen(false)}>
          <h2>Trade Resources</h2>
          <div>
            <h3>Resources To Trade</h3>
            <table className='board-text'>
               <tbody>
                  <tr>
                    <td>
                      Wheat: {JSON.stringify(G.players[ctx.currentPlayer].resources.wheat)}&nbsp;
                      <button onClick={() => handleTradeButtonClick('wheat')}>Trade: {tradeCounts.wheat}</button>
                    </td>&nbsp;&nbsp;
                    <td>
                      Sheep: {JSON.stringify(G.players[ctx.currentPlayer].resources.sheep)}{' '}
                      <button onClick={() => handleTradeButtonClick('sheep')}>Trade: {tradeCounts.sheep}</button>
                    </td>&nbsp;&nbsp;
                    <td>
                      Wood: {JSON.stringify(G.players[ctx.currentPlayer].resources.wood)}{' '}
                      <button onClick={() => handleTradeButtonClick('wood')}>Trade: {tradeCounts.wood}</button>
                    </td>&nbsp;&nbsp;
                    <td>
                      Brick: {JSON.stringify(G.players[ctx.currentPlayer].resources.brick)}{' '}
                      <button onClick={() => handleTradeButtonClick('brick')}>Trade: {tradeCounts.brick}</button>
                    </td>&nbsp;&nbsp;
                    <td>
                      Ore: {JSON.stringify(G.players[ctx.currentPlayer].resources.ore)}{' '}
                      <button onClick={() => handleTradeButtonClick('ore')}>Trade: {tradeCounts.ore}</button>
                    </td>
                  </tr>
                </tbody>
             </table>
          </div>
          <div>
            <h3>Trading For:</h3>
            <table className='board-text'>
              <tbody>
                <tr>
                  <td>
                    Wheat: {wantedResourceCounts.wheat}{' '}
                    <button onClick={() => handleWantedResourceButtonClick('wheat')}>Add</button>
                  </td>&nbsp;&nbsp;
                  <td>
                    Sheep: {wantedResourceCounts.sheep}{' '}
                    <button onClick={() => handleWantedResourceButtonClick('sheep')}>Add</button>
                  </td>&nbsp;&nbsp;
                  <td>
                    Wood: {wantedResourceCounts.wood}{' '}
                    <button onClick={() => handleWantedResourceButtonClick('wood')}>Add</button>
                  </td>&nbsp;&nbsp;
                  <td>
                    Brick: {wantedResourceCounts.brick}{' '}
                    <button onClick={() => handleWantedResourceButtonClick('brick')}>Add</button>
                  </td>&nbsp;&nbsp;
                  <td>
                    Ore: {wantedResourceCounts.ore}{' '}
                    <button onClick={() => handleWantedResourceButtonClick('ore')}>Add</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div><br></br>
          <div>
            {tradeWarning && <p style={{ color: "red" }}>{tradeWarning}</p>}
            <span>Trading with Player: </span>
            <select value={selectedPlayerIndex} onChange={handlePlayerSelect}>
              <option value="" disabled> Select a player</option>
              {getOtherPlayerOptions()}
            </select>&nbsp;&nbsp;
            <button onClick={() => {handleMakeTrade(G, ctx, moves.makeTrade);}}>Make Trade</button><br></br><br></br>
          </div>
          <button onClick={() => {setTradeWarning(""); resetTradeWantedResources();}}>Reset Trade Offer</button><br></br><br></br>
          <button onClick={() => {setTradeWarning(""); resetTradeWantedResources(); setTradeModalIsOpen(false);}}>Cancel</button>   

        </Modal>

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
        {victory && 
      <div className='modal game-over-modal'>
        We Have A Winner!
        <table className='end-game-scoreboard'>
          {G.players.map((player, index) => (
            <tr key={index} className={index === Number(ctx.currentPlayer) ? 'current-player' : ''}>
              <td>Player {index + 1}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </table>
        <button onClick={ () => {navigate('/PassAndPLay')}}>Play Again!</button>
        <button onClick={ () => {navigate('/')}}>No Thanks</button>
      </div>}
    </div>
   </div>
  );
}

  export default GameBoard;
