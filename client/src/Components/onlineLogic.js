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

export const rollDice = (gameState) => {
    
    const d1 = 1+Math.floor(Math.random() *6);
    const d2 = 1+Math.floor(Math.random() *6);
    gameState.currentRoll = d1+d2; 

    if ( gameState.currentRoll !== 7) {
        // settlements and cities get different resources
        gameState = addInitialResources(gameState, d1+d2, 'settlements');
        gameState = addInitialResources(gameState, d1+d2, 'cities');
    }

    return gameState;
} 


export const addInitialResources = (gameState, diceNum, property) => {

    gameState.players.forEach((player) => {
        
        let playerProperties = property == 'settlements' ? player.settlements : player.cities;
        let settlementHexes = playerProperties.map((v) => {

            return [gameState.hexes.get(getHexKey(gameState.boardVertices.get(v).props.hexes[0])),
            gameState.hexes.get(getHexKey(gameState.boardVertices.get(v).props.hexes[1])),
            gameState.hexes.get(getHexKey(gameState.boardVertices.get(v).props.hexes[2]))];
        });

        // add resources if the hex is rolled
        settlementHexes.forEach((sHexes) => { sHexes.forEach((hex) => {
            if (hex != undefined && (diceNum == 0 || diceNum == hex.props.number) && hex.props.fill != 'desert')
                player.resources[hex.props.fill] += (property == 'settlements' ? 1 : 2);
            });
        });
    })

    return gameState;
}

export const setPlayerColors = (gameState) => {
    const newState = { ...gameState };
    const colors = ["gold", "blue", "violet", "brown"];
    for (let i = 0; i < newState.players.length; i++) {
        newState.players[i] = {...newState.players[i], color: colors[i]};
    }
    return newState;
}

export const addSettlement = (gameState, vertex, i, vertices) => {
    const newVertex = {...vertex}
    console.log(vertex)
    const newProps = {...newVertex.props}
    console.log(firstSettlements(gameState))
    console.log(vertexAvailable(vertex, gameState.hexes) && (!firstSettlements(gameState)))
    // check if the vertex is taken

    if (firstSettlements(gameState) && (vertexAvailable(vertex, gameState.hexes)) || (vertexAvailable(vertex, gameState.hexes) &&
         vertexConnectsRoad(vertex, gameState.hexes, gameState.players[gameState.currentPlayer].color)))
    {
        if (!firstSettlements(gameState)) {
            gameState.players[gameState.currentPlayer].resources.wood -=1;
            gameState.players[gameState.currentPlayer].resources.sheep -= 1;
            gameState.players[gameState.currentPlayer].resources.wheat -= 1;
            gameState.players[gameState.currentPlayer].resources.brick -= 1;
        }
        newProps.type = 'settlement';
        newProps.user = gameState.players[gameState.currentPlayer].color;
        newProps.classes = 'active';
        newVertex.props = newProps
        vertices[i][vertices[i].indexOf(vertex)] = newVertex;
        gameState.boardVertices.set(vertex.props.id, newVertex)
        gameState.players[gameState.currentPlayer].score += 1;
        gameState.players[gameState.currentPlayer].settlements.push(newVertex.props.id);
    }
    else {
        newProps.displayTooltip="block";
        newVertex.props = newProps;
        vertices[i][vertices[i].indexOf(vertex)] = newVertex;
    }   
    return [gameState, vertices]
}

export const upgradeToCity = (gameState, vertex, i, vertices) => {
    if (vertex.props.user == gameState.players[gameState.currentPlayer].color ) {
        const newVertex = {...vertex}
        const newProps = {...newVertex.props}
        newProps.type = 'city';
        newVertex.props = newProps;

        // add to cities list, remove from settlements
        gameState.players[gameState.currentPlayer].cities.push(vertex.props.id);
        gameState.boardVertices.set(vertex.props.id, newVertex)
        gameState.players[gameState.currentPlayer].settlements = gameState.players[gameState.currentPlayer].settlements.filter(function(item) {
            return item !== vertex.props.id
        })
        // update board state and resources
        vertices[i][vertices[i].indexOf(vertex)] = newVertex;
        gameState.players[gameState.currentPlayer].resources.wheat -= 2;
        gameState.players[gameState.currentPlayer].resources.ore -= 3;
        gameState.players[gameState.currentPlayer].score += 1;
    }
    return [gameState, vertices];
}

const firstSettlements = (gameState) => {
    if(gameState.phase =='initRound1' || gameState.phase == 'initRound2') {
        if(gameState.players[gameState.currentPlayer].settlements.length < 2)
            return true;
    }
    return false;
}

const firstRoads = (gameState, e, color) => { 
    if(gameState.phase == 'initRound1' || gameState.phase == 'initRound2') {
        if(gameState.players[gameState.currentPlayer].roads.length < 2)
            return true;
    }
    return false;
}

export const addRoad = (gameState, edge, i, edges) => {
    // new properties
    const newEdge = {...edge}
    const newProps = {...newEdge.props}
    newProps.stroke =  gameState.players[gameState.currentPlayer].color;
    newProps.classes = newProps.classes + "active";
    newEdge.props = newProps;

    // if edge is available
    const firstRounds = firstRoads(gameState, edge, gameState.players[gameState.currentPlayer].color);
    if (edgeAvailable(edge, gameState.hexes) && (firstRounds || (gameState.turn > gameState.players.length * 2 && 
        edgeConnectsProperty(edge, gameState.hexes, gameState.players[gameState.currentPlayer].color)))) {
        edges[i][edges[i].indexOf(edge)] = newEdge;
        if (!firstRounds) {
            gameState.players[gameState.currentPlayer].resources.wood -= 1;
            gameState.players[gameState.currentPlayer].resources.brick -= 1;
        }
        gameState.players[gameState.currentPlayer].roads.push(newEdge.props.id);
        gameState.boardRoads.set(newEdge.props.id, newEdge)
    }
    return [gameState, edges];
}

export const addDevelopmentResources = (gameState) => {
    gameState.players[gameState.currentPlayer].resources.sheep += 1;
    gameState.players[gameState.currentPlayer].resources.wheat += 1;
    gameState.players[gameState.currentPlayer].resources.ore += 1;
    gameState.players[gameState.currentPlayer].resources.brick += 1;
    gameState.players[gameState.currentPlayer].resources.wood += 1;
    gameState.players[gameState.currentPlayer].developmentCards.knight += 1;
    gameState.players[gameState.currentPlayer].developmentCards.victory += 1;
    gameState.players[gameState.currentPlayer].developmentCards.monopoly += 1;
    gameState.players[gameState.currentPlayer].developmentCards.road += 1;
    gameState.players[gameState.currentPlayer].developmentCards.plenty += 1;
    return gameState;
}

export const drawDevelopmentCard = (gameState) => {
    const current = gameState.currentPlayer;
    //Checks if the player has the required resources and that the deck has at least 1 card in it
    if (gameState.players[current].resources.sheep > 0 && gameState.players[current].resources.wheat > 0 && gameState.players[current].resources.ore > 0 && gameState.deck.knight + gameState.deck.victory + gameState.deck.monopoly + gameState.deck.plenty + gameState.deck.road > 0) {
        
        //Determines what card will be drawn
        const drawnCard = 1+Math.floor(Math.random() * (gameState.deck.knight+gameState.deck.victory+gameState.deck.monopoly+gameState.deck.plenty+gameState.deck.road));
        
        //Subtracts the resources from the player
        gameState.players[current].resources.sheep -= 1;
        gameState.players[current].resources.wheat -= 1;
        gameState.players[current].resources.ore -= 1;
        
        //Adds card to player's hand and removes it from the deck
        if (drawnCard <= gameState.deck.knight) {
            gameState.players[current].developmentCards.knight += 1;
            gameState.deck.knight -= 1;
        }
        else if (drawnCard <= (gameState.deck.knight+gameState.deck.victory)) {
            gameState.players[current].developmentCards.victory += 1;
            gameState.deck.victory -= 1;
        }
        else if (drawnCard <= (gameState.deck.knight+gameState.deck.victory+gameState.deck.monopoly)) {
            gameState.players[current].developmentCards.monopoly += 1;
            gameState.deck.monopoly -= 1;
        }
        else if (drawnCard <= (gameState.deck.knight+gameState.deck.victory+gameState.deck.monopoly+gameState.deck.plenty)) {
            gameState.players[current].developmentCards.plenty += 1;
            gameState.deck.plenty -= 1;
        }
        else if (drawnCard <= (gameState.deck.knight + gameState.deck.victory + gameState.deck.monopoly + gameState.deck.plenty + gameState.deck.road)) {
            gameState.players[current].developmentCards.road += 1;
            gameState.deck.road -= 1;
        }
    }
    return gameState;
}

export const playVictoryCard = (gameState) => {
    const current = gameState.currentPlayer;
    if (gameState.players[current].developmentCards.victory > 0) {
        gameState.players[current].developmentCards.victory -= 1;
        gameState.players[current].score += 1;
        gameState.players[current].canPlayCard = false;
    }
    return gameState;
}

export const playYearOfPlenty = (gameState, choice1, choice2) => {
    const current = gameState.currentPlayer;
    if (gameState.players[current].developmentCards.plenty > 0) {

        gameState.players[current].developmentCards.plenty -=1;
        gameState.players[current].canPlayCard = false;

        if (choice1 === 'wheat') 
            gameState.players[current].resources.wheat += 1;
        else if (choice1 === 'sheep') 
            gameState.players[current].resources.sheep += 1;
        else if (choice1 === 'wood') 
            gameState.players[current].resources.wood += 1;
        else if (choice1 === 'brick') 
            gameState.players[current].resources.brick += 1;
        else if (choice1 === 'ore') 
            gameState.players[current].resources.ore += 1;

        if (choice2 === 'wheat') 
            gameState.players[current].resources.wheat += 1;
        else if (choice2 === 'sheep') 
            gameState.players[current].resources.sheep += 1;
        else if (choice2 === 'wood') 
            gameState.players[current].resources.wood += 1;
        else if (choice2 === 'brick') 
            gameState.players[current].resources.brick += 1;
        else if (choice2 === 'ore') 
            gameState.players[current].resources.ore += 1; 
    }
    return gameState;
}

export const playMonopoly = (gameState, choice) => {
    const current = gameState.currentPlayer;
    if (gameState.players[current].developmentCards.monopoly > 0) {

        gameState.players[current].developmentCards.monopoly -= 1;
        gameState.players[current].canPlayCard = false;
        
        let numResource = 0;
        

        if (choice === 'wheat') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.wheat;
                gameState.players[i].resources.wheat = 0;
            }

            gameState.players[current].resources.wheat = numResource;
        }
        else if (choice === 'sheep') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.sheep;
                gameState.players[i].resources.sheep = 0;
            }

            gameState.players[current].resources.sheep = numResource;
        }
        else if (choice === 'wood') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.wood;
                gameState.players[i].resources.wood = 0;
            }

            gameState.players[current].resources.wood = numResource;
        }
        else if (choice === 'brick') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.brick;
                gameState.players[i].resources.brick = 0;
            }

            gameState.players[current].resources.brick = numResource;
        }
        else if (choice === 'ore') {
            for (let i = 0; i < gameState.players.length; i++) {
                numResource += gameState.players[i].resources.ore;
                gameState.players[i].resources.ore = 0;
            }

            gameState.players[current].resources.ore = numResource;
        }
    }
    return gameState;
}

const resetDevPlays = (gameState) => {
    gameState.players[gameState.currentPlayer].canPlayCard = true;
}

export const setHexMap = (h, gameState) => {
    h.map((hex) => (
        gameState.hexes.set("q: " + hex.props.q + ", r: " + hex.props.r + ", s: " + hex.props.s, hex)
    ))
    return gameState;
}

export const checkLongestRoad = (gameState, longestNum, prevWinner) => {
    // get player roads from map
    const playerRoads = gameState.players[gameState.currentPlayer].roads.map((r) => (
        gameState.boardRoads.get(r)
    ))
    let longestPlayerRoad = longestRoad(playerRoads, gameState.hexes);

    if (longestPlayerRoad > longestNum) {
        if (prevWinner != undefined) {
            gameState.players[prevWinner].longestRoad = false;
            gameState.players[prevWinner].score -= 1;
        }
        gameState.players[gameState.currentPlayer].longestRoad = true;
        gameState.longestRoad = longestPlayerRoad;
        gameState.players[gameState.currentPlayer].score += 1;
    }
    return gameState;
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
        upgradeToCity,
        addInitialResources,
        checkLongestRoad
    }
});

