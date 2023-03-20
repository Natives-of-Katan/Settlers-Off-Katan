
const tileResource = ["grain", "grain", "grain", "grain", "pasture", "pasture", 
                          "forest", "pasture", "forest", "desert", "forest", "forest", 
                          "hill", "hill", "hill", "mountain", "mountain", "mountain", "pasture"];
const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];

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
    }
}
const plentyChoiceTwoPasture = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.pasture += 1;
        G.players[playerID].developmentCards.plenty -= 1;
    }
}
const plentyChoiceTwoForest = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.forest += 1;
        G.players[playerID].developmentCards.plenty -= 1;
    }
}
const plentyChoiceTwoHill = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.hill += 1;
        G.players[playerID].developmentCards.plenty -= 1;
    }
}
const plentyChoiceTwoMountain = ({G, playerID}) => {
    if (G.players[playerID].developmentCards.plenty > 0) {
        G.players[playerID].resources.mountain += 1;
        G.players[playerID].developmentCards.plenty -= 1;
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
        G.players[playerID].points += 1;
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


export const settlersOffKatan = numPlayers => ({
    setup: () => ({
        players: Array(numPlayers).fill().map( () => ({
            score: 0,
            deck: {
                knight: 14,
                victory: 5,
                monopoly: 2,
                road: 2,
                plenty: 2
            },
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
            startOfTurn: false,
            settlements: [],
            cards: []
        })),
    }),

    turn: {
        onBegin: checkBuildActions
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
        plentyChoiceTwoMountain
    }
});

