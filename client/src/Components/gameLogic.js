const tileResource = ["grain", "grain", "grain", "grain", "pasture", "pasture", 
                          "forest", "pasture", "forest", "desert", "forest", "forest", 
                          "hill", "hill", "hill", "mountain", "mountain", "mountain", "pasture"];
const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const rollDice = ({G, playerID}) => {
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

export const settlersOffKatan = {
    setup: () => ({
        players: Array(4).fill().map( () => ({
            score: 0,
            resources: {
                grain: 0,
                pasture: 0,
                forest: 0,
                hill: 0,
                mountain: 0
            },
            diceRoll: 0,
            canBuildSettlement: false,
            canBuildRoad: false,
            canBuyCard: false,
            settlements: [],
            cards: []
        })),
    }),

    turn: {
        onBegin: checkBuildActions
    },

    moves: {
        rollDice
    }
};

