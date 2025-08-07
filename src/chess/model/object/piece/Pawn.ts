import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import OneForward from "./move/OneForward";
import OneDiagonalForward from "./move/OneDiagonalForward";
import {Direction} from "../Direction";
import BoardModel from "../../BoardModel";
import TwoForward from "./move/TwoForward";
import Move from "./move/baseclass/Move";

export default class Pawn extends Piece {
    private _twoForward: Move | null;

    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.PAWN, color, initialSquare);
        this._moves.push(new OneForward(true, true, false,
                color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING),
            new OneDiagonalForward(false, false, true,
                color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING)
        );

        this._twoForward = new TwoForward(true, true, false,
            color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING);
    }

    makeMove(boardModel: BoardModel, from: BoardLocation, to: BoardLocation): boolean {
        if (this._twoForward?.makeMove(boardModel, from, to)) {
            // remove TwoForward move once moved
            this._twoForward = null;
            // TODO assign EnPassant to left and right pawns
            return true;
        }
        if (super.makeMove(boardModel, from, to)) {
            // remove TwoForward move once moved
            this._twoForward = null;
            // give option of PawnPromotion if in last row
            return true;
        }
        return false;
    }
}