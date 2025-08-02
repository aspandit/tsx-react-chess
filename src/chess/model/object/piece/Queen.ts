import Piece, {PieceColor, PieceType} from "./interface/Piece";
import {Direction} from "../Direction";
import Straight from "./move/Straight";
import Diagonal from "./move/Diagonal";

export default class Queen extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.QUEEN,color);
        this._moves.push(
            new Diagonal(true, false, false, Direction.EITHER),
            new Straight(true, false, false, Direction.EITHER)
        );
    }
}