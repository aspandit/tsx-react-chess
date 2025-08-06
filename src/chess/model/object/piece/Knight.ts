import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import LShape from "./move/LShape";
import {Direction} from "../Direction";

export default class Knight extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.KNIGHT,color);
        this._moves.push(new LShape(true, false, true, Direction.EITHER));
    }
}