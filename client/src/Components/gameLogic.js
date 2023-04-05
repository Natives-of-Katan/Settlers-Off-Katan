
import { vertexAvailable, edgeAvailable } from "./boardUtils";

const tileResource = ["wheat", "wood", "brick", "wheat", "wood", "ore", 
                          "wheat", "ore", "brick", "desert", "wheat", "sheep", 
                          "sheep", "sheep", "wood", "sheep", "wood", "brick", "ore"];


// hexes are populated once when game is rendered
let hexes = new Map();

const rollDice = ({G, playerID, ctx}, d1, d2) => {
    console.log(G.tileNums);
    G.players[playerID].diceRoll = d1+d2;  

    G.tileNums.forEach((num, index) => {
        console.log("rollDice2");
        if(d1+d2 === num && d1+d2!==7) {
            console.log("rollDice3");
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
        if (ctx.turn <= G.players.length || ctx.turn > G.players.length && vertexConnectsRoad()) {   
            newProps.type = 'city';
            newProps.user = G.players[playerID].color;
            newProps.classes = 'active';
            newVertex.props = newProps
            vertices = vertices[i][vertices[i].indexOf(vertex)] = newVertex;
            G.players[playerID].settlements.push(vertex.id);
            G.players[playerID].resources.wood =  G.players[playerID].resources.wood - 1;
            G.players[playerID].resources.brick =  G.players[playerID].resources.brick - 1;
    }
}
}

const vertexConnectsRoad = (v) => {
    // map vertex number to road nums (before and after)
}

const addRoad = ({G, playerID, ctx}, edge, i, edges) => {
    const newEdge = {...edge}
    const newProps = {...newEdge.props}
    // if edge is available
    if (ctx.turn <= G.players.length && edgeAvailable(edge, hexes)) {
        newProps.stroke =  G.players[playerID].color;
        newProps.classes = newProps.classes + "active";
        newEdge.props = newProps;
        edges = edges[i][edges[i].indexOf(edge)] = newEdge;
        G.players[playerID].settlements.push(edge.id);
        G.players[playerID].resources.wood =  G.players[playerID].resources.wood - 1;
        G.players[playerID].resources.brick =  G.players[playerID].resources.brick - 1;
        G.players[playerID].resources.lumber =  G.players[playerID].resources.lumber - 1;
        G.players[playerID].resources.wheat =  G.players[playerID].resources.wheat - 1;
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

const setTileNums = ({G, ctx}, nums) => {
    G.tileNums = nums;
}

/*
const stealResource =  ({G, playerID, ctx}, num) => {
    const targetTotalResources = G.players[num].resources.wheat + G.players[num].resources.sheep + G.players[num].resources.wood + G.players[num].resources.brick + G.players[num].resources.ore;

    if (targetTotalResources > 0) {
        const resourceStolen = 1+Math.floor(Math.random()*targetTotalResources);

        if (resourceStolen <= G.players[num].resources.wheat) {
            G.players[num].resources.wheat -= 1;
            G.players[playerID].resources.wheat += 1;
        }
        else if (resourceStolen <= G.players[num].resources.sheep + G.players[num].resources.wheat) {
            G.players[num].resources.sheep -= 1;
            G.players[playerID].resources.sheep += 1;
        }
        else if (resourceStolen <= G.players[num].resources.wood + G.players[num].resources.sheep + G.players[num].resources.wheat) {
            G.players[num].resources.wood -= 1;
            G.players[playerID].resources.wood += 1;
        }
        else if (resourceStolen <= G.players[num].resources.brick + G.players[num].resources.wood + G.players[num].resources.sheep + G.players[num].resources.wheat) {
            G.players[num].resources.brick -= 1;
            G.players[playerID].resources.brick += 1;
        }
        else if (resourceStolen <= G.players[num].resources.ore + G.players[num].resources.brick + G.players[num].resources.wood + G.players[num].resources.sheep + G.players[num].resources.wheat) {
            G.players[num].resources.ore -= 1;
            G.players[playerID].resources.ore += 1;
        }   
    }
} */


export const settlersOffKatan = numPlayers => ({
    setup: () => ({
        tileNums: [9, 8, 5, 12, 11, 3, 6, 10, 6, "Robber", 4, 11, 2, 4, 3, 5, 9, 10, 8],
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
            roads: [],
            cards: []
        })),
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
        setTileNums
        //stealResource
    }
});

