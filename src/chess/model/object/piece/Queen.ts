import Piece, {PieceColor, PieceType} from "./Piece";

export default class Queen extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.QUEEN,color);
    }
}