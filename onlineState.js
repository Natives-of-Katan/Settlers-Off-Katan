    const initialize = (num) => {
        const state = {
             deck: {
             knight: 14,
             victory: 5,
             monopoly: 2,
             road: 2,
             plenty: 2
         },
         players: Array(num).fill().map( () => ({
            //score of 10 will be removed in production, used to test game over screen!
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
     }
     return state;
    }

    module.exports = initialize;