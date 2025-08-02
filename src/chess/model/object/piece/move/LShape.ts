import Piece from "../interface/Piece";
import Move from "./interface/Move";
import {openInterval} from "../../../../utils/Utils";

export default class LShape extends Move {
    isPathShapeCorrect(from: ParsedCoordinate, to: ParsedCoordinate): boolean {
        return super.isPathShapeCorrect(from,to)
            && ((Math.abs(from.rowIndex-to.rowIndex) == 2 && Math.abs(from.colIndex-to.colIndex) == 1)
                || (Math.abs(from.rowIndex-to.rowIndex) == 1 && Math.abs(from.colIndex-to.colIndex) == 2));
    }
    getPath(board: Piece[][], from: ParsedCoordinate, to: ParsedCoordinate): Piece[] {
        let path:Piece[] = [];
        for(let r of openInterval(from.rowIndex, to.rowIndex)) {
            path.push(board[r][to.colIndex]);
        }
        for(let c of openInterval(from.colIndex, to.colIndex)) {
            path.push(board[to.rowIndex][c]);
        }
        return path;
    }
}