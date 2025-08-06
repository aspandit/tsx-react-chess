import Move from "../move/baseclass/Move";

export default abstract class Piece {
    private readonly _pieceLabel:string;
    private readonly _pieceType:number;
    private readonly _pieceColor:number;

    protected _moves:Move[];

    protected constructor(type:PieceType,color:PieceColor) {
        this._pieceType = type;
        this._pieceColor = color;
        this._pieceLabel = (type+color <= 0) ? "" /* empty string for no piece */ : String.fromCodePoint(type+color);

        this._moves = [];
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

    isMoveValid(board:Piece[][], from:BoardLocation, to:BoardLocation):boolean {
        // Any one of the moves needs to be valid
        return this._moves.reduce((acc,curr) => {
            console.info(acc);
            return acc || curr.isValid(board, from, to)
        },false);
    }
}

// TODO Write tests: Numbering is important here and should NOT be changed
export enum PieceType {
    NO_PIECE = -1,
    KING = 0,
    QUEEN = 1,
    ROOK = 2,
    BISHOP = 3,
    KNIGHT = 4,
    PAWN = 5
}

// TODO Write tests: Numbering is important here and should NOT be changed
export enum PieceColor {
    NO_PIECE = -1,
    WHITE = 0x2654,
    BLACK = 0x265A
}