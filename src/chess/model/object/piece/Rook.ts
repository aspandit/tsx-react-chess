import Piece, {PieceColor, PieceType} from "./interface/Piece";
import {Direction} from "../Direction";
import Straight from "./move/Straight";

export default class Rook extends Piece {
    constructor(color: PieceColor) {
        super(PieceType.ROOK, color);
        this._moves.push(new Straight(true, false, false, Direction.EITHER));
    }
}