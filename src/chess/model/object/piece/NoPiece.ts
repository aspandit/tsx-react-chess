import Piece, {PieceColor, PieceType} from "./baseclass/Piece";

export default class NoPiece extends Piece {
    constructor(color:PieceColor) {
        super(PieceType.NO_TYPE,color);
    }
}

export const NO_PIECE:Piece = new NoPiece(PieceColor.NO_COLOR);