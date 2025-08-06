import Piece from "../baseclass/Piece";
import Move from "./baseclass/Move";

export default class OneForward extends Move {
    protected isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return super.isPathShapeCorrect(from, to)
            && (to.rowIndex - from.rowIndex == this._direction && to.colIndex - from.colIndex == 0);
    }

    getPath(board: Piece[][], from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[] {
        return [];
    }
}