import React, {useEffect, useState} from 'react';
import './Timer.css'

type TimerProps = {
    isGameOver: boolean;
    checkWin: number;
    gridSize: number;
    nBombs: number;
}

export const Timer = ({isGameOver, checkWin, gridSize, nBombs}: TimerProps ) => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    useEffect(() => {
      let interval: string | number | NodeJS.Timeout | undefined;
      if (running) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 10);
        }, 10);
      } else if (!running) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [running]);

    useEffect(() => {
        if (isGameOver || checkWin === (gridSize*gridSize - nBombs)){
            setRunning(false)
        } else if (checkWin > 0 && checkWin < (gridSize*gridSize - nBombs)) {
            setRunning(true)
        } else if (checkWin === 0) {
            setRunning(false)
            setTime(0)
        }
    }, [isGameOver, checkWin])

    return (
        <div style={{width:'fit-content', textAlign: 'center'}}>
            <div className="timer"> 
                <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
            </div>
        </div>
    );
  };