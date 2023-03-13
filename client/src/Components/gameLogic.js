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

export const settlersOffKatan = {
    setup: () => ({
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
            settlements: [],
            cards: []
        })),
    }),

    moves: {
        rollDice
    }
};

