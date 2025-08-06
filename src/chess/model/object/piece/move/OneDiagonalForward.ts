import Piece from "../baseclass/Piece";
import Move from "./baseclass/Move";

export default class OneDiagonalForward extends Move {
    protected isPathShapeCorrect(from: ParsedCoordinate, to: ParsedCoordinate): boolean {
        return super.isPathShapeCorrect(from, to)
            && (to.rowIndex - from.rowIndex == this._direction && Math.abs(to.colIndex - from.colIndex) == 1);
    }

    getPath(board: Piece[][], from: ParsedCoordinate, to: ParsedCoordinate): Piece[] {
        return [];
    }
}