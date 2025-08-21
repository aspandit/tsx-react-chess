import Move from "../../move/baseclass/Move";
import GameModel from "../../../GameModel";

export default abstract class Piece {
    private readonly _pieceLabel: string;
    private readonly _pieceType: PieceType;
    private readonly _pieceColor: PieceColor;
    private readonly _initialSquare: BoardLocation; // this differentiates the pieces; it is a key - TODO not currently in use; revive if needed

    protected _moves: Move[];

    protected constructor(type: PieceType, color: PieceColor, initialSquare: BoardLocation) {
        this._pieceType = type;
        this._pieceColor = color;
        this._pieceLabel = (type + color <= 0) ? "" /* empty string for no piece */ : String.fromCodePoint(type + color);

        this._initialSquare = initialSquare;

        this._moves = [];
    }

    get color(): PieceColor {
        return this._pieceColor;
    }

    get type(): PieceType {
        return this._pieceType;
    }

    get label(): string {
        return this._pieceLabel;
    }

    get initialSquare(): BoardLocation {
        return this._initialSquare;
    }

    toString(): string {
        return this._pieceLabel;
    }

    makeMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation, rollback: boolean): boolean {
        // Any one of the moves needs to be valid
        return this._moves.reduce((acc, curr) => {
            return acc || curr.makeMove(gameModel, from, to, rollback)
        }, false);
    }
}

// TODO Write tests: Numbering is important here and should NOT be changed
export enum PieceType {
    NO_TYPE = -1,
    KING = 0,
    QUEEN = 1,
    ROOK = 2,
    BISHOP = 3,
    KNIGHT = 4,
    PAWN = 5
}

// TODO Write tests: Numbering is important here and should NOT be changed
export enum PieceColor {
    NO_COLOR = -1,
    WHITE = 0x2654,
    BLACK = 0x265A
}