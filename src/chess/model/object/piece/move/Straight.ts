import Piece from "../interface/Piece";
import Move from "./interface/Move";
import {openInterval, xor} from "../../../../utils/Utils";

export default class Straight extends Move {
    isPathShapeCorrect(from: ParsedCoordinate, to: ParsedCoordinate): boolean {
        return super.isPathShapeCorrect(from,to)
                && xor((from.colIndex - to.colIndex === 0),(from.rowIndex - to.rowIndex === 0));
    }
    getPath(board: Piece[][], from: ParsedCoordinate, to: ParsedCoordinate): Piece[] {
        const path:Piece[] = [];
        const rows:number[] = openInterval(from.rowIndex, to.rowIndex);
        const cols:number[] = openInterval(from.colIndex, to.colIndex);
        if(from.colIndex == to.colIndex) {
            for (let i = 0; i < rows.length; i++) {
                path.push(board[rows[i]][to.colIndex]);
            }
        }
        if(from.rowIndex == to.rowIndex) {
            for (let i = 0; i < cols.length; i++) {
                path.push(board[to.rowIndex][cols[i]]);
            }
        }
        return path;
    }

}