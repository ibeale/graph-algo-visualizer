import React from 'react';
import {Square, SquareProps, StartSquareProps, EndSquareProps, BlockadeSquareProps, PlainSquareProps, PathSquareProps, VisitedSquareProps} from './Square'

export class Point{
    x: number;
    y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}

export interface BoardProps{
    height: number,
    width: number,
    start?: Point,
    end?: Point,
    path: Point[],
    visited: Point[],
    blockades: Point[],
    addBlockadeCallback: (points: Point[]) => void
}

interface State{
    squares: (SquareProps)[][]
}


export class Board extends React.Component<BoardProps, State>{
    squares : (SquareProps)[][] = []

    updatePath(){
        
    }

    addBlockade(point : Point, event?: React.MouseEvent<HTMLDivElement>) {
        this.props.addBlockadeCallback([point]);
    }

    render(){
        this.squares = []
        for(let i = 0; i < this.props.height; i++){
            this.squares.push([]);
            for(let j = 0; j < this.props.width; j++){
                if(this.props.start !== undefined && i === this.props.start.x && j === this.props.start.y){
                    this.squares[i].push(new StartSquareProps());
                }
                else if(this.props.end !== undefined && i === this.props.end.x && j === this.props.end.y){
                    this.squares[i].push(new EndSquareProps());
                }
                else{
                    let onClick = (() => this.addBlockade(new Point(i,j), undefined));
                    this.squares[i].push(new PlainSquareProps(onClick));
                }
            }
        }
        this.props.blockades.forEach(({x,y}) => {
            this.squares[x][y] = new BlockadeSquareProps((() => this.addBlockade({x,y}, undefined)));

        })

        this.props.visited.forEach(({x,y}) => {
            this.squares[x][y] = new VisitedSquareProps();
        })

        this.props.path.forEach(({x,y}) => {
            this.squares[x][y] = new PathSquareProps();
        })
        let grid : JSX.Element[] = [];
        for(let i = 0; i < this.props.height; i++){
            let row = [];
            for(let j = 0; j < this.props.width; j++){
                let square = Square(this.squares[i][j], i+this.props.width*j);
                row.push(square);
            }
            grid.push(<div key={i} className="board-row">{row}</div>);

        }
        return(
            grid
        )
    }

}

export default Board;