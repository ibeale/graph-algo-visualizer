import React from 'react';
import {Square, SquareProps, StartSquareProps, EndSquareProps, BlockadeSquareProps, PlainSquareProps, PathSquareProps} from './Square'

export class Point{
    x: number;
    y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}

interface Props{
    height: number,
    width: number,
    start?: Point,
    end?: Point,
    path: Point[],
    addBlockadeCallback: (point: Point) => void
}

interface State{
    squares: (SquareProps)[][]
}


export class Board extends React.Component<Props, State>{
    constructor(props:Props){
        super(props);
        this.state = {
            squares: []
        }
        for(let i = 0; i < props.height; i++){
            this.state.squares.push([]);
            for(let j = 0; j < props.width; j++){
                if(this.props.start !== undefined && i === this.props.start.x && j === this.props.start.y){
                    this.state.squares[i].push(new StartSquareProps());
                }
                else if(this.props.end !== undefined && i === this.props.end.x && j === this.props.end.y){
                    this.state.squares[i].push(new EndSquareProps());
                }
                else{
                    let onClick = (() => this.addBlockade(new Point(i,j), undefined));
                    this.state.squares[i].push(new PlainSquareProps(onClick));
                }
            }
        }
        let newSquares = this.state.squares.slice();
        this.props.path.forEach(({x,y}) => {
            newSquares[x][y] = new PathSquareProps();
        })
        this.setState({
            squares: newSquares
        })
    }

    addBlockade(point : Point, event?: React.MouseEvent<HTMLDivElement>) {

        let newSquares = this.state.squares.slice(); 
        if( newSquares[point.x][point.y] instanceof BlockadeSquareProps){
            newSquares[point.x][point.y] = new PlainSquareProps((() => this.addBlockade(point, undefined)));
        }
        else{
            newSquares[point.x][point.y] = new BlockadeSquareProps((() => this.addBlockade(point, undefined)));
        }
        this.props.addBlockadeCallback(point);
        this.setState({
            squares: newSquares,
        })
    }

    render(){
        let grid : JSX.Element[] = [];
        for(let i = 0; i < this.props.height; i++){
            let row = [];
            for(let j = 0; j < this.props.width; j++){
                let square = Square(this.state.squares[i][j], i+this.props.width*j);
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