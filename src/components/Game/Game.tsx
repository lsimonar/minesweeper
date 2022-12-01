import React from 'react';
import {Board} from "../Board/Board";
import './Game.css'

export function Game(): JSX.Element {
    return (
        <div className='game-ctn'>
            <Board gridWidth={10} gridHeight={10} nBombs={15} />
        </div>
    )
}