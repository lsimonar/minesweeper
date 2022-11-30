import React from 'react';
import {Cell} from "../Cell/Cell";
import './Board.css'

type BoardProps = {
    gridSize: number;
}

export function Board({gridSize}: BoardProps) : JSX.Element{

    const renderGrid = () => {
        const length = gridSize*gridSize;
        const cells = [] as JSX.Element[];

        const bombs = plantBombs();
        let content = '';
        
        for(let i=0; i< length; i++){
            if(bombs.includes(i)){
                content = '💣'
            }
            cells.push(<Cell key={`${i}`} content={content}/>)
            content = ''
        }
    return cells;
    }

    const plantBombs = () => {
        const bombs = [];
        for(let i=0; i<= gridSize; i++){
            bombs.push(Math.floor(Math.random() * gridSize * gridSize))
        }
        return bombs;
    }

    return (
        <div className="board-ctn" style={{width: gridSize*33}}>{renderGrid()}</div>
    )
}