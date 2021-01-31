import React from 'react'
import {Board, Point} from './Board'
import { Solver } from './Solver';


interface AppState{
    boardH: number,
    startPt: Point,
    endPt: Point,
    adjMatrix: number[][],
    points: Point[],
    path: Point[]
}

interface AppProps{

}
export class App extends React.Component<AppProps, AppState>{

    constructor(props : AppProps){
        super(props);
        this.state = {
            boardH: 3,
            startPt: new Point(0,0),
            endPt: new Point(2,2),
            adjMatrix: [],
            points: [],
            path: []
        }
        let newMatrix : number[][] = [];
        for(let x = 0; x < this.state.boardH; x++){
            for(let y = 0; y < this.state.boardH; y++){
                this.state.points.push(new Point(x,y))
            }
        }
        this.state.points.forEach(({x: x1, y:y1}, i) => {
            newMatrix.push([]);
            this.state.points.forEach(({x:x2, y:y2}) => {
                newMatrix[i].push(Math.abs(x2-x1)+Math.abs(y2-y1))
            })
        })
        this.state = {
            boardH: this.state.boardH,
            startPt: this.state.startPt,
            endPt: this.state.endPt,
            adjMatrix: newMatrix,
            points: this.state.points,
            path: []
        }
    }


    addBlockadeToMatrix(point: Point){
        let newMatrix = this.state.adjMatrix.slice();
        let adjMatIdx = this.state.boardH * point.y + point.x;
        if(this.state.adjMatrix[adjMatIdx][0] === Infinity){
            this.state.points.forEach(({x, y}, i) => {
                newMatrix[i][adjMatIdx] = Math.abs(point.x - x) + Math.abs(point.y - y)
                newMatrix[adjMatIdx][i] = Math.abs(point.x - x) + Math.abs(point.y - y)
            })
        }
        else{
            for(let i = 0; i < newMatrix.length; i++){
                newMatrix[i][adjMatIdx] = Infinity;
                newMatrix[adjMatIdx][i] = Infinity;
            }
        }
        this.setState({
            adjMatrix: newMatrix
        })
    }

    render(){
        let solver = new Solver();
        solver.dijkstraSolver(this.state.adjMatrix, this.state.points, this.state.startPt, this.state.endPt);
        console.log(this.state.adjMatrix);
        return(<Board 
            height={this.state.boardH}
            width={this.state.boardH}
            start={this.state.startPt}
            end={this.state.endPt}
            addBlockadeCallback={(point:Point) => this.addBlockadeToMatrix(point)}
            path={this.state.path}/>)
    }
}