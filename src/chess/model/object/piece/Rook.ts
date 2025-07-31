import Piece, {PieceColor, PieceType} from "./Piece";

export default class Rook extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.ROOK,color);
    }
}