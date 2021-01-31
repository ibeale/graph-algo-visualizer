
import { Point } from "./Board";

export class Solver{

    dijkstraSolver(adjMat: number[][], points:Point[], startPt: Point, endPt: Point){
        let distances = new Array(adjMat.length).fill(Infinity);
        let idx = (endPt.x + adjMat.length*endPt.y)
        console.log(idx);
        distances[idx] = 0;
        console.log(distances)
    }

}