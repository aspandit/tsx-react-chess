import Piece, {PieceColor, PieceType} from "./interface/Piece";
import Diagonal from "./move/Diagonal";
import {Direction} from "../Direction";

export default class Bishop extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.BISHOP,color);
        this._moves.push(new Diagonal(true, false, false, Direction.EITHER));
    }
}