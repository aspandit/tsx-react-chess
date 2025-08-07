import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import OneAdjacent from "./move/OneAdjacent";
import {Direction} from "../Direction";

export default class King extends Piece {
    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.KING, color, initialSquare);
        this._moves.push(new OneAdjacent(true, false, false, Direction.EITHER));
    }
}