import React, {useEffect, useState} from 'react';
import {Cell} from "../Cell/Cell";
import './Board.css'

type BoardProps = {
    gridSize: number;
}

export enum CellContent {
    BOMB = 'BOMB',
    NUMBER = 'NUMBER',
    EMPTY = 'EMPTY'
}

export interface CellStatus {
    index: number[],
    content: CellContent,
    neighbouringBombs: number,
    revealed: boolean,
    flagged: boolean
}

export function Board({gridSize}: BoardProps) : JSX.Element{

    const fillEmptyStates = () => {

        let emptyCells: Array<CellStatus[]> = [];

        for(let i=0; i< gridSize; i++){

            let cellStates = [];

            for(let j=0; j< gridSize; j++){
                cellStates.push({
                    index: [i, j],
                    content: CellContent.EMPTY,
                    neighbouringBombs: 0,
                    revealed: false,
                    flagged: false
                } as CellStatus)
            }

            emptyCells.push(cellStates);
        }
        return emptyCells;
    }

    const plantBombs = (boardState: Array<CellStatus[]>) => {
        let bombsPlanted: number = 0;
        while(bombsPlanted < gridSize){
            const randomIndex = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
            if(boardState[randomIndex[0]][randomIndex[1]].content !== CellContent.BOMB){ 
                boardState[randomIndex[0]][randomIndex[1]].content = CellContent.BOMB
                ++bombsPlanted;
            }
        }
        return boardState;
    }

    const findNeighbouringBombs = (boardState: Array<CellStatus[]>): Array<CellStatus[]> => {
        for(let x=0; x < gridSize; x++){
            for(let y=0; y < gridSize; y++){
                if(boardState[x][y].content === CellContent.BOMB){
                    if(x > 0){
                        boardState[x - 1][y].neighbouringBombs += 1;
                    }
                    if(x < gridSize - 1){
                        boardState[x + 1][y].neighbouringBombs += 1;
                    }
                    if(y > 0){
                        boardState[x][y - 1].neighbouringBombs += 1;
                    }
                    if(y < gridSize - 1){
                        boardState[x][y + 1].neighbouringBombs += 1;
                    }
                    if(x > 0 && y > 0){
                        boardState[x - 1][y - 1].neighbouringBombs += 1;
                    }
                    if(x < gridSize - 1 && y < gridSize - 1){
                        boardState[x + 1][y + 1].neighbouringBombs += 1;
                    }
                    if(x > 0 && y < gridSize - 1){
                        boardState[x - 1][y + 1].neighbouringBombs += 1;
                    }
                    if(x < gridSize - 1 && y > 0){
                        boardState[x + 1][y - 1].neighbouringBombs += 1;
                    }
                }
            }
        }
        return boardState;
    }

    const initBoard = (): Array<CellStatus[]> => {
        let boardState = fillEmptyStates();
        boardState = plantBombs(boardState);
        boardState = findNeighbouringBombs(boardState);
        return boardState;
    }

    const handleClick = (x: number, y: number): void =>{
        let updatedBoard = [...[...boardState] ];
        if(updatedBoard[x][y].flagged === false && !isGameOver && checkWin !== (gridSize*gridSize - gridSize)){
            if(updatedBoard[x][y].content === CellContent.BOMB){
                updatedBoard.forEach((row) => {
                    row.forEach((column) => {
                        if(column.content === CellContent.BOMB){
                            column.revealed = true;
                        }
                    })
                })
                setIsGameOver(true);
            } else {
                if(updatedBoard[x][y].neighbouringBombs === 0){
                    updatedBoard = revealEmpty(x, y);
                } else {
                    updatedBoard[x][y].revealed = true;
                    setCheckWin(checkWin + 1)
                }
                setBoardState(updatedBoard);
            }
        }
    }

    const handleRightClick = (x: number, y: number): void => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
        if(!isGameOver && checkWin !== (gridSize*gridSize - gridSize)){
            let updatedBoard = [... [...boardState]]; 
            updatedBoard[x][y].flagged = !updatedBoard[x][y].flagged;
            setBoardState(updatedBoard);
        }
    }

    const renderGrid = () => {

        const cells = [] as JSX.Element[];
        let key=0;
        for(let x=0; x < gridSize; x++){
            for(let y=0; y < gridSize; y++){
                key++;
                cells.push(<Cell key={key} onClick={handleClick} onRightClick={handleRightClick} boardStatus={boardState[x][y]} />)
            }
        }
        return cells;
    }

    const revealEmpty = (x: number, y: number) => {
        let show: CellStatus[]=[];
        let arr = [...[...boardState] ];
        let revealedCells: number = 0;
        show.push(arr[x][y]);
        while(show.length!==0){
            let one = show.pop();
            if(one){
            let i=one?.index[0];
            let j=one?.index[1];
            if(!one?.revealed){
                
                one.revealed=true;
                ++revealedCells;
            }
            if(one.neighbouringBombs !==0){
                break;
            }
    
            // top left 
    
            if(
                i>0 && 
                j>0 &&
                arr[i-1][j-1].neighbouringBombs===0 &&
                !arr[i-1][j-1].revealed
            )
            {
                show.push(arr[i-1][j-1]);
            }
    
            // bottom right
    
            if(
                i<arr.length-1 &&
                j<arr[0].length-1 &&
                arr[i+1][j+1].neighbouringBombs===0 &&
                !arr[i+1][j+1].revealed
            ){
                show.push(arr[i+1][j+1]);
            }
    
            // top right
    
            if(
                i>0 &&
                j<arr[0].length-1 &&
                arr[i-1][j+1].neighbouringBombs===0 &&
                !arr[i-1][j+1].revealed
            ){
                show.push(arr[i-1][j+1]);
            }
    
            // bottom left 
    
            if(
                i<arr.length-1 &&
                j>0 &&
                arr[i+1][j-1].neighbouringBombs===0 &&
                !arr[i+1][j-1].revealed
            ){
                show.push(arr[i+1][j-1]);
            }
    
            // top 
            if(
                i>0 &&
                arr[i-1][j].neighbouringBombs===0 &&
                !arr[i-1][j].revealed 
            ){
                show.push(arr[i-1][j]);
            }
    
            // right
    
            if(
                j<arr[0].length-1 &&
                arr[i][j+1].neighbouringBombs===0 &&
                !arr[i][j+1].revealed
            ){
                show.push(arr[i][j+1]);
            }
    
            // bottom
    
            if(
                i<arr.length-1 &&
                arr[i+1][j].neighbouringBombs===0 &&
                !arr[i+1][j].revealed
            ){
                show.push(arr[i+1][j]);
            }
    
            // left
    
            if(
                j>0 &&
                arr[i][j-1].neighbouringBombs===0 &&
                !arr[i][j-1].revealed
            ){
                show.push(arr[i][j-1]);
            }
    
    
            // start revealing the item
    
            if (
                i > 0 &&
                j > 0 &&
                !arr[i - 1][j - 1].revealed
              ) {
                //Top Left Reveal
          
                arr[i - 1][j - 1].revealed = true;
                ++revealedCells;
              }
          
              if (j > 0 && !arr[i][j - 1].revealed) {
                // Left Reveal
                arr[i][j - 1].revealed = true;
                ++revealedCells;
                
              }
          
              if (
                i < arr.length - 1 &&
                j > 0 &&
                !arr[i + 1][j - 1].revealed
              ) {
                //Bottom Left Reveal
                arr[i + 1][j - 1].revealed = true;
                ++revealedCells;
                
              }
          
              if (i > 0 && !arr[i - 1][j].revealed) {
                //Top Reveal
                arr[i - 1][j].revealed = true;
                ++revealedCells;
                
              }
          
              if (i < arr.length - 1 && !arr[i + 1][j].revealed) {
                // Bottom Reveal
                arr[i + 1][j].revealed = true;
                ++revealedCells;
                
              }
          
              if (
                i > 0 &&
                j < arr[0].length - 1 &&
                !arr[i - 1][j + 1].revealed
              ) {
                // Top Right Reveal
                arr[i - 1][j + 1].revealed = true;
                ++revealedCells;
                
              }
          
              if (j < arr[0].length - 1 && !arr[i][j + 1].revealed) {
                //Right Reveal
                arr[i][j + 1].revealed = true;
                ++revealedCells;
                
              }
          
              if (
                i < arr.length - 1 &&
                j < arr[0].length - 1 &&
                !arr[i + 1][j + 1].revealed
              ) {
                // Bottom Right Reveal
                arr[i + 1][j + 1].revealed = true;
                ++revealedCells;
                
              }
            }
        }
        setCheckWin(checkWin + revealedCells)
        return arr;
    } 

    const [boardState, setBoardState] = useState<Array<CellStatus[]>>(initBoard())
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [checkWin, setCheckWin] = useState<number>(0);

    const playAgain = () => {
        setIsGameOver(false);
        setCheckWin(0);
        setBoardState(initBoard());
    }

    return (
        <div>                
            {isGameOver && 
                <div>
                    <h1>GAME OVER</h1>
                    <button onClick={playAgain}>Play Again</button>
                </div>        
            }
            {checkWin === (gridSize*gridSize - gridSize) &&
                <div>
                    <h1>YOU WON!</h1>
                    <button onClick={playAgain}>Play Again</button>
                </div>
            }
            <div className="outer-border">
                <div className="board-ctn" style={{width: gridSize*33}}>
                    {renderGrid()}
                </div>
            </div>
        </div>
    )
}