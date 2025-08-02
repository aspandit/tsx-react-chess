import Piece from "../interface/Piece";
import Move from "./interface/Move";

export default class OneAdjacent extends Move {
    isPathShapeCorrect(from: ParsedCoordinate, to: ParsedCoordinate): boolean {
        return super.isPathShapeCorrect(from,to)
            && ((Math.abs(from.colIndex-to.colIndex) <= 1) || (Math.abs(from.colIndex-to.colIndex) <= 1));
    }
    getPath(board: Piece[][], from: ParsedCoordinate, to: ParsedCoordinate): Piece[] {
        return [];
    }

}