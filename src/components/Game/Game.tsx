import React from 'react';
import {Board} from "../Board/Board";
import './Game.css'

export function Game(): JSX.Element {
    return (
        <div className='game-ctn'>
            <Board gridWidth={15} gridHeight={15} nBombs={20} />
        </div>
    )
}