
import { vertexAvailable, edgeAvailable } from "./boardUtils";

const tileResource = ["grain", "grain", "grain", "grain", "pasture", "pasture", 
                          "forest", "pasture", "forest", "desert", "forest", "forest", 
                          "hill", "hill", "hill", "mountain", "mountain", "mountain", "pasture"];
const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];

// hexes are populated once when game is rendered
let hexes = new Map();

const rollDice = ({G, playerID, ctx}) => {
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

const addSettlement = ({G, playerID}, vertex, i, vertices) => {
    const newVertex = {...vertex}
    const newProps = {...newVertex.props}
    // check if the vertex is taken
    if (vertexAvailable(vertex, hexes)) {
        newProps.type = 'city';
        newProps.user = G.players[playerID].color;
        newProps.classes = 'active';
        newVertex.props = newProps
        vertices = vertices[i][vertices[i].indexOf(vertex)] = newVertex;
        G.players[playerID].settlements.push(vertex.id);
    }
}



const addRoad = ({G, playerID}, edge, i, edges) => {
    const newEdge = {...edge}
    const newProps = {...newEdge.props}
    // if edge is available
    if (edgeAvailable(edge, hexes)) {
        newProps.stroke =  G.players[playerID].color;
        newProps.classes = newProps.classes + "active";
        newEdge.props = newProps;
        edges = edges[i][edges[i].indexOf(edge)] = newEdge;
        G.players[playerID].settlements.push(edge.id);
    }
}

const addDevelopmentResources = ({G, playerID}) => {
    G.players[playerID].resources.pasture += 1;
    G.players[playerID].resources.grain += 1;
    G.players[playerID].resources.mountain += 1;
    G.players[playerID].resources.hill += 1;
    G.players[playerID].resources.forest += 1;
    G.players[playerID].developmentCards.knight += 1;
    G.players[playerID].developmentCards.victory += 1;
    G.players[playerID].developmentCards.monopoly += 1;
    G.players[playerID].developmentCards.road += 1;
    G.players[playerID].developmentCards.plenty += 1;
}

const plentyChoiceOneGrain = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0)
        G.players[playerID].resources.grain += 1;
}

const plentyChoiceOnePasture = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0)
        G.players[playerID].resources.pasture += 1;
}

const plentyChoiceOneForest = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0)
        G.players[playerID].resources.forest += 1;
}
const plentyChoiceOneHill = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0)
        G.players[playerID].resources.hill += 1;
}
const plentyChoiceOneMountain = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0)
        G.players[playerID].resources.mountain += 1;
}

const plentyChoiceTwoGrain = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.grain += 1;
        G.players[playerID].developmentCards.plenty -= 1;
        G.players[playerID].canPlayCard = false;
    }
}
const plentyChoiceTwoPasture = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.pasture += 1;
        G.players[playerID].developmentCards.plenty -= 1;
        G.players[playerID].canPlayCard = false;
    }
}
const plentyChoiceTwoForest = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.forest += 1;
        G.players[playerID].developmentCards.plenty -= 1;
        G.players[playerID].canPlayCard = false;
    }
}
const plentyChoiceTwoHill = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.hill += 1;
        G.players[playerID].developmentCards.plenty -= 1;
        G.players[playerID].canPlayCard = false;
    }
}
const plentyChoiceTwoMountain = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.mountain += 1;
        G.players[playerID].developmentCards.plenty -= 1;
        G.players[playerID].canPlayCard = false;
    }
}

const drawDevelopmentCard = ({G, playerID}) => {
    //Checks if the player has the required resources and that the deck has at least 1 card in it
    if (G.players[playerID].resources.pasture > 0 && G.players[playerID].resources.grain > 0 && G.players[playerID].resources.mountain > 0 && G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty+G.deck.road > 0) {
        
        //Determines what card will be drawn
        const drawnCard = 1+Math.floor(Math.random() * (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty+G.deck.road));
        
        //Subtracts the resources from the player
        G.players[playerID].resources.pasture -= 1;
        G.players[playerID].resources.grain -= 1;
        G.players[playerID].resources.mountain -= 1;
        
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

const playMonopolyGrain = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.monopoly > 0) {
        G.players[playerID].developmentCards.monopoly -= 1;

        let numGrain = 0;

        for (let i = 0; i < G.players.length; i++) {
            numGrain += G.players[i].resources.grain;
            G.players[i].resources.grain = 0;
        }

        G.players[playerID].resources.grain = numGrain;
        G.players[playerID].canPlayCard = false;
    }
}

const playMonopolyPasture = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.monopoly > 0) {
        G.players[playerID].developmentCards.monopoly -= 1;

        let numPastures = 0;

        for (let i = 0; i < G.players.length; i++) {
            numPastures += G.players[i].resources.pasture;
            G.players[i].resources.pasture = 0;
        }

        G.players[playerID].resources.pasture = numPastures;
        G.players[playerID].canPlayCard = false;
    }
}

const playMonopolyForest = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.monopoly > 0) {
        G.players[playerID].developmentCards.monopoly -= 1;

        let numForests = 0;

        for (let i = 0; i < G.players.length; i++) {
            numForests += G.players[i].resources.forest;
            G.players[i].resources.forest = 0;
        }

        G.players[playerID].resources.forest = numForests;
        G.players[playerID].canPlayCard = false;
    }
}

const playMonopolyHill = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.monopoly > 0) {
        G.players[playerID].developmentCards.monopoly -= 1;

        let numHills = 0;

        for (let i = 0; i < G.players.length; i++) {
            numHills += G.players[i].resources.hill;
            G.players[i].resources.hill = 0;
        }

        G.players[playerID].resources.hill = numHills;
        G.players[playerID].canPlayCard = false;
    }
}

const playMonopolyMountain = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.monopoly > 0) {
        G.players[playerID].developmentCards.monopoly -= 1;

        let numMountains = 0;

        for (let i = 0; i < G.players.length; i++) {
            numMountains += G.players[i].resources.mountain;
            G.players[i].resources.mountain = 0;
        }

        G.players[playerID].resources.mountain = numMountains;
        G.players[playerID].canPlayCard = false;
    }
}


const checkBuildActions = ({G, ctx}) => {
    const currentPlayer = G.players[ctx.currentPlayer]
    let resources = currentPlayer.resources;
    const enoughResources = Object.values(resources).every(value => value >= 1);
    enoughResources ? currentPlayer.canBuildSettlement = true : currentPlayer.canBuildSettlement = false;

    if(currentPlayer.resources.forest >= 1 && currentPlayer.resources.hill >= 1)
        currentPlayer.canBuildRoad = true;

    if(currentPlayer.resources.pasture >= 1 && currentPlayer.resources.mountain >= 1 && currentPlayer.resources.grain > 1)
        currentPlayer.canBuyCard = true;
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
                grain: 0,
                pasture: 0,
                forest: 0,
                hill: 0,
                mountain: 0
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
            roads: [],
            cards: []
        })),
    }),

    turn: {
        onBegin: checkBuildActions,
        onBegin: resetDevPlays
    },

    moves: {
        rollDice,
        addDevelopmentResources,
        drawDevelopmentCard,
        playVictoryCard,
        playMonopolyGrain,
        playMonopolyPasture,
        playMonopolyForest,
        playMonopolyHill,
        playMonopolyMountain,
        plentyChoiceOneGrain,
        plentyChoiceOnePasture,
        plentyChoiceOneForest,
        plentyChoiceOneHill,
        plentyChoiceOneMountain,
        plentyChoiceTwoGrain,
        plentyChoiceTwoPasture,
        plentyChoiceTwoForest,
        plentyChoiceTwoHill,
        plentyChoiceTwoMountain,
        addRoad,
        addSettlement,
        setPlayerColors,
        setHexes
    }
});

