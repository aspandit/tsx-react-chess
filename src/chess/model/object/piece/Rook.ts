import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import {Direction} from "../Direction";
import Straight from "./move/Straight";

export default class Rook extends Piece {
    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.ROOK, color, initialSquare);
        this._moves.push(new Straight(true, false, false, Direction.EITHER));
    }
}