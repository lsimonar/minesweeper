import React from 'react';
import {Board} from "../Board/Board";
import './Game.css'

export function Game(): JSX.Element {
    return (
        <div className='game-ctn'>
            <Board gridSize={9}/>
        </div>
    )
}