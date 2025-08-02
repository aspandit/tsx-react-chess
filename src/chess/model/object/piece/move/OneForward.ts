import Piece from "../interface/Piece";
import Move from "./interface/Move";

export default class OneForward extends Move {
    protected isPathShapeCorrect(from: ParsedCoordinate, to: ParsedCoordinate): boolean {
        return super.isPathShapeCorrect(from, to)
            && (to.rowIndex - from.rowIndex == this._direction && to.colIndex - from.colIndex == 0);
    }

    getPath(board: Piece[][], from: ParsedCoordinate, to: ParsedCoordinate): Piece[] {
        return [];
    }
}