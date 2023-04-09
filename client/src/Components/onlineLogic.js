import { 
    vertexAvailable, 
    edgeAvailable, 
    vertexConnectsRoad, 
    edgeConnectsProperty, 
    initRoadPlacement, 
    getHexKey, 
    } from "./boardUtils";


import { longestRoad } from "./roadUtils";    
import { TurnOrder } from 'boardgame.io/core';

const tileResource = ["wheat", "wheat", "wheat", "wheat", "sheep", "sheep", 
                          "wood", "sheep", "wood", "desert", "wood", "wood", 
                          "brick", "brick", "brick", "ore", "ore", "ore", "sheep"];
const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];

// holds hex information in map
let hexes = new Map();
let boardVertices = new Map();
let boardRoads = new Map();

export const rollDice = (gameState) => {
    const newState = { ...gameState }
    const d1 = 1+Math.floor(Math.random() *6);
    const d2 = 1+Math.floor(Math.random() *6);
    newState.currentRoll = d1+d2; 

    if ( newState.currentRoll !== 7) {
        // settlements and cities get different resources
        addInitialResources({gameState: newState}, d1+d2, 'settlements')
        addInitialResources({gameState: newState}, d1+d2, 'cities')
    }

    return newState;
}  

export const processEndTurn = (gameState) => {
    const newState = { ...gameState }
    newState.currentPlayer = (newState.currentPlayer + 1 ) % newState.players.length;
    newState.turn += 1;

    return newState;
}

const addInitialResources = ({gameState, ctx, playerID}, diceNum, property) => {
    gameState.players.forEach((player) => {
        let playerProperties = property == 'settlements' ? player.settlements : player.cities;
        let settlementHexes = playerProperties.map((v) => { 
            // get array of adjacent hexes
            return [hexes.get(getHexKey(boardVertices.get(v).props.hexes[0])),
            hexes.get(getHexKey(boardVertices.get(v).props.hexes[1])),
            hexes.get(getHexKey(boardVertices.get(v).props.hexes[2]))];
        });
        // add resources if the hex is rolled
        settlementHexes.forEach((sHexes) => { sHexes.forEach((hex) => {
            if (hex != undefined && (diceNum == 0 || diceNum == hex.props.number) && hex.props.fill != 'desert')
                player.resources[hex.props.fill] += (property == 'settlements' ? 1 : 2);
            });
        });
    })
}

const setPlayerColors = ({gameState}) => {
    const colors = ["gold", "blue", "violet", "brown"];
    for (let i = 0; i < gameState.players.length; i++) {
        gameState.players[i].color = colors[i];
    }
}

const addSettlement = ({gameState, playerID, ctx}, vertex, i, vertices) => {
    const newVertex = {...vertex}
    const newProps = {...newVertex.props}
    // check if the vertex is taken
    if (vertexAvailable(vertex, hexes) && (firstSettlements(gameState, ctx, playerID) || 
    (ctx.turn > gameState.players.length * 2 && vertexConnectsRoad(vertex, hexes, gameState.players[playerID].color)))) 
    {
        if (!firstSettlements(gameState, ctx, playerID)) {
            gameState.players[playerID].resources.wood -=1;
            gameState.players[playerID].resources.sheep -= 1;
            gameState.players[playerID].resources.wheat -= 1;
            gameState.players[playerID].resources.brick -= 1;
        }
        newProps.type = 'settlement';
        newProps.user = gameState.players[playerID].color;
        newProps.classes = 'active';
        newVertex.props = newProps

        vertices = vertices[i][vertices[i].indexOf(vertex)] = newVertex;
        boardVertices.set(vertex.props.id, newVertex)
        gameState.players[playerID].score += 1;
        gameState.players[playerID].settlements.push(newVertex.props.id);
    }  
}

const upgradeSettlement = ({gameState, playerID}, vertex, i, vertices) => {
    if (vertex.props.stroke == gameState.players[playerID].user ) {
        const newVertex = {...vertex}
        const newProps = {...newVertex.props}
        newProps.type = 'city';
        newVertex.props = newProps;

        // add to cities list, remove from settlements
        gameState.players[playerID].cities.push(vertex.props.id);
        boardVertices.set(vertex.props.id, newVertex)
        gameState.players[playerID].settlements = gameState.players[playerID].settlements.filter(function(item) {
            return item !== vertex.props.id
        })
        // update board state and resources
        vertices = vertices[i][vertices[i].indexOf(vertex)] = newVertex;
        gameState.players[playerID].resources.wheat -= 2;
        gameState.players[playerID].resources.ore -= 3;
        gameState.players[playerID].score += 1;
    }
}

const firstSettlements = (gameState, ctx, playerID) => {
    return ((ctx.turn <= gameState.players.length && gameState.players[playerID].settlements.length == 0) 
        || (ctx.turn > gameState.players.length && gameState.players[playerID].settlements.length == 1 ))
}

const firstRoads = (gameState, ctx, playerID, e, hexes, color) => {
    if (initRoadPlacement(e, hexes, color))
        return ((ctx.phase == 'initRound1' && gameState.players[playerID].settlements.length == 1 
        && gameState.players[playerID].roads.length == 0) || ctx.phase == 'initRound2' 
        && gameState.players[playerID].roads.length == 1)
    return false;
}

const addRoad = ({gameState, playerID, ctx}, edge, i, edges) => {
    // new properties
    const newEdge = {...edge}
    const newProps = {...newEdge.props}
    newProps.stroke =  gameState.players[playerID].color;
    newProps.classes = newProps.classes + "active";
    newEdge.props = newProps;
    // if edge is available
    const firstRounds = firstRoads(gameState, ctx, playerID, edge, hexes, gameState.players[playerID].color);
    if (edgeAvailable(edge, hexes) && (firstRounds|| (ctx.turn > gameState.players.length * 2 && 
        edgeConnectsProperty(edge, hexes, gameState.players[playerID].color)))) {
        edges = edges[i][edges[i].indexOf(edge)] = newEdge;
        if (!firstRounds) {
            gameState.players[playerID].resources.wood -= 1;
            gameState.players[playerID].resources.brick -= 1;
        }
        gameState.players[playerID].roads.push(newEdge.props.id);
        boardRoads.set(newEdge.props.id, newEdge)
    }
}

const addDevelopmentResources = ({gameState, playerID}) => {
    gameState.players[playerID].resources.sheep += 1;
    gameState.players[playerID].resources.wheat += 1;
    gameState.players[playerID].resources.ore += 1;
    gameState.players[playerID].resources.brick += 1;
    gameState.players[playerID].resources.wood += 1;
    gameState.players[playerID].developmentCards.knight += 1;
    gameState.players[playerID].developmentCards.victory += 1;
    gameState.players[playerID].developmentCards.monopoly += 1;
    gameState.players[playerID].developmentCards.road += 1;
    gameState.players[playerID].developmentCards.plenty += 1;
}

const drawDevelopmentCard = ({gameState, playerID}) => {
    //Checks if the player has the required resources and that the deck has at least 1 card in it
    if (gameState.players[playerID].resources.sheep > 0 && gameState.players[playerID].resources.wheat > 0 && gameState.players[playerID].resources.ore > 0 && gameState.deck.knight+gameState.deck.victory+gameState.deck.monopoly+gameState.deck.plenty+gameState.deck.road > 0) {
        
        //Determines what card will be drawn
        const drawnCard = 1+Math.floor(Math.random() * (gameState.deck.knight+gameState.deck.victory+gameState.deck.monopoly+gameState.deck.plenty+gameState.deck.road));
        
        //Subtracts the resources from the player
        gameState.players[playerID].resources.sheep -= 1;
        gameState.players[playerID].resources.wheat -= 1;
        gameState.players[playerID].resources.ore -= 1;
        
        //Adds card to player's hand and removes it from the deck
        if (drawnCard <= gameState.deck.knight) {
            gameState.players[playerID].developmentCards.knight += 1;
            gameState.deck.knight -= 1;
        }
        else if (drawnCard <= (gameState.deck.knight+gameState.deck.victory)) {
            gameState.players[playerID].developmentCards.victory += 1;
            gameState.deck.victory -= 1;
        }
        else if (drawnCard <= (gameState.deck.knight+gameState.deck.victory+gameState.deck.monopoly)) {
            gameState.players[playerID].developmentCards.monopoly += 1;
            gameState.deck.monopoly -= 1;
        }
        else if (drawnCard <= (gameState.deck.knight+gameState.deck.victory+gameState.deck.monopoly+gameState.deck.plenty)) {
            gameState.players[playerID].developmentCards.plenty += 1;
            gameState.deck.plenty -= 1;
        }
        else if (drawnCard <= (gameState.deck.knight+gameState.deck.victory+gameState.deck.monopoly+gameState.deck.plenty+gameState.deck.road)) {
            gameState.players[playerID].developmentCards.road += 1;
            gameState.deck.road -= 1;
        }
    }
}

const playVictoryCard = ({gameState, playerID}) => {
    if (gameState.players[playerID].developmentCards.victory > 0) {
        gameState.players[playerID].developmentCards.victory -= 1;
        gameState.players[playerID].score += 1;
        gameState.players[playerID].canPlayCard = false;
    }
}

const playYearOfPlenty = ({gameState , playerID}, choice1, choice2) => {
    if (gameState.players[playerID].developmentCards.plenty > 0) {

        gameState.players[playerID].developmentCards.plenty -=1;
        gameState.players[playerID].canPlayCard = false;

        if (choice1 === 'wheat') 
            gameState.players[playerID].resources.wheat += 1;
        else if (choice1 === 'sheep') 
            gameState.players[playerID].resources.sheep += 1;
        else if (choice1 === 'wood') 
            gameState.players[playerID].resources.wood += 1;
        else if (choice1 === 'brick') 
            gameState.players[playerID].resources.brick += 1;
        else if (choice1 === 'ore') 
            gameState.players[playerID].resources.ore += 1;

        if (choice2 === 'wheat') 
            gameState.players[playerID].resources.wheat += 1;
        else if (choice2 === 'sheep') 
            gameState.players[playerID].resources.sheep += 1;
        else if (choice2 === 'wood') 
            gameState.players[playerID].resources.wood += 1;
        else if (choice2 === 'brick') 
            gameState.players[playerID].resources.brick += 1;
        else if (choice2 === 'ore') 
            gameState.players[playerID].resources.ore += 1; 
    }
}

const playMonopoly = ({gameState, playerID}, choice) => {
    if (gameState.players[playerID].developmentCards.monopoly > 0) {

        gameState.players[playerID].developmentCards.monopoly -= 1;
        gameState.players[playerID].canPlayCard = false;
        
        let numResource = 0;
        

        if (choice === 'wheat') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.wheat;
                gameState.players[i].resources.wheat = 0;
            }

            gameState.players[playerID].resources.wheat = numResource;
        }
        else if (choice === 'sheep') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.sheep;
                gameState.players[i].resources.sheep = 0;
            }

            gameState.players[playerID].resources.sheep = numResource;
        }
        else if (choice === 'wood') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.wood;
                gameState.players[i].resources.wood = 0;
            }

            gameState.players[playerID].resources.wood = numResource;
        }
        else if (choice === 'brick') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.brick;
                gameState.players[i].resources.brick = 0;
            }

            gameState.players[playerID].resources.brick = numResource;
        }
        else if (choice === 'ore') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.ore;
                gameState.players[i].resources.ore = 0;
            }

            gameState.players[playerID].resources.ore = numResource;
        }
    }
}

const resetDevPlays = ({gameState, ctx}) => {
    gameState.players[ctx.currentPlayer].canPlayCard = true;
}

const setHexMap = ({gameState, ctx}, h) => {
    h.map((hex) => (
        hexes.set("q: " + hex.props.q + ", r: " + hex.props.r + ", s: " + hex.props.s, hex)
    ))
}

export const checkLongestRoad = ({gameState, ctx}, longestNum, prevWinner) => {
    // get player roads from map
    const playerRoads = gameState.players[ctx.currentPlayer].roads.map((r) => (
        boardRoads.get(r)
    ))
    let longestPlayerRoad = longestRoad(playerRoads, hexes);

    if (longestPlayerRoad > longestNum) {
        if (prevWinner != undefined) {
            gameState.players[prevWinner].longestRoad = false;
            gameState.players[prevWinner].score -= 1;
        }
        gameState.players[ctx.currentPlayer].longestRoad = true;
        gameState.longestRoad = longestPlayerRoad;
        gameState.players[ctx.currentPlayer].score += 1;
    }
}

export const settlersOffKatan = numPlayers => ({
    setup: () => ({
        deck: {
            knight: 14,
            victory: 5,
            monopoly: 2,
            road: 2,
            plenty: 2
        },
        players: Array(numPlayers).fill().map( () => ({
            score: 0,
            color: "black",
            resources: {
                wheat: 0,
                sheep: 0,
                wood: 0,
                brick: 0,
                ore: 0
            },
            developmentCards: {
                knight: 0,
                victory: 0,
                monopoly: 0,
                road: 0,
                plenty: 0
            },
            diceRoll: 0,
            longestRoad: false,
            canBuildSettlement: false,
            canBuildRoad: false,
            canBuyCard: false,
            canPlayCard: true,
            startOfTurn: false,
            settlements: [],
            cities: [],
            roads: [],
            cards: []
        })),
        currentPlayer: 0,
        turn: 0,
        currentRoll:0,
        phase: 'initRound1',
        winner: 0,
        gameOver: false,
        longestRoad: 4
    }),

    turn: {
        onBegin: resetDevPlays
    },

    phases: {
        initRound1: {
          moves: { addSettlement, addRoad, addInitialResources, setPlayerColors, setHexMap },
          start: true,
          next: 'initRound2',
          turn: { order: TurnOrder.ONCE },
        },
        initRound2: {
            moves: { addSettlement, addRoad },
            turn: { 
                order: {
                    // reverse turn order for phase 2 (putting settements down)
                    first: ({ gameState, ctx }) => 0,
                    next: ({ gameState, ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    // Override the initial value of playOrder, called at the beginning of phase
                    playOrder: ({ gameState, ctx }) => [...ctx.playOrder].reverse(),
                  }
            },
            endIf: ({ ctx, gameState }) => (ctx.turn > (gameState.players.length * 2)),
        }
    },
    turn: {order: TurnOrder.RESET},
    moves: {
        rollDice,
        addDevelopmentResources,
        drawDevelopmentCard,
        playVictoryCard,
        playMonopoly,
        playYearOfPlenty,
        addRoad,
        addSettlement,
        upgradeSettlement,
        addInitialResources,
        checkLongestRoad
    }
});

