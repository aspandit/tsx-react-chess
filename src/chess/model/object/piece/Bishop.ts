import Piece, {PieceColor, PieceType} from "./Piece";

export default class Bishop extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.BISHOP,color);
    }
}