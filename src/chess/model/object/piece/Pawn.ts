import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import OneForward from "./move/OneForward";
import OneDiagonalForward from "./move/OneDiagonalForward";
import {Direction} from "../Direction";
import BoardModel from "../../BoardModel";
import TwoForward from "./move/TwoForward";
import Move from "./move/baseclass/Move";
import EnPassant from "./move/EnPassant";
import GameModel from "../../GameModel";

export default class Pawn extends Piece {
    private _twoForward: Move | null;
    private _enPassant: Move | null;

    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.PAWN, color, initialSquare);
        this._moves.push(new OneForward(true, true, false,
                color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING),
            new OneDiagonalForward(false, false, true,
                color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING)
        );

        this._twoForward = new TwoForward(true, true, false,
            color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING);
        this._enPassant = null;
    }

    makeMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation): boolean {
        if (this._twoForward?.makeMove(gameModel, from, to)) {
            // remove TwoForward move once moved
            this._twoForward = null;
            this.assignSidePiecesToEnPassant(gameModel, to);
            return true;
        }
        if (this._enPassant?.makeMove(gameModel, from, to)) {
            // this._enPassant should be cleared by the game model on the next turn
            return true;
        }
        if (super.makeMove(gameModel, from, to)) {
            // remove TwoForward move once moved
            this._twoForward = null;
            // give option of PawnPromotion if in last row
            return true;
        }
        return false;
    }

    clearEnPassant(): void {
        this._enPassant = null;
    }

    private assignSidePiecesToEnPassant(gameModel: GameModel, to: BoardLocation): void {
        const leftSquare = BoardModel.leftSquare(gameModel.board, to);
        if (leftSquare) {
            this.assignNeighborToEnPassant(gameModel, leftSquare, to);
        }
        const rightSquare = BoardModel.rightSquare(gameModel.board, to);
        if (rightSquare) {
            this.assignNeighborToEnPassant(gameModel, rightSquare, to);
        }
    }

    private assignNeighborToEnPassant(gameModel: GameModel, loc: BoardLocation, grantorLocation: BoardLocation) {
        const locCoords: ParsedBoardLocation = BoardModel.parseBoardLocation(loc);
        const piece: Piece = gameModel.board[locCoords.rowIndex][locCoords.colIndex];
        if (piece.type === PieceType.PAWN) {
            (piece as Pawn)._enPassant = new EnPassant(true/* TODO make this to false; right now it is being enforced by specialized logic */,
                false, true, piece.color == PieceColor.WHITE ? Direction.INCREASING : Direction.DECREASING, grantorLocation);
            gameModel.assignToEnPassant(piece);
        }
    }
}