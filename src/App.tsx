import React from 'react'
import {Board, Point} from './Board'
import { SolverBase, DijkstraSolver} from './Solver';


interface AppState{
    boardH: number,
    startPt: Point,
    endPt: Point,
    adjMatrix: number[][],
    points: Point[],
    path: Point[],
    visited: Point[],
    blockades: Point[],
    solver?: SolverBase
}

enum SolverTypes{
    Dijkstra
}

interface AppProps{

}

function sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
export class App extends React.Component<AppProps, AppState>{
 
    constructor(props : AppProps){
        super(props);
        let newMatrix : number[][] = [];
        this.state = {
            boardH: 3,
            startPt: new Point(0,0),
            endPt: new Point (2,2),
            adjMatrix: [],
            points: [],
            visited: [],
            blockades: [],
            path: []
        }
        for(let x = 0; x < this.state.boardH; x++){
            for(let y = 0; y < this.state.boardH; y++){
                this.state.points.push(new Point(y,x))
            }
        }
        this.state.points.forEach(({x: x1, y:y1}, i) => {
            newMatrix.push([]);
            this.state.points.forEach(({x:x2, y:y2}) => {
                let distance = Math.abs(x2-x1)+Math.abs(y2-y1)
                if(distance <= 1){
                    newMatrix[i].push(distance)
                }
                else{
                    newMatrix[i].push(Infinity)
                }
            })
        })
        this.state = {
            boardH: this.state.boardH,
            startPt: this.state.startPt,
            endPt: this.state.endPt,
            adjMatrix: newMatrix,
            points: this.state.points,
            visited: this.state.visited,
            blockades: [],
            path: []
        }
    }

    toggleBlockadesInMatrix(points: Point[]){

        let newMatrix = this.state.adjMatrix.slice();
        let newBlockades : Point[] = this.state.blockades.slice();;
        points.forEach(point => {
            let adjMatIdx = this.state.boardH * point.y + point.x;
            if(this.state.blockades.find(({x,y} : Point) => 
                (x === point.x && y === point.y)
            )){
                console.log(`removing blockade at x: ${point.x}, y: ${point.y}`)
                newBlockades = newBlockades.filter(({x,y} : Point) => 
                    !(x === point.x && y === point.y)
                )
                this.state.points.forEach(({x, y} : Point, i) => {
                    let distance = Math.abs(point.x - x) + Math.abs(point.y - y)
                    if(distance <= 1 && newMatrix[i][i] !== Infinity){
                        newMatrix[i][adjMatIdx] = distance
                        newMatrix[adjMatIdx][i] = distance
                    }
                    else{
                        newMatrix[i][adjMatIdx] = Infinity
                        newMatrix[adjMatIdx][i] = Infinity
                    }
                })
            }
            else{
                console.log(`adding blockade at x: ${point.x}, y: ${point.y}`)
                newBlockades = this.state.blockades.slice();
                newBlockades.push(point);
                for(let i = 0; i < newMatrix.length; i++){
                    newMatrix[i][adjMatIdx] = Infinity;
                    newMatrix[adjMatIdx][i] = Infinity;
                }
            }
        })

        this.setState({
            adjMatrix: newMatrix,
            blockades: newBlockades
        })
        
    }

    setSolver(solverType: SolverTypes){
        switch(solverType){
            case SolverTypes.Dijkstra:
                this.setState({
                    solver: new DijkstraSolver()
                })
        }
    }

    solveShortestPath = async () => {
        this.clearPath();
        this.setSolver(SolverTypes.Dijkstra);
        if(this.state.solver != null){
            let results = this.state.solver.solve(this.state.startPt, this.state.endPt, this.state.adjMatrix, this.state.points)
            let displayedVisited : Point[] = [];
            for(let i = 0; i < results.visited.length; i++){
                displayedVisited.push(results.visited[i]);
                this.setState({
                    visited: displayedVisited
                })
                await sleep(10);
            }
            this.setState({
                path: results.path,
                visited: results.visited
            })
        }
    }

    clearPath = () => {
        this.setState({
            path: [],
            visited: []
        })
    }

    clearBlockades = () => {
        this.toggleBlockadesInMatrix(this.state.blockades);
    }  

    render(){
        return(
            
            <div>
            <Board 
                height={this.state.boardH}
                width={this.state.boardH}
                start={this.state.startPt}
                end={this.state.endPt}
                addBlockadeCallback={(points:Point[]) => this.toggleBlockadesInMatrix(points)}
                path={this.state.path}
                visited={this.state.visited}
                blockades={this.state.blockades}/>
                <button onClick={this.clearPath}>Clear Path</button>
                <button onClick={this.clearBlockades}>Clear Blockades</button>
                <button onClick={this.solveShortestPath}>Solve</button>
            </div>
            )
        }
    }