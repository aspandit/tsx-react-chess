import Piece, {PieceColor, PieceType} from "./interface/Piece";
import OneAdjacent from "./move/OneAdjacent";
import {Direction} from "../Direction";

export default class King extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.KING,color);
        this._moves.push(new OneAdjacent(true, false, false, Direction.EITHER));
    }
}