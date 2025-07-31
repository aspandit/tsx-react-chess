import Piece, {PieceColor, PieceType} from "./Piece";

export default class King extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.KING,color);
    }
}