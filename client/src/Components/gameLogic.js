const tileResource = ["grain", "grain", "grain", "grain", "pasture", "pasture", 
                          "forest", "pasture", "forest", "desert", "forest", "forest", 
                          "hill", "hill", "hill", "mountain", "mountain", "mountain", "pasture"];
const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const rollDice = ({G, playerID}) => {
    const d1 = 1+Math.floor(Math.random() *6);
    const d2 = 1+Math.floor(Math.random() *6);

    tileNums.forEach((num) => {
        if(d1+d2 === num)
            G.players[playerID].resources[tileResource[num]] +=1;
    })

    console.log(d1+d2);
}

const addDevelopmentResources = ({G, playerID}) => {
    G.players[playerID].resources.pasture += 1;
    G.players[playerID].resources.grain += 1;
    G.players[playerID].resources.mountain += 1;
}

const drawDevelopmentCard = ({G, playerID}) => {
    const drawnCard = 1+Math.floor(Math.random() * (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty+G.deck.road));

    if (G.players[playerID].resources.pasture > 0 && G.players[playerID].resources.grain > 0 && G.players[playerID].resources.mountain > 0) {
        if (drawnCard <= G.deck.knight) {
            G.players[playerID].developmentCards.knight += 1;
            G.deck.knight -= 1;
            G.players[playerID].resources.pasture -= 1;
            G.players[playerID].resources.grain -= 1;
            G.players[playerID].resources.mountain -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory)) {
            G.players[playerID].developmentCards.victory += 1;
            G.deck.victory -= 1;
            G.players[playerID].resources.pasture -= 1;
            G.players[playerID].resources.grain -= 1;
            G.players[playerID].resources.mountain -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly)) {
            G.players[playerID].developmentCards.monopoly += 1;
            G.deck.monopoly -= 1;
            G.players[playerID].resources.pasture -= 1;
            G.players[playerID].resources.grain -= 1;
            G.players[playerID].resources.mountain -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty)) {
            G.players[playerID].developmentCards.plenty += 1;
            G.deck.plenty -= 1;
            G.players[playerID].resources.pasture -= 1;
            G.players[playerID].resources.grain -= 1;
            G.players[playerID].resources.mountain -= 1;
        }
        else if (drawnCard <= (G.deck.knight+G.deck.victory+G.deck.monopoly+G.deck.plenty+G.deck.road)) {
            G.players[playerID].developmentCards.road += 1;
            G.deck.road -= 1;
            G.players[playerID].resources.pasture -= 1;
            G.players[playerID].resources.grain -= 1;
            G.players[playerID].resources.mountain -= 1;
        }
    }
}

export const settlersOffKatan = {
    setup: () => ({
        deck: {
            knight: 14,
            victory: 5,
            monopoly: 2,
            road: 2,
            plenty: 2
        },
        players: Array(4).fill().map( () => ({
            points: 0,
            resources: {
                grain: 0,
                pasture: 0,
                forest: 0,
                desert: 0,
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
            settlements: [],
            cards: []
        })),
    }),

    moves: {
        rollDice,
        addDevelopmentResources,
        drawDevelopmentCard
    }
};

