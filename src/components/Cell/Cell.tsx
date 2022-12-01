import React from "react";
import './Cell.css'
import {CellStatus, CellContent} from '../Board/Board'

type CellProps = {
    boardStatus: CellStatus;
    onClick?: any;
    onRightClick: any;
}

export function Cell({boardStatus, onClick, onRightClick}: CellProps) {

    const getCellContent = (): string => {
        let cellContent = '';
        if(boardStatus.content === CellContent.BOMB){
            cellContent = '💣';
        }
        if(boardStatus.content !== CellContent.BOMB && boardStatus.neighbouringBombs !== 0){
            cellContent = String(boardStatus.neighbouringBombs);
        }
        return cellContent;
    }

    const getCellStyle = (): string => {

        let cellStyle : string = '';
        if(boardStatus.neighbouringBombs !== 0){
            switch(boardStatus.neighbouringBombs) {
                case 1: 
                    cellStyle = 'blue';
                    break;
                case 2: 
                    cellStyle = 'green';
                    break;
                case 3:
                    cellStyle = 'red';
                    break;
                case 4: 
                    cellStyle = 'purple'
                    break;
                case 5: 
                    cellStyle = 'maroon'
                    break;
                default: cellStyle = '';
            }
        }
        return cellStyle;
    }

    const click=()=>{
        onClick(boardStatus.index[0], boardStatus.index[1]); 
    }    

    const rightClick=() => {
        onRightClick(boardStatus.index[0], boardStatus.index[1])
    }

    return (
        <div onClick={click} onContextMenu={rightClick} className={boardStatus.revealed? `cell revealed ${getCellStyle()}` : 'cell'}>
            {boardStatus.revealed? getCellContent() : boardStatus.flagged? '🚩' : ''}
        </div>
    )
}