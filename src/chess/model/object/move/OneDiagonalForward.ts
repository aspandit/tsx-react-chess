import Piece from "../piece/baseclass/Piece";
import Move from "./baseclass/Move";
import GameModel from "../../GameModel";

export default class OneDiagonalForward extends Move {
    protected isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return super.isPathShapeCorrect(from, to)
            && (to.rowIndex - from.rowIndex == this._direction && Math.abs(to.colIndex - from.colIndex) == 1);
    }

    getPath(gameModel: GameModel, from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[] {
        return [];
    }
}