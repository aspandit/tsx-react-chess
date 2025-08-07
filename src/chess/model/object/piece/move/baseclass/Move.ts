import Piece from "../../baseclass/Piece";
import BoardModel from "../../../../BoardModel";
import {NO_PIECE} from "../../NoPiece";
import {Direction} from "../../../Direction";
import {isEqual} from "../../../../../utils/Utils";

export default abstract class Move {
    protected _captureOptional: boolean;
    protected _captureProhibited: boolean;
    protected _clearPathOptional: boolean;
    protected _direction: Direction;

    constructor(captureOptional: boolean, captureProhibited: boolean, clearPathOptional: boolean, direction: Direction) {
        this._captureOptional = captureOptional;
        this._captureProhibited = captureProhibited;
        this._clearPathOptional = clearPathOptional;
        this._direction = direction;
    }

    /**
     * Returns true if coordinates for the current move are valid. Ensures that
     * - path from {@link from} coordinate to {@link to} coordinate adhere to shape described by move,
     * - path is clear from {@link from} coordinate to {@link to} coordinate if applicable, and
     * - the {@link to} coordinate contains an opposing piece if required(e.g., pawns can only move diagonally, forward by one when capturing).
     * @param board the current board configuration
     * @param from the starting coordinate for the move
     * @param to the ending coordinate for the move
     */
    isValid(board: Piece[][], from: BoardLocation, to: BoardLocation): boolean {
        const fromObj: ParsedBoardLocation = BoardModel.parseCoordinate(from);
        const toObj: ParsedBoardLocation = BoardModel.parseCoordinate(to);

        const toSquareContents: Piece = board[toObj.rowIndex][toObj.colIndex];
        const pathShapeCorrect = this.isPathShapeCorrect(fromObj, toObj);
        const pathClear = this.isPathClear(this.getPath(board, fromObj, toObj));
        const capturing = this.isCapturing(toSquareContents);
        console.info(`pathShapeCorrect: ${pathShapeCorrect}, pathClear: ${pathClear}, capturing: ${capturing}`);
        return (pathShapeCorrect
            && (this._clearPathOptional || pathClear)
            && ((this._captureOptional || capturing) || (this._captureProhibited && !capturing)));
    }

    /**
     * Overridden in concrete classes.
     * @param from
     * @param to
     * @protected
     */
    protected isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return !(from.rowIndex == to.rowIndex && from.colIndex == to.colIndex); // shape is not correct if no move was made
    }

    /**
     * Returns ANY ONE path's pieces from {@link from} to {@link to}.
     * Path should NOT include start and end squares.
     * @param board
     * @param from
     * @param to
     */
    abstract getPath(board: Piece[][], from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[];

    isPathClear(path: Piece[]): boolean {
        return path.reduce((accum, val) => accum && isEqual(val, NO_PIECE), true);
    }

    isCapturing(toSquareContents: Piece): boolean {
        return !isEqual(toSquareContents, NO_PIECE);
    }
}