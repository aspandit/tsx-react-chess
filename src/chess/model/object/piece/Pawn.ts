import Piece, {PieceColor, PieceType} from "./Piece";

export default class Pawn extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.PAWN,color);
    }
}