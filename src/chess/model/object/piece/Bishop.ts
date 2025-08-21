import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import Diagonal from "../move/Diagonal";
import {Direction} from "../Direction";

export default class Bishop extends Piece {
    constructor(color:PieceColor, initialSquare: BoardLocation) {
        super(PieceType.BISHOP,color,initialSquare);
        this._moves.push(new Diagonal(false, false, false, Direction.EITHER));
    }
}