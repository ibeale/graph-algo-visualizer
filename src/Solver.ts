
import { Point } from "./Board";

export interface SolverResults{
    visited: Point[],
    path: Point[]
}

export class Solver{



}

export abstract class SolverBase{

    abstract solve(startPt: Point, endPt: Point, adjMat : number[][],points : Point[]) : SolverResults;
}

export class DijkstraSolver extends SolverBase{

    extractMin(distances : number[], visited : boolean[]){
        let min = Infinity;
        let idx = -1;

        for(let i = 0; i < distances.length; i++){
            if(visited[i] === false && distances[i] < min){
                min = distances[i];
                idx = i
            }
        }
        return idx;
    }

    solve(startPt: Point, endPt: Point, adjMat : number[][],points : Point[]): SolverResults {
        let visited = Array(adjMat.length).fill(false);
        let distances = Array(adjMat.length).fill(Infinity);
        let parents = Array(adjMat.length).fill(-1);
        let startAdjMatIdx = Math.sqrt(adjMat.length) * startPt.y + startPt.x;
        let endAdjMatIdx = Math.sqrt(adjMat.length) * endPt.y + endPt.x;
        distances[startAdjMatIdx] = 0;
        let results : SolverResults ={
            visited: [],
            path: [],
        } 
        let curIdx = -1;
        for(let i = 0; i < distances.length; i++){
            curIdx = this.extractMin(distances, visited);
            if(curIdx === endAdjMatIdx || curIdx === -1){
                break;
            }
            visited[curIdx] = true;
            results.visited.push(points[curIdx]);
            for(let j = 0; j < distances.length; j++){
                if(!visited[j] && adjMat[curIdx][j] !== Infinity && adjMat[curIdx][j] + distances[curIdx] < distances[j]){
                    distances[j] = distances[curIdx] + adjMat[curIdx][j]
                    parents[j] = curIdx;
                }
            }
        }
        if(curIdx !== -1){
            while(parents[curIdx] !== -1){
                results.path.push(points[parents[curIdx]]);
                curIdx = parents[curIdx];
            }
        }

        return results;

    }
    
}