const onlineGame = (() => {
    const tileResource = ["grain", "grain", "grain", "grain", "pasture", "pasture", 
      "forest", "pasture", "forest", "desert", "forest", "forest", 
      "hill", "hill", "hill", "mountain", "mountain", "mountain", "pasture"];
  
    const tileNums = [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12];
  
    const diceRoll = (gameState, seatNum) => {
      const d1 = 1+Math.floor(Math.random() *6);
      const d2 = 1+Math.floor(Math.random() *6);
      gameState.currentRoll = d1+d2; 
  
      tileNums.forEach((num, index) => {
        if(d1+d2 === num && d1+d2!==7) {
          const resource = tileResource[index];
          gameState.players[seatNum].resources[resource] +=1;
        }
      });
  
      return gameState;
    }
  
    return {
      diceRoll
    };
  })();
  
  module.exports = onlineGame;