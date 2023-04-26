import { HexGrid, Layout, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import { React, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import configs from './configurations';
import Pattern from '../Models/Pattern'
import CustomHex from '../Models/CustomHex';
import Edge from '../Models/Edge';
import Vertex from '../Models/Vertex';
import { initEdges, initVertices } from './boardUtils';
import { parse, stringify } from 'flatted';

import { SockContext } from '../Contexts/SocketContext';
import { MatchIDContext } from '../Contexts/MatchIDContext';
import { MatchInfoContext } from '../Contexts/MatchInfoContext';
import { SeatNumberContext } from '../Contexts/SeatNumberContext';
import { SessionContext } from '../Contexts/SessionContext';
import { OnlineContext } from '../Contexts/OnlineContext';

import {
rollDice,
setHexMap,
addDevelopmentResources,
drawDevelopmentCard,
playVictoryCard,
playMonopoly,
playYearOfPlenty,
addRoad,
addInitialResources,
setPlayerColors,
addSettlement,
checkLongestRoad,
upgradeToCity
} from './onlineLogic';

const OnlineBoard = ({ctx, G, moves, events}) => {
 //online stuff 
 const { socket} = useContext(SockContext);
 const { matchID } = useContext(MatchIDContext);
 const { seatNum } = useContext(SeatNumberContext);
 const { matchInfo } = useContext(MatchInfoContext);
 const { sessionID } = useContext(SessionContext);
 const { setOnline } = useContext(OnlineContext);

 const [ isMounted, setIsMounted ] = useState(false);
 const [ gameState, setGameState ] = useState({});
 
 const [ turnEnabled, setTurnEnabled ] = useState(false);
 const [ canEmit, setCanEmit ] = useState(false);

//let server know you're ready to receive initial state
   useEffect( () => {
    socket.emit('ready', matchID);
  }, []);

  //if gameState changes, emit the changes, only if it's your turn 
  useEffect(() => {
    if(isMounted)
      checkVictory();

    if(canEmit & isMounted) {  
      const newState = {
        ...gameState, 
        hexes: stringify(Array.from(gameState.hexes)),
        boardRoads: stringify(Array.from(gameState.boardRoads)),
        boardVertices: stringify(Array.from(gameState.boardVertices))
      }

    socket.emit('state-change', ({newState, matchID}));
    console.log('change emitted');
    }

    if(gameState.phase === 'gameplay')
      setFirstRounds(false);

  }, [gameState]);

  //useEffects for socket listeners
  useEffect(()=> {

    //handle initial state from server at game start
    socket.once('initial-state', receivedState => {
      const newState = {
        ...receivedState,
        hexes: new Map(),
        boardVertices: new Map(),
        boardRoads: new Map()
      }
      setGameState(newState);
      setIsMounted(true);

      //if you're player 1, you start the game 
      if(seatNum === 0) {
        setTurnEnabled(true);
        setCanEmit(true);
      }
    })

    //when a new state change is received, update gameState, check if current player
    socket.on('state-change', (receivedState) => {
      console.log(receivedState);

      if(typeof receivedState !== 'undefined') {
      const newState = {
        ...receivedState,
        hexes: new Map(parse(receivedState.hexes)),
        boardRoads: new Map(parse(receivedState.boardRoads)),
        boardVertices: new Map(parse(receivedState.boardVertices))
      };

      setGameState(newState);
      console.log('new state received:\n ');
      console.log(newState);
    

      if(seatNum === receivedState.currentPlayer) {
        console.log('your turn');
        setTurnEnabled(true);
        setCanEmit(true);
      }
      else {
        setTurnEnabled(false);
        setCanEmit(false);
      }
     
    }
    })

    socket.on('vertices-update', receivedVertices => {
      const newVertices = parse(receivedVertices);
      updateVertices(newVertices);
    })

    socket.on('edges-update', receivedEdges => {
      const newEdges = parse (receivedEdges);
      setEdges(newEdges);
    });

    socket.on('trade-request', (filteredOutgoing, filteredIncoming, tempState) => {

      const newState = {
        ...tempState,
        hexes: new Map(parse(tempState.hexes)),
        boardRoads: new Map(parse(tempState.boardRoads)),
        boardVertices: new Map(parse(tempState.boardVertices))
      };

      setGameState(newState);

      setProposedTrade(displayTradeRequest( matchInfo.players[newState.currentPlayer], filteredOutgoing, filteredIncoming));
      setIncomingTradeReq(true);
      setTradeGetting(filteredOutgoing);
      setTradeGiving(filteredIncoming);
      setTradeButton(disableTradeButton(newState.players[seatNum].resources, filteredIncoming));
    });

    socket.on('trade-partner', seatNum => {
      const tempArray = [ ...tradeResponses ];
      tempArray[seatNum] = 'Accepted';
      setTradeResponses(tempArray);
    });

    socket.on('trade-success', (receivedState) => {
      const newState = {
        ...receivedState,
        hexes: new Map(parse(receivedState.hexes)),
        boardRoads: new Map(parse(receivedState.boardRoads)),
        boardVertices: new Map(parse(receivedState.boardVertices))
      };

      setGameState(newState);
      setTradeInitiatorMsg('Trade Successful!');
      setTradeSuccess(true);
      resetTradeValues();
    });

    socket.on('trade-declined', seatNum => {
      const tempArray = [ ...tradeResponses ];
      tempArray[seatNum] = 'Declined';
      setTradeResponses(tempArray);
    });

    socket.on('trade-cancelled' ,() => {
      setTradeButton(true);
      setProposedTrade('Trade Request was Cancelled!');
      resetTradeValues();
    });

  },[socket]);
  
  
    // map settings
    const config = configs['hexagon'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexagons = generator.apply(this, config.mapProps);
    const layout = config.layout;
    const size = { x: 10, y: 10 };

    // initialize map
    const [ vertices, updateVertices ] = useState(initVertices(hexagons, size));
    const [ edges, setEdges ] = useState(initEdges(hexagons, size));
    const [ hexes, updateHexes ] = useState(new Map());

    const [ roadButtonPushed, canBuildRoad ] = useState(false);
    const [ settlementButtonPushed, canBuildSettlement ] = useState(false);
    const [ upgradeButtonPushed, canUpgradeSettlement ] = useState(false);
    const [ firstRounds, setFirstRounds ] = useState(true);
    const [ gameStart, setGameStart ] = useState(false);

    const [ diceRolled, setdiceRolled ] = useState(false);
    const [ buildSettlement, setBuildSettlement ] = useState(false);
    const [ upgradeSettlement, setUpgradeSettlement ] = useState(false);
    const  [buyCard, setBuyCard ] = useState(false);
    const [maxTradeReceive] = useState(20);
    const [ incomingTradeReq, setIncomingTradeReq ] = useState(false);
    const [ outgoingTradeValues, setOutgoingTradeValues ] = useState({ wheat: 0, sheep: 0, 
          wood: 0,  brick: 0, ore: 0 });

    const [ incomingTradeValues, setIncomingTradeValues ] =  useState({ wheat: 0, sheep: 0, 
      wood: 0,  brick: 0, ore: 0 });
    const [ waitingTradeConfirm, setWaitingTradeConfirm ] = useState(false);

    const [ buildRoad, setBuildRoad ] = useState(false);
    const [ longestRoad, setLongestRoad ] = useState(4);
    const [ canTrade, setCanTrade ] = useState(false);
    const [proposedTrade, setProposedTrade] = useState('');

    const [ initiateTrade, setInitiateTrade ] = useState(false);
    const [ longestRoadPlayer, setLongestRoadPlayer ] = useState();
    const [ victory, setVictory ] = useState(false);
    const [ initial, setInitial ] = useState(true);
    const [tradeButton, setTradeButton ] = useState(false);
    const [ tradeGiving, setTradeGiving ] = useState({});
    const [tradeGetting, setTradeGetting] = useState({});
    const [ tradeResponses, setTradeResponses ] = useState((matchInfo.players.map( () => 'pending')));
    const [tradeSuccess, setTradeSuccess ] = useState(false);
    const [tradeInitiatorMsg, setTradeInitiatorMsg] = useState('');

    const [ outgoingTrade, setoutGoingTrade ] = useState([]);

    //used for leaving page after game end 
    const navigate = useNavigate();

    //button settings
    const [ monopolyPlayed, setMonopolyPlayed ] = useState(false);
    const [ plentyPlayed, setPlentyPlayed ] = useState(false);
    const [ plentyFirstChoice, setFirstChoice ] = useState('');

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
      if(isMounted) {
        console.log(gameState);
        setGameState(setPlayerColors(gameState));
      updateHexes(renderHexTiles());
      }
    }, [isMounted]);

    useEffect(()=> {
      updateHexes(renderHexTiles())
    },[edges, vertices])

    useEffect(() => {
      if (isMounted && gameState.longestRoad != longestRoad) {
        setLongestRoad(gameState.longestRoad)
        setLongestRoadPlayer(gameState.currentPlayer)
      }
    }, [isMounted, gameState])
    
  
    useEffect(() => {
      if(isMounted && initial) {
        addInitialResources(gameState, 0, 'settlements')
        setInitial(false);
      }
    }, [firstRounds])

    useEffect(() => {
      if(isMounted)
        setGameState(setHexMap(hexes, gameState));
    }, [isMounted, hexes])
    

    //begin turn
    const playTurn = () => {
      console.log(canEmit);
      const newState = {...gameState};
      setGameState(rollDice(newState));
      setdiceRolled(true);
      checkTradeEligibilty();
      checkBuildActions();
    }

    const checkTradeEligibilty = () => {
      const playerResources = gameState.players[gameState.currentPlayer].resources;
      const atLeastOneResource = Object.values(playerResources).some((resource => resource >= 1));
      console.log(atLeastOneResource);
      atLeastOneResource ? setCanTrade(true) : setCanTrade(false);
    }

    const handleAddResources = id => {
      const tempState = { ...gameState};
     setGameState(addDevelopmentResources(tempState));
    }

    const handleDraw = id => {
      const tempState = { ...gameState };
      setGameState(drawDevelopmentCard(tempState));
    }

    const handleVictoryCard = id => {
      const tempState = { ...gameState};
      setGameState(playVictoryCard(tempState));
    }

    const handleMonopoly = (choice) => {
      if (!monopolyPlayed)
        setMonopolyPlayed(true);
      else {
        const tempState = { ...gameState};
        setGameState(playMonopoly(tempState, choice));
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
          const tempState = { ...gameState};
          setGameState(playYearOfPlenty(tempState, plentyFirstChoice, choice2));
          setFirstChoice('');
          setPlentyPlayed(false);
        }
    }

    const handleEndTurn = () => {
      setdiceRolled(false);
      setTurnEnabled(false);
      setBuildSettlement(false);
      setGameStart(false)

      const newState = {
        ...gameState, 
        hexes: stringify(Array.from(gameState.hexes)),
        boardRoads: stringify(Array.from(gameState.boardRoads)),
        boardVertices: stringify(Array.from(gameState.boardVertices))
      }
  
      //emit state at end of turn, then 'turn off' socket emitter
      socket.emit('turn-end', ({newState, matchID}));
      console.log('sent')
      setCanEmit(false);
    }

    const startGame = () => {
      if(gameState.phase !== 'initRound2' && gameState.phase !=='initRound1')
        setFirstRounds(false)
      setGameStart(true)
      setBuildSettlement(true)
      setdiceRolled(true)
    }

    const firstPhasesComplete = () => {
      if (gameState.phase == 'initRound1' && (gameState.players[gameState.currentPlayer].settlements.length < 1 
        || gameState.players[gameState.currentPlayer].roads.length < 1)) 
        return false;
      else if  (gameState.phase == 'initRound2' && (gameState.players[gameState.currentPlayer].settlements.lengthh < 2 
        || gameState.players[gameState.currentPlayer].roads.length < 2)) 
        return false
      else
        return true
    }
         
  const onEdgeClick = (e, i) => {
    if (roadButtonPushed) {

      const newState = { ...gameState};
      const newEdges = { ...edges};
      const [returnState, returnEdges] = addRoad(newState, e, i, newEdges);

      setGameState(returnState);
      setEdges(returnEdges);
      const stringifiedEdges = stringify(returnEdges);

      socket.emit('edge-update', {stringifiedEdges, matchID});
      canBuildRoad(false);
    setGameState(checkLongestRoad(gameState, longestRoad, longestRoadPlayer));
    }
  }

  const onVertexClick = (e, i) => {
    if (settlementButtonPushed) {
      console.log('button push')
      const newState = { ...gameState};
      const newVertices = { ...vertices };
      const [returnState, returnVertices] = addSettlement(newState, e, i, newVertices);

      setGameState(returnState);
      updateVertices(returnVertices);
      const stringifiedVertices = stringify(returnVertices);
      socket.emit('vertices-update', {stringifiedVertices, matchID})
      canBuildSettlement(false);
    }
    else if (upgradeButtonPushed) {
    
      const newState = { ...gameState};
      const newVertices = { ...vertices};
      const [returnState, returnVertices] = upgradeToCity(newState, e, i, newVertices);
      setGameState(returnState);
      updateVertices(returnVertices);
      const stringifiedVertices = stringify(returnVertices);
      console.log('sending')
      socket.emit('vertices-update', {stringifiedVertices, matchID});
      canUpgradeSettlement(false);
    }
    canBuildSettlement(false);
  }

  const getResource = (r) => {
    console.log("Resource", r);
  }

  const renderHexTiles = () => {
    const h = hexagons.map((hex, i) => (
      <CustomHex key={i} q={hex.q} r={hex.r} s={hex.s} fill={tileResource[i]} number={tileNums[i]}
      vertices={vertices[i]} edges={edges[i]} onClick={() => getResource(tileResource[i])}>
      { 
        edges[i].map((e) => (
        <Edge {...e.props} onClick={() => {onEdgeClick(e, i)}}></Edge>
        ))}
      { 
        vertices[i].map((v) => (
        <Vertex {...v.props} onClick={() => {onVertexClick(v, i)}}></Vertex>
        ))}
        <Text>{tileNums[i]}</Text>
      </CustomHex>
    ))
    return h;
  }

  const checkBuildActions = () => {
    const currentPlayer = gameState.players[gameState.currentPlayer]
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
  }

  const checkVictory = ()=> {
    if(gameState.players[gameState.currentPlayer].score >= 10)
    if(!victory) {
      setVictory(true);
      socket.emit('winner', ({matchID, sessionID}));
    }
  }

  const insertOptions = (requesting) => {
    const values = [];
    if(requesting == '') {
    for(let i = 0; i <= maxTradeReceive; i++) {
      values.push(
        <option key={i} value={i}>{i}</option>
      );
    }
  }
  else {
    const numResource = gameState.players[gameState.currentPlayer].resources[requesting];
      for(let i = 0; i <= numResource; i++) {
        values.push(
          <option key={i} value={i}>{i}</option>
        );
      }
  }
    return values;
  }

  const handleSelectionChange = (event, type, resource) => {
    const value = event.target.value;

    if(type === 'tradeOut') {
      const tempOutgoing = { ...outgoingTradeValues};
      tempOutgoing[resource] = Number(value);
      setOutgoingTradeValues(tempOutgoing);
      console.log(tempOutgoing)
    }
    else if(type === 'tradeIn') {
      const tempIncoming= { ...incomingTradeValues };
      tempIncoming[resource] = Number(value);
      console.log(tempIncoming)
      setIncomingTradeValues(tempIncoming);
    }
  }

  const handleTradeSubmit = () => {
    setTradeInitiatorMsg('Waiting For Players To Accept/Decline Trade....')
    const tempOutgoing = { ...outgoingTradeValues };
    const tempIncoming = { ...incomingTradeValues };

    const newState = {
      ...gameState, 
      hexes: stringify(Array.from(gameState.hexes)),
      boardRoads: stringify(Array.from(gameState.boardRoads)),
      boardVertices: stringify(Array.from(gameState.boardVertices))
    }

    socket.emit('trade-request', ({ tempOutgoing, tempIncoming, matchID, newState}));
    setWaitingTradeConfirm(true);
  }

  const displayTradeRequest = (player, reqResources, tradeComp) => {
    const reqResourcesString = Object.entries(reqResources).map(([key, value]) => `${value} ${key}`).join(' and ');
    const tradeCompString = Object.entries(tradeComp).map(([key, value]) => `${value} ${key}`).join(' and ');
    return <p> {player} wants to trade {reqResourcesString} for {tradeCompString}</p>
  }

  const disableTradeButton = (yourResources, tradeGiving) => {

    console.log(tradeGiving);
    for (const [resource, requiredAmount] of Object.entries(tradeGiving)) {
      if (!yourResources[resource] || yourResources[resource] < requiredAmount) {
        return true; 
      }
    }
    return false; 
  };

  const handleDeclineTrade = () => {
    setIncomingTradeReq(false);
    socket.emit('decline-trade', ({seatNum, matchID}));
  }

  const handleValidTrade = () => {
    const tempState = {
      ...gameState, 
      hexes: stringify(Array.from(gameState.hexes)),
      boardRoads: stringify(Array.from(gameState.boardRoads)),
      boardVertices: stringify(Array.from(gameState.boardVertices))
    }

    Object.entries(tradeGetting).forEach(([resource, amount]) => {
      tempState.players[seatNum].resources[resource] += amount;
      tempState.players[tempState.currentPlayer].resources[resource] -= amount;
    })

    Object.entries(tradeGiving).forEach(([resource, amount]) => {
      tempState.players[seatNum].resources[resource] -= amount;
      tempState.players[tempState.currentPlayer].resources[resource] += amount;
    })

    console.log(tempState);
    setGameState(tempState);
    socket.emit('trade-complete', ({tempState, seatNum, matchID}));
    resetTradeValues();
    setIncomingTradeReq(false);
    setProposedTrade('');
  }

  const cancelTrade = () => {
    if(!tradeSuccess) {
      socket.emit('cancel-trade', {matchID});
    }
    setWaitingTradeConfirm(false);
    setInitiateTrade(false);
    const resetResponses = new Array(matchInfo.players.length).fill('pending');
    setTradeResponses(resetResponses);
  }

  const resetTradeValues = () => {
    const resetIncomingValues = {
      wheat: 0, sheep: 0, wood: 0,  brick: 0, ore: 0
    }
    const resetOutgoingValues = {
      wheat: 0, sheep: 0, wood: 0,  brick: 0, ore: 0
    }
    setIncomingTradeValues(resetIncomingValues);
    setOutgoingTradeValues(resetOutgoingValues);
  }

  //rendering (comment for visual clarity)-------------------------------------------------------------------
    return (
    <div className="Game">
     {isMounted &&  <div className="GameBoard">
            <div className='board-text board-header'>
              <div className='board-header-center'>
                {!victory && <div className='current-player'> {gameState.currentPlayer == seatNum ? "Your Turn!" : matchInfo.players[gameState.currentPlayer] +'s turn!' }
                </div>}
                <div>
                {!firstRounds && !diceRolled && !victory && turnEnabled && <button type='button' className='board-btn' onClick={playTurn}>Click to Roll!</button> }
                    {!gameStart && firstRounds && !victory && turnEnabled && <button type='button' className='board-btn' onClick={startGame}>Place Pieces</button> }
                    {firstPhasesComplete() && diceRolled && !victory && turnEnabled && <button type='button' className='board-btn' onClick={handleEndTurn}>End Turn</button> }
                </div>
                <div>
                  {gameStart && <text>Place settlement and road</text>}
                  {/*!firstRounds && diceRolled && <text>You rolled: {gameState.currentPlayer.diceRoll}</text>*/}
                  {!firstRounds && !gameStart && !diceRolled && !victory && turnEnabled && <text>Roll The Dice!</text>}
                  {diceRolled && turnEnabled && !firstRounds && !victory && <text>You Rolled a {gameState.currentRoll} </text>}
                  {!turnEnabled && !firstRounds && !victory && <text>{matchInfo.players[gameState.currentPlayer]} rolled a {gameState.currentRoll}</text>}
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
                    <td>{gameState.players[seatNum].resources.wheat}</td>
                  </tr>
                  <tr>
                    <td>Sheep</td>
                    <td>{gameState.players[seatNum].resources.sheep}</td>
                  </tr>
                  <tr>
                    <td>Wood</td>
                    <td>{gameState.players[seatNum].resources.wood}</td>
                  </tr>
                  <tr>
                    <td>Brick</td>
                    <td>{gameState.players[seatNum].resources.brick}</td>
                  </tr>
                  <tr>
                    <td>Ore</td>
                    <td>{gameState.players[seatNum].resources.ore}</td>
                  </tr>
                  
                </tbody>
             </table>
          
              <div className='action-btns'>
                {canTrade && !victory && diceRolled && <button type='button' onClick={ () => setInitiateTrade(true)}>Trade</button>}
                {upgradeSettlement && <button type='button' disabled = {!diceRolled} onClick={() => canUpgradeSettlement(true)}>Upgrade Settlement</button> }
                {buildSettlement && <button type='button' disabled = {!diceRolled} onClick={() => canBuildSettlement(true)}>Build Settlement</button> }
                {(gameStart || buildRoad) && <button type='button' disabled = {!diceRolled} onClick={() => canBuildRoad(true)}>Build Road</button> }
                {buyCard && <button type='button' disabled = {!diceRolled}>Buy Development Card</button> }
                
                {!monopolyPlayed && !plentyPlayed && <button onClick={handleDraw}>Draw Development Card (Costs 1 Sheep, Wheat, and Ore) </button>}
                {!monopolyPlayed && !plentyPlayed && <button onClick={handleAddResources}>Add 1 of each resource and development card (this button is for dev purposes)</button>}
        
                {gameState.players[seatNum].canPlayCard && gameState.players[seatNum].developmentCards.victory > 0 && !monopolyPlayed && !plentyPlayed && <button onClick={handleVictoryCard}>Play Victory Card (gain 1 Victory point)</button>}
        
                {gameState.players[seatNum].canPlayCard && gameState.players[seatNum].developmentCards.monopoly > 0 && !monopolyPlayed && !plentyPlayed && plentyFirstChoice === '' && <button onClick={() => handleMonopoly('')}>Play Monopoly (Choose a resource and take all of that resource from each player)</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('wheat')}>Wheat</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('sheep')}>Sheep</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('wood')}>Wood</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('brick')}>Brick</button>}
                {monopolyPlayed && <button onClick={() => handleMonopoly('ore')}>Ore</button>}
        
                {gameState.players[seatNum].canPlayCard && gameState.players[seatNum].developmentCards.plenty > 0 && !plentyPlayed && !monopolyPlayed && <button onClick={() => handlePlenty('')}>Play Year of Plenty (Choose 2 resources and add them to your resources)</button>}
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
                {/*<Text className="port-info">{portNums[i]}</Text>*/}
                </CustomHex>
              ))
            }
          </Layout>
        </HexGrid>
        <div>
          <table className='scoreboard board-text'>
            <tbody>
              {gameState.players.map((player, index) => (
                <tr key={index} className={index === gameState.currentPlayer ? 'current-player' : ''}>
                  <td style={{color: player.color}}>{matchInfo.players[index]}</td>
                  <td>{player.score}</td>
                 </tr> 
              ))}
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
          {gameState.players.map((player, index) => (
            <tr key={index} className={index === gameState.currentPlayer ? 'current-player' : ''}>
              <td>{matchInfo.players[index]}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </table>
        <button onClick={ () => {navigate('/Play'); setOnline(false)}}>Play Again!</button>
        <button onClick={ () => {navigate('/'); setOnline(false)}}>No Thanks</button>
      </div>}
    </div>}
    {initiateTrade &&
    <div className='modal'>
      {!waitingTradeConfirm &&
       <div>
        <p>Create Trade Request</p>
        <form>
          <p>Trading:</p>
          <label htmlFor= 'wheatOut '>Wheat:</label>
            <select name='wheatOut' id='wheatOut' onChange={e => handleSelectionChange(e, 'tradeOut', 'wheat')}> {insertOptions('wheat')} </select>
          <label htmlFor='sheepOut' >Sheep:</label>
            <select name='sheepOut' id='sheepOut' onChange={e => handleSelectionChange(e, 'tradeOut', 'sheep')}> {insertOptions('sheep')} </select>
          <label htmlFor='woodOut'>Wood:</label>
            <select name='woodOUt' id='woodOut' onChange={e => handleSelectionChange(e, 'tradeOut', 'wood')}> {insertOptions('wood')} </select>
          <label htmlFor='brickOut'>Brick:</label>
            <select name='brickOut' id='brickOut' onChange={e => handleSelectionChange(e, 'tradeOut', 'brick')}> {insertOptions('brick') }</select>
          <label htmlFor='oreOUt'>Ore:</label>
            <select name='oreOUt' id='oreOut' onChange={ e => handleSelectionChange(e,'tradeOut', 'ore')}> {insertOptions('ore')} </select>
            <br></br>
            <br></br>
          <p>Requesting:</p>
          <label htmlFor='wheatIn'>Wheat:</label>
            <select name='wheatIn' id='wheatIn' onChange={ e => handleSelectionChange(e,'tradeIn', 'wheat')}> {insertOptions('')} </select>
          <label htmlFor='sheepIn'>Sheep:</label>
            <select name='sheepIn' id='sheepIn' onChange={ e => handleSelectionChange(e, 'tradeIn', 'sheep')}> {insertOptions('')} </select>
          <label htmlFor='woodIn'>Wood:</label>
            <select name='woodIn' id='woodIn' onChange={ e => handleSelectionChange(e, 'tradeIn', 'wood')}> {insertOptions('')} </select>
          <label htmlFor='brickIn'>Brick:</label>
            <select name='brickIn' id='brickIn' onChange={ e => handleSelectionChange(e, 'tradeIn', 'brick')}> {insertOptions('') }</select>
          <label htmlFor='oreIn'>Ore:</label>
            <select name='oreIn' id='oreIn' onChange={ e=> handleSelectionChange(e,'tradeIn', 'ore')}> {insertOptions('')} </select>
        </form>
        <button onClick={handleTradeSubmit}>Submit Trade Request</button>
        <button onClick={()=>setInitiateTrade(false)}>Close</button>
      </div>}
      {waitingTradeConfirm && initiateTrade && 
       <div>
        <p>{tradeInitiatorMsg}</p>
        <table>
          <tbody>
          {matchInfo.players.map((player,index) => (
            index!== seatNum &&
            <tr key={index}>
              <td>{player}</td>
              <td>{tradeResponses[index]}</td>
            </tr>
        ))}
          </tbody>
        </table>
        <button onClick={cancelTrade}>{tradeSuccess ? 'Close' : 'Cancel Trade Request'}</button>
      </div>}
    </div>}
    {incomingTradeReq &&
    <div className='modal'>
      <p>{proposedTrade}</p>
      <button disabled={tradeButton} onClick={handleValidTrade}>Accept Trade </button>
      <button onClick={handleDeclineTrade}>Decline Trade </button>
      </div>}

    {!isMounted && <div>Initializing Game...</div>}
   </div>
  );
}

  export default OnlineBoard;
