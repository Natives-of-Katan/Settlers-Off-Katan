
import { vertexAvailable, edgeAvailable, vertexConnectsRoad, edgeConnectsProperty } from "./boardUtils";

const tileResource = ["wheat", "wheat", "wheat", "wheat", "sheep", "sheep", 
                          "wood", "sheep", "wood", "desert", "wood", "wood", 
                          "brick", "brick", "brick", "ore", "ore", "ore", "sheep"];
const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];

// hexes are populated once when game is rendered
let hexes = new Map();

const rollDice = ({G, ctx, playerID}) => {
    const d1 = 1+Math.floor(Math.random() *6);
    const d2 = 1+Math.floor(Math.random() *6);
    G.players[playerID].diceRoll = d1+d2; 

    tileNums.forEach((num, index) => {
        if(d1+d2 === num && d1+d2!==7) {
            const resource = tileResource[index];
            G.players[playerID].resources[resource] +=1;
        }
    });
}

const setPlayerColors = ({G}) => {
    const colors = ["gold", "blue", "violet", "brown"];
    for (let i = 0; i < G.players.length; i++) {
        G.players[i].color = colors[i];
    }
}

const addSettlement = ({G, playerID, ctx}, vertex, i, vertices) => {
    const newVertex = {...vertex}
    const newProps = {...newVertex.props}
    // check if the vertex is taken
    if (vertexAvailable(vertex, hexes)) {
        if (firstSettlement(G, ctx, playerID) || (ctx.turn > G.players.length && 
            vertexConnectsRoad(vertex, hexes, G.players[playerID].color))) {  
            newProps.type = 'settlement';
            newProps.user = G.players[playerID].color;
            newProps.classes = 'active';
            newVertex.props = newProps
            vertices = vertices[i][vertices[i].indexOf(vertex)] = newVertex;
            G.players[playerID].settlements.push(vertex.id);
            G.players[playerID].resources.wood =  G.players[playerID].resources.wood - 1;
            G.players[playerID].resources.brick =  G.players[playerID].resources.brick - 1;
    }   }   
}

const upgradeSettlement = ({G, playerID}, vertex, i, vertices) => {
    if (vertex.props.stroke == G.players[playerID].user ) {
        const newVertex = {...vertex}
        const newProps = {...newVertex.props}
        newProps.type = 'city';
        newVertex.props = newProps;
        // add to cities list, remove from settlements
        G.players[playerID].cities.push(vertex.id);
        G.players[playerID].settlements = G.players[playerID].settlements.filter(function(item) {
            return item !== vertex.id
        })
        // update board state and resources
        vertices = vertices[i][vertices[i].indexOf(vertex)] = newVertex;
        G.players[playerID].resources.wood =  G.players[playerID].resources.wheat - 2;
        G.players[playerID].resources.brick =  G.players[playerID].resources.brick - 3;
    }
}

const firstSettlement = (G, ctx, playerID) => {
    return (ctx.turn <= G.players.length && 
    G.players[playerID].settlements.length == 0)
}

const firstRoad = (G, ctx, playerID) => {
    return (ctx.turn <= G.players.length && 
    G.players[playerID].settlements.length == 1
    && G.players[playerID].roads.length == 0)
}

const addRoad = ({G, playerID, ctx}, edge, i, edges) => {
    const newEdge = {...edge}
    const newProps = {...newEdge.props}
    // if edge is available
    if (edgeAvailable(edge, hexes)) {
        if (firstRoad(G, ctx, playerID) || (ctx.turn > G.players.length 
        && edgeConnectsProperty(edge, hexes, G.players[playerID].color))) {
            newProps.stroke =  G.players[playerID].color;
            newProps.classes = newProps.classes + "active";
            newEdge.props = newProps;
            edges = edges[i][edges[i].indexOf(edge)] = newEdge;
            G.players[playerID].settlements.push(edge.id);
            G.players[playerID].resources.wood =  G.players[playerID].resources.wood - 1;
            G.players[playerID].resources.brick =  G.players[playerID].resources.brick - 1;
            G.players[playerID].resources.sheep =  G.players[playerID].resources.sheep - 1;
            G.players[playerID].resources.wheat =  G.players[playerID].resources.wheat - 1;
        }
    }
}

const addDevelopmentResources = ({G, playerID}) => {
    G.players[playerID].resources.sheep += 1;
    G.players[playerID].resources.wheat += 1;
    G.players[playerID].resources.ore += 1;
    G.players[playerID].resources.brick += 1;
    G.players[playerID].resources.wood += 1;
    G.players[playerID].developmentCards.knight += 1;
    G.players[playerID].developmentCards.victory += 1;
    G.players[playerID].developmentCards.monopoly += 1;
    G.players[playerID].developmentCards.road += 1;
    G.players[playerID].developmentCards.plenty += 1;
}

const drawDevelopmentCard = ({G, playerID}) => {
    //Checks if the player has the required resources and that the deck has at least 1 card in it
    if (G.players[playerID].resources.sheep > 0 && G.players[playerID].resources.wheat > 0 && G.players[playerID].resources.ore > 0 && G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty+G.deck.road > 0) {
        
        //Determines what card will be drawn
        const drawnCard = 1+Math.floor(Math.random() * (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty+G.deck.road));
        
        //Subtracts the resources from the player
        G.players[playerID].resources.sheep -= 1;
        G.players[playerID].resources.wheat -= 1;
        G.players[playerID].resources.ore -= 1;
        
        //Adds card to player's hand and removes it from the deck
        if (drawnCard <= G.deck.knight) {
            G.players[playerID].developmentCards.knight += 1;
            G.deck.knight -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory)) {
            G.players[playerID].developmentCards.victory += 1;
            G.deck.victory -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly)) {
            G.players[playerID].developmentCards.monopoly += 1;
            G.deck.monopoly -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty)) {
            G.players[playerID].developmentCards.plenty += 1;
            G.deck.plenty -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty+G.deck.road)) {
            G.players[playerID].developmentCards.road += 1;
            G.deck.road -= 1;
        }
    }
}

const playVictoryCard = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.victory > 0) {
        G.players[playerID].developmentCards.victory -= 1;
        G.players[playerID].score += 1;
        G.players[playerID].canPlayCard = false;
    }
}

const playYearOfPlenty = ({G , playerID}, choice1, choice2) => {
    if (G.players[playerID].developmentCards.plenty > 0) {

        G.players[playerID].developmentCards.plenty -=1;
        G.players[playerID].canPlayCard = false;

        if (choice1 === 'wheat') 
            G.players[playerID].resources.wheat += 1;
        else if (choice1 === 'sheep') 
            G.players[playerID].resources.sheep += 1;
        else if (choice1 === 'wood') 
            G.players[playerID].resources.wood += 1;
        else if (choice1 === 'brick') 
            G.players[playerID].resources.brick += 1;
        else if (choice1 === 'ore') 
            G.players[playerID].resources.ore += 1;

        if (choice2 === 'wheat') 
            G.players[playerID].resources.wheat += 1;
        else if (choice2 === 'sheep') 
            G.players[playerID].resources.sheep += 1;
        else if (choice2 === 'wood') 
            G.players[playerID].resources.wood += 1;
        else if (choice2 === 'brick') 
            G.players[playerID].resources.brick += 1;
        else if (choice2 === 'ore') 
            G.players[playerID].resources.ore += 1; 
    }
}

const playMonopoly = ({G, playerID}, choice) => {
    if (G.players[playerID].developmentCards.monopoly > 0) {

        G.players[playerID].developmentCards.monopoly -= 1;
        G.players[playerID].canPlayCard = false;
        
        let numResource = 0;
        

        if (choice === 'wheat') {
            for (let i = 0; i < G.players.length; i++) {
                numResource += G.players[i].resources.wheat;
                G.players[i].resources.wheat = 0;
            }

            G.players[playerID].resources.wheat = numResource;
        }
        else if (choice === 'sheep') {
            for (let i = 0; i < G.players.length; i++) {
                numResource += G.players[i].resources.sheep;
                G.players[i].resources.sheep = 0;
            }

            G.players[playerID].resources.sheep = numResource;
        }
        else if (choice === 'wood') {
            for (let i = 0; i < G.players.length; i++) {
                numResource += G.players[i].resources.wood;
                G.players[i].resources.wood = 0;
            }

            G.players[playerID].resources.wood = numResource;
        }
        else if (choice === 'brick') {
            for (let i = 0; i < G.players.length; i++) {
                numResource += G.players[i].resources.brick;
                G.players[i].resources.brick = 0;
            }

            G.players[playerID].resources.brick = numResource;
        }
        else if (choice === 'ore') {
            for (let i = 0; i < G.players.length; i++) {
                numResource += G.players[i].resources.ore;
                G.players[i].resources.ore = 0;
            }

            G.players[playerID].resources.ore = numResource;
        }
    }
}

const resetDevPlays = ({G, ctx}) => {
    G.players[ctx.currentPlayer].canPlayCard = true;
}

const setHexes = ({G, ctx}, h) => {
    h.map((hex) => (
        hexes.set("q: " + hex.props.q + ", r: " + hex.props.r + ", s: " + hex.props.s, hex)
    ))
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
        currentRoll:0
    }),

    turn: {
        onBegin: resetDevPlays
    },

    moves: {
        rollDice,
        addDevelopmentResources,
        drawDevelopmentCard,
        playVictoryCard,
        playMonopoly,
        playYearOfPlenty,
        addRoad,
        addSettlement,
        setPlayerColors,
        setHexes,
        upgradeSettlement
    }
});

