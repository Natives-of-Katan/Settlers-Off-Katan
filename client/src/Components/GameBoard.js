import React from 'react'
import GameTile from "./GameTile"

// Represents a 10 x 18 grid of grid squares

export default function GameBoard() {

  // generates an array of 18 rows, each containing 10 GridSquares.

    const grid = []
    for (let row = 0; row < 18; row ++) {
        grid.push([])
        for (let col = 0; col < 10; col ++) {
            grid[row].push(<GameTile />)
        }
    }

  // The components generated in makeGrid are rendered in div.grid-board

    return (
        <div className='game-board'>
            {grid}
        </div>
    )
}