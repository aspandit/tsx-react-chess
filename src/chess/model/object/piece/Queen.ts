import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import {Direction} from "../Direction";
import Straight from "../move/Straight";
import Diagonal from "../move/Diagonal";

export default class Queen extends Piece {
    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.QUEEN, color, initialSquare);
        this._moves.push(
            new Diagonal(false, false, false, Direction.EITHER),
            new Straight(false, false, false, Direction.EITHER)
        );
    }
}