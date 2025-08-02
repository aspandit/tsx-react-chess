import Piece, {PieceColor, PieceType} from "./interface/Piece";
import OneForward from "./move/OneForward";
import OneDiagonalForward from "./move/OneDiagonalForward";
import {Direction} from "../Direction";

export default class Pawn extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.PAWN,color);
        this._moves.push(new OneForward(true, true, true,
                color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING),
            new OneDiagonalForward(false, false, true,
                color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING));
    }
}