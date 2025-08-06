import Piece from "../baseclass/Piece";
import Move from "./baseclass/Move";
import {closedInterval, openInterval} from "../../../../utils/Utils";

export default class Diagonal extends Move {
    isPathShapeCorrect(from: ParsedCoordinate, to: ParsedCoordinate): boolean {
        return super.isPathShapeCorrect(from,to)
            && closedInterval(from.rowIndex, to.rowIndex).length === closedInterval(from.colIndex, to.colIndex).length;
    }
    getPath(board: Piece[][], from: ParsedCoordinate, to: ParsedCoordinate): Piece[] {
        const path:Piece[] = [];
        const rows:number[] = openInterval(from.rowIndex, to.rowIndex);
        const cols:number[] = openInterval(from.colIndex, to.colIndex);
        for (let i = 0; i < rows.length; i++) {
            path.push(board[rows[i]][cols[i]]);
        }
        return path;
    }
}