import { 
    vertexAvailable, 
    edgeAvailable, 
    vertexConnectsRoad, 
    edgeConnectsProperty, 
    initRoadPlacement, 
    getHexKey, 
    vertexUser,
    } from "./boardUtils";

import { longestRoad } from "./roadUtils";    
import { TurnOrder } from 'boardgame.io/core';
import { INVALID_MOVE } from 'boardgame.io/core';
import produce from 'immer';

const tileResource = ["wheat", "wood", "brick", "wheat", "wood", "ore", 
                          "wheat", "ore", "brick", "desert", "wheat", "sheep", 
                          "sheep", "sheep", "wood", "sheep", "wood", "brick", "ore"];


// holds hex information in map
let hexes = new Map();
let boardVertices = new Map();
let boardRoads = new Map();

const rollDice = ({G, playerID, ctx}, d1, d2) => {
    console.log(G.tileNums);
    G.players[playerID].diceRoll = d1+d2;  
    console.log(d1+d2);

    if (G.players[playerID].diceRoll !== 7) {
        // settlements and cities get different resources
        addInitialResources({G,ctx,playerID}, d1+d2, 'settlements')
        addInitialResources({G,ctx,playerID}, d1+d2, 'cities')
    }  
}

const addInitialResources = ({G, ctx, playerID}, diceNum, property) => {
    G.players.forEach((player) => {
        console.log(player);
        let playerProperties = property == 'settlements' ? player.settlements : player.cities;
        let settlementHexes = playerProperties.map((v) => { 
            // get array of adjacent hexes
            return [hexes.get(getHexKey(boardVertices.get(v).props.hexes[0])),
            hexes.get(getHexKey(boardVertices.get(v).props.hexes[1])),
            hexes.get(getHexKey(boardVertices.get(v).props.hexes[2]))];
        });
        // add resources if the hex is rolled
        settlementHexes.forEach((sHexes) => { sHexes.forEach((hex) => {
            if (hex != undefined && (diceNum == 0 || (diceNum == hex.props.number && G.robberIndex !== hex.props.numKey))) {
                console.log("key", hex.props.numKey);
                player.resources[hex.props.fill] += (property == 'settlements' ? 1 : 2);
            }
        });
        });        
    })
}

const setPlayerColors = ({G}) => {
    const colors = ["gold", "blue", "violet", "brown"];
    for (let i = 0; i < G.players.length; i++) {
        G.players[i].color = colors[i];
    }
}

const findUsers = ({G}, vertices) => {
    
    let usersOnHex = [];

    for (let i = 0; i < vertices.length; i++) {
        console.log("vertextUser " + vertexUser(vertices[i], hexes));
        usersOnHex[i] = vertexUser(vertices[i], hexes);
        console.log("usersOnHex " + usersOnHex[i]);
    }

    G.robberUsers = usersOnHex;
}


const addSettlement = ({G, playerID, ctx}, vertex, i, vertices) => {
    const newVertex = {...vertex}
    const newProps = {...newVertex.props}
    // check if the vertex is taken
    if (vertexAvailable(vertex, hexes) && (firstSettlements(G, ctx, playerID) || 
    (ctx.turn > G.players.length * 2 && vertexConnectsRoad(vertex, hexes, G.players[playerID].color)))) 
    {
        if (!firstSettlements(G, ctx, playerID)) {
            G.players[playerID].resources.wood -=1;
            G.players[playerID].resources.sheep -= 1;
            G.players[playerID].resources.wheat -= 1;
            G.players[playerID].resources.brick -= 1;
        }
        newProps.type = 'settlement';
        newProps.user = G.players[playerID].color;
        newProps.classes = 'active';
        newVertex.props = newProps;

        vertices[i][vertices[i].indexOf(vertex)] = newVertex;
        boardVertices.set(vertex.props.id, newVertex)
        G.players[playerID].score += 1;
        G.players[playerID].settlements.push(newVertex.props.id);
    }  
    else {
        newProps.displayTooltip="block";
        newVertex.props = newProps;
        vertices[i][vertices[i].indexOf(vertex)] = newVertex;
    }   
}

const upgradeSettlement = ({G, playerID}, vertex, i, vertices) => {
    if (vertex.props.stroke == G.players[playerID].color ) {
        const newVertex = {...vertex}
        const newProps = {...newVertex.props}
        newProps.type = 'city';
        newVertex.props = newProps;

        // add to cities list, remove from settlements
        G.players[playerID].cities.push(vertex.props.id);
        boardVertices.set(vertex.props.id, newVertex)
        G.players[playerID].settlements = G.players[playerID].settlements.filter(function(item) {
            return item !== vertex.props.id
        })
        // update board state and resources
        vertices = vertices[i][vertices[i].indexOf(vertex)] = newVertex;
        G.players[playerID].resources.wheat -= 2;
        G.players[playerID].resources.ore -= 3;
        G.players[playerID].score += 1;
    }
}

const firstSettlements = (G, ctx, playerID) => {
    return ((ctx.turn <= G.players.length && G.players[playerID].settlements.length == 0) 
        || (ctx.turn > G.players.length && G.players[playerID].settlements.length == 1 ))
}

const firstRoads = (G, ctx, playerID, e, hexes, color) => {
    if (initRoadPlacement(e, hexes, color))
        return ((ctx.phase == 'initRound1' && G.players[playerID].settlements.length == 1 
        && G.players[playerID].roads.length == 0) || ctx.phase == 'initRound2' 
        && G.players[playerID].roads.length == 1)
    return false;
}

const addRoad = ({G, playerID, ctx}, edge, i, edges, roadBuilding, secondRoad) => {
    // new properties
    const newEdge = {...edge}
    const newProps = {...newEdge.props}
    newProps.stroke =  G.players[playerID].color;
    newProps.classes = newProps.classes + "active";
    newEdge.props = newProps;
    // if edge is available
    const firstRounds = firstRoads(G, ctx, playerID, edge, hexes, G.players[playerID].color);
    if (edgeAvailable(edge, hexes) && (firstRounds || (ctx.turn > G.players.length * 2 && 
        edgeConnectsProperty(edge, hexes, G.players[playerID].color)))) {
        edges = edges[i][edges[i].indexOf(edge)] = newEdge;
        if (!firstRounds && !roadBuilding) {
            G.players[playerID].resources.wood -= 1;
            G.players[playerID].resources.brick -= 1;
        }
        
        G.players[playerID].totalRoads++;
        G.players[playerID].roads.push(newEdge.props.id);
        boardRoads.set(newEdge.props.id, newEdge)

        if (roadBuilding && secondRoad) {
            G.players[playerID].developmentCards.road -= 1;
            G.players[playerID].canPlayCard = false;
        }
    }
}


const addDevelopmentResources = ({G, playerID}) => {
    G.players[playerID].resources.sheep += 1;
    G.players[playerID].resources.wheat += 1;
    G.players[playerID].resources.ore += 1;
    G.players[playerID].resources.brick += 1;
    G.players[playerID].resources.wood += 1;
    /*
    G.players[playerID].developmentCards.knight += 1;
    G.players[playerID].developmentCards.victory += 1;
    G.players[playerID].developmentCards.monopoly += 1;
    G.players[playerID].developmentCards.road += 1;
    G.players[playerID].developmentCards.plenty += 1;
    */
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
            G.players[playerID].newDevelopmentCards.knight += 1;
            G.deck.knight -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory)) {
            G.players[playerID].developmentCards.victory += 1;
            G.deck.victory -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly)) {
            G.players[playerID].newDevelopmentCards.monopoly += 1;
            G.deck.monopoly -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty)) {
            G.players[playerID].newDevelopmentCards.plenty += 1;
            G.deck.plenty -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty+G.deck.road)) {
            G.players[playerID].newDevelopmentCards.road += 1;
            G.deck.road -= 1;
        }
    }
}

const updateDevelopmentCards = ({G, playerID}) => {
    G.players[playerID].developmentCards.knight += G.players[playerID].newDevelopmentCards.knight;
    G.players[playerID].newDevelopmentCards.knight = 0;

    G.players[playerID].developmentCards.monopoly += G.players[playerID].newDevelopmentCards.monopoly;
    G.players[playerID].newDevelopmentCards.monopoly = 0;

    G.players[playerID].developmentCards.plenty += G.players[playerID].newDevelopmentCards.plenty;
    G.players[playerID].newDevelopmentCards.plenty = 0;

    G.players[playerID].developmentCards.road += G.players[playerID].newDevelopmentCards.road;
    G.players[playerID].newDevelopmentCards.road = 0;

}

const playKnight = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.knight > 0) {
        G.players[playerID].developmentCards.knight -= 1;
        G.players[playerID].playedKnights++;
        G.players[playerID].canPlayCard = false;

        if (G.players[playerID].playedKnights > G.largestArmy && G.largestArmy < 2) {
            G.largestArmy = G.players[playerID].playedKnights;
        }
        else if (G.players[playerID].playedKnights > G.largestArmy && G.largestArmy === 2) {
            G.largestArmy = G.players[playerID].playedKnights;
            G.players[playerID].largestArmyCard = 1;
            G.players[playerID].score += 2;
        }
        else if (G.players[playerID].playedKnights > G.largestArmy) {
            G.largestArmy = G.players[playerID].playedKnights;

            for (let i=0; i<G.players.length; i++) {
                if (G.players[i].largestArmyCard === 1) {
                    G.players[i].largestArmyCard = 0;
                    G.players[i].score -= 2;
                }
            }

            G.players[playerID].largestArmyCard = 1;
            G.players[playerID].score += 2;
        }
      }
}


const playVictoryCard = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.victory > 0) {
        G.players[playerID].developmentCards.victory -= 1;
        G.players[playerID].score += 1;
        console.log("Victory Card Played" + G.players[playerID].score);
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

const setHexMap = ({G, ctx}, h) => {
    h.map((hex) => (
        hexes.set("q: " + hex.props.q + ", r: " + hex.props.r + ", s: " + hex.props.s, hex)
    ))
}

const setTileNums = ({G, ctx}, nums) => {
    for (let i=0; i<nums.length; i++) {
        if (nums[i] == "Robber") {
            G.robberIndex = i;
        }
    }

    G.tileNums = nums;
}


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
}


const discardCards = ({G, ctx}, totalResources, index) => {
    const discard = Math.floor(totalResources/2);
    console.log(totalResources/2);
    console.log(Math.floor(totalResources/2));


    for (let i=0; i < discard; i++) {
        let choice = 1+Math.floor(Math.random() * G.players[index].resources.wheat + G.players[index].resources.sheep + G.players[index].resources.wood + G.players[index].resources.brick + G.players[index].resources.ore);
        console.log("Choice is " + choice);

        if (choice <= G.players[index].resources.wheat) {
            G.players[index].resources.wheat--;
            console.log("Discarded Wheat");
        }
        else if (choice <= G.players[index].resources.wheat + G.players[index].resources.sheep) {
            G.players[index].resources.sheep--;
            console.log("Discarded Sheep");
        }
        else if (choice <= G.players[index].resources.wheat + G.players[index].resources.sheep + G.players[index].resources.wood) {
            G.players[index].resources.wood--;
            console.log("Discarded Wood");
        }
        else if (choice <= G.players[index].resources.wheat + G.players[index].resources.sheep + G.players[index].resources.wood + G.players[index].resources.brick) {
            G.players[index].resources.brick--;
            console.log("Discarded Brick");
        }
        else if (choice <= G.players[index].resources.wheat + G.players[index].resources.sheep + G.players[index].resources.wood + G.players[index].resources.brick + G.players[index].resources.ore) {
            G.players[index].resources.ore--;
            console.log("Discarded Ore");
        }
    }
}

const tradeWithBank = (actualG, ctx, currentPlayerIndex, resourceToTrade, resourceToReceive) => {

    const tradeRatio = 3;
 
    const G = produce(actualG.G, draft => {

        console.log('currentPlayerIndex in tradeWithBank:', currentPlayerIndex);
        console.log('resourceToTrade in tradeWithBank:', resourceToTrade);
        console.log('resourceToReceive in tradeWithBank:', resourceToReceive);

        if (draft.players[currentPlayerIndex].resources[resourceToTrade] >= tradeRatio) {
            draft.players[currentPlayerIndex].resources[resourceToTrade] -= tradeRatio;
            draft.players[currentPlayerIndex].resources[resourceToReceive] += 1;
          } else {
            console.error(`Player ${currentPlayerIndex}+1 doesn't have enough ${resourceToTrade} resources to trade.`);
          }

    });
    
    return G;
}

const makeTrade = (actualG, ctx, currentPlayerIndex, selectedPlayerIndex, tradeResources, wantedResources) => {
    console.log('traderesources in makeTrade:', tradeResources);
    console.log('wantedresources in makeTrade:', wantedResources);
    console.log('selectedPlayerIndex right before const SelectedPlayer:', selectedPlayerIndex);
    console.log('actualG in makeTrade:', actualG);
  
    const G = produce(actualG.G, draft => {
      //const currentPlayer = draft.players[currentPlayerIndex];
      const selectedPlayer = draft.players[selectedPlayerIndex];
  
      if (!selectedPlayer) {
        console.error('Selected player not found in makeTrade');
        return INVALID_MOVE;
      }
  
      console.log('currentPlayerIndex in makeTrade:', currentPlayerIndex);
      console.log('selectedPlayerIndex in makeTrade:', selectedPlayerIndex);
      console.log('traderesources in makeTrade:', tradeResources);
      console.log('wantedresources in makeTrade:', wantedResources);
  
      draft.players[currentPlayerIndex].resources.wheat -= tradeResources.wheat;
      draft.players[selectedPlayerIndex].resources.wheat += tradeResources.wheat;    
      draft.players[selectedPlayerIndex].resources.wheat -= wantedResources.wheat;
      draft.players[currentPlayerIndex].resources.wheat += wantedResources.wheat;
  
      draft.players[currentPlayerIndex].resources.sheep -= tradeResources.sheep;
      draft.players[selectedPlayerIndex].resources.sheep += tradeResources.sheep;    
      draft.players[selectedPlayerIndex].resources.sheep -= wantedResources.sheep;
      draft.players[currentPlayerIndex].resources.sheep += wantedResources.sheep;
      
      draft.players[currentPlayerIndex].resources.wood -= tradeResources.wood;
      draft.players[selectedPlayerIndex].resources.wood += tradeResources.wood;    
      draft.players[selectedPlayerIndex].resources.wood -= wantedResources.wood;
      draft.players[currentPlayerIndex].resources.wood += wantedResources.wood;
  
      draft.players[currentPlayerIndex].resources.brick -= tradeResources.brick;
      draft.players[selectedPlayerIndex].resources.brick += tradeResources.brick;    
      draft.players[selectedPlayerIndex].resources.brick -= wantedResources.brick;
      draft.players[currentPlayerIndex].resources.brick += wantedResources.brick;
      
      draft.players[currentPlayerIndex].resources.ore -= tradeResources.ore;
      draft.players[selectedPlayerIndex].resources.ore += tradeResources.ore;    
      draft.players[selectedPlayerIndex].resources.ore -= wantedResources.ore;
      draft.players[currentPlayerIndex].resources.ore += wantedResources.ore;
      
    });
  
    return G;
  };

export const checkLongestRoad = ({G, ctx}, longestNum, prevWinner) => {
    // get player roads from map
    const playerRoads = G.players[ctx.currentPlayer].roads.map((r) => (
        boardRoads.get(r)
    ))
    let longestPlayerRoad = longestRoad(playerRoads, hexes);

    if (longestPlayerRoad > longestNum) {
        if (prevWinner != undefined) {
            G.players[prevWinner].longestRoad = false;
            G.players[prevWinner].score -= 1;
        }
        G.players[ctx.currentPlayer].longestRoad = true;
        G.longestRoad = longestPlayerRoad;
        G.players[ctx.currentPlayer].score += 1;
    }
}

  
export const settlersOffKatan = numPlayers => ({
    setup: () => ({
        tileNums: [9, 8, 5, 12, 11, 3, 6, 10, 6, "Robber", 4, 11, 2, 4, 3, 5, 9, 10, 8],
        robberIndex: 9,
        deck: {
            knight: 14,
            victory: 5,
            monopoly: 2,
            road: 2,
            plenty: 2
        },
        largestArmy: 0,
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
            newDevelopmentCards: {
                knight: 0,
                monopoly: 0,
                road: 0,
                plenty: 0
            },
            playedKnights: 0,
            largestArmyCard: 0,
            diceRoll: 0,
            longestRoad: false,
            totalRoads: 0, //this is for keeping track of if a road was placed for when Road Building is played
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
        longestRoad: 4,
        robberUsers: [],
    }),

    turn: {
        onBegin: resetDevPlays,
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
                    first: ({ G, ctx }) => 0,
                    next: ({ G, ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers,
                    // Override the initial value of playOrder, called at the beginning of phase
                    playOrder: ({ G, ctx }) => [...ctx.playOrder].reverse(),
                  }
            },
            endIf: ({ ctx, G }) => (ctx.turn > (G.players.length * 2)),
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
        setPlayerColors,
        setTileNums,
        stealResource,
        playKnight,
        discardCards,
        upgradeSettlement,
        addInitialResources,
        checkLongestRoad,
        updateDevelopmentCards,
        findUsers,
        tradeWithBank: {
            move: tradeWithBank,
            client: false,
            redact: true,
        },
        makeTrade: {
            move: makeTrade,
            client: false,
            redact: true,
        }
    }
});

