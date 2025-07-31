import Piece, {PieceColor, PieceType} from "./Piece";

export default class Knight extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.KNIGHT,color);
    }
}