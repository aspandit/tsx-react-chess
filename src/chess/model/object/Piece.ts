export default class Piece {
    private readonly _pieceLabel:string;
    private readonly _pieceType:number;
    private readonly _pieceColor:number;

    constructor(type:PieceType,color:PieceColor) {
        this._pieceType = type;
        this._pieceColor = color;
        this._pieceLabel = (type+color === 0) ? "" : String.fromCodePoint(type+color);
    }

    get color():number {
        return this._pieceColor;
    }

    get type():number {
        return this._pieceType;
    }

    get label():string {
        return this._pieceLabel;
    }

    toString() : string {
        return this._pieceLabel;
    }
}

export enum PieceType {
    NO_PIECE = 0,
    KING = 1,
    QUEEN = 2,
    ROOK = 3,
    BISHOP = 4,
    KNIGHT = 5,
    PAWN = 6
}

export enum PieceColor {
    NO_PIECE = 0,
    WHITE = 0x2653,
    BLACK = 0x2659
}

export const NO_PIECE:Piece = new Piece(PieceType.NO_PIECE, PieceColor.NO_PIECE);

export const WHITE_PIECES = [
    new Piece(PieceType.ROOK,PieceColor.WHITE),
    new Piece(PieceType.KNIGHT,PieceColor.WHITE),
    new Piece(PieceType.BISHOP,PieceColor.WHITE),
    new Piece(PieceType.QUEEN,PieceColor.WHITE),
    new Piece(PieceType.KING,PieceColor.WHITE),
    new Piece(PieceType.PAWN,PieceColor.WHITE)
];

export const BLACK_PIECES = [
    new Piece(PieceType.ROOK,PieceColor.BLACK),
    new Piece(PieceType.KNIGHT,PieceColor.BLACK),
    new Piece(PieceType.BISHOP,PieceColor.BLACK),
    new Piece(PieceType.QUEEN,PieceColor.BLACK),
    new Piece(PieceType.KING,PieceColor.BLACK),
    new Piece(PieceType.PAWN,PieceColor.BLACK)
];