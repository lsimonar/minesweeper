import React from "react";
import { useState } from "react";
import './Cell.css'

type CellProps = {
    content: string;
    status?: boolean;
}
export function Cell({content, status}: CellProps) {

    const [isClicked, setIsClicked] = useState(false);
    const handleClick= () => {
        setIsClicked(true)
    }

    return (
        <div onClick={handleClick} className='cell'>
            {isClicked && content}
        </div>
    )
}