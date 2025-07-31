import Piece, {PieceColor, PieceType} from "./Piece";

export default class NoPiece extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.NO_PIECE,color);
    }
}

export const EMPTY_SQUARE:Piece = new NoPiece(PieceColor.NO_PIECE);