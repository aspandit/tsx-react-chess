export default abstract class Piece {
    private readonly _pieceLabel:string;
    private readonly _pieceType:number;
    private readonly _pieceColor:number;

    protected constructor(type:PieceType,color:PieceColor) {
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