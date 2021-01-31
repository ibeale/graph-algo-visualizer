import React from 'react';

export interface SquareProps{
    visited: boolean,
    visitable: boolean,
    readonly className: string,
    onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
}

export const Square : React.FC<SquareProps> = (props, key) => (
    <div key={key} onClick={props.onClick} className={`square ${props.className}`}></div>)

export class PlainSquareProps implements SquareProps{
    visited= false;
    visitable= true;
    className="";

    constructor(onClick : ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined){
        this.onClick = onClick;
    }
    onClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
}
export class StartSquareProps implements SquareProps{
    visited= true;
    visitable= false;
    className= "start-square";
}
export class EndSquareProps implements SquareProps{
    visited= false;
    visitable= true;
    className="end-square";
}

export class PathSquareProps implements SquareProps {
    visited= true;
    visitable= false;
    className="visited";
}

export class BlockadeSquareProps implements SquareProps{
    visited= false;
    visitable= false;
    className= "blockade";

    constructor(onClick : ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined){
        this.onClick = onClick;
    }
    onClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
}