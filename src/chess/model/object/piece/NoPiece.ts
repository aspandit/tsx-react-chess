import Piece, {PieceColor, PieceType} from "./baseclass/Piece";

export default class NoPiece extends Piece {
    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.NO_TYPE, color, initialSquare);
    }
}

export const NO_PIECE = new NoPiece(PieceColor.NO_COLOR, "");