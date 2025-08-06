import Piece from "../baseclass/Piece";
import Move from "./baseclass/Move";

export default class OneAdjacent extends Move {
    isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return super.isPathShapeCorrect(from,to)
            && ((Math.abs(from.colIndex-to.colIndex) <= 1) || (Math.abs(from.colIndex-to.colIndex) <= 1));
    }
    getPath(board: Piece[][], from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[] {
        return [];
    }

}