import Piece from "../../baseclass/Piece";
import BoardModel from "../../../../BoardModel";
import {NO_PIECE} from "../../NoPiece";
import {Direction} from "../../../Direction";
import {isEqual} from "../../../../../utils/Utils";
import GameModel from "../../../../GameModel";

export default abstract class Move {
    protected _captureRequired: boolean;
    protected _captureProhibited: boolean;
    protected _clearPathOptional: boolean;
    protected _direction: Direction;

    constructor(captureRequired: boolean, captureProhibited: boolean, clearPathOptional: boolean, direction: Direction) {
        this._captureRequired = captureRequired;
        this._captureProhibited = captureProhibited;
        this._clearPathOptional = clearPathOptional;
        this._direction = direction;
    }

    /**
     * Makes the current move and returns true if valid.
     * @param gameModel the current game model; the model is needed here because a copy of the board is returned from boardModel.board for safety/encapsulation
     * @param from the starting coordinate for the move
     * @param to the ending coordinate for the move
     */
    makeMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation): boolean {
        const board: Piece[][] = gameModel.board;
        const fromLoc: ParsedBoardLocation = BoardModel.parseBoardLocation(from);
        const toLoc: ParsedBoardLocation = BoardModel.parseBoardLocation(to);

        const captureSquareContents: Piece = this.getCaptureSquareContents(board, fromLoc, toLoc);
        const pathShapeCorrect = this.isPathShapeCorrect(fromLoc, toLoc);
        const pathClear = this.isPathClear(this.getPath(board, fromLoc, toLoc));
        const capturing = this.isCapturing(captureSquareContents);
        console.info(`pathShapeCorrect: ${pathShapeCorrect}, pathClear: ${pathClear}, capturing: ${capturing}`);
        if (pathShapeCorrect
            && (this._clearPathOptional || pathClear)
            && ((!this._captureRequired || capturing) && (!this._captureProhibited || !capturing))) {
            return this.doMove(gameModel, from, to);
        } else {
            return false;
        }
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

    private isPathClear(path: Piece[]): boolean {
        return path.reduce((accum, val) => accum && isEqual(val, NO_PIECE), true);
    }

    private isCapturing(captureSquareContents: Piece): boolean {
        return !isEqual(captureSquareContents, NO_PIECE);
    }

    /**
     * This method is overridden by subclasses for special moves.
     * @param gameModel
     * @param from
     * @param to
     * @protected
     */
    protected doMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation): boolean {
        const board: Piece[][] = gameModel.board;
        const fromObj = BoardModel.parseBoardLocation(from);

        // make the move - order is important HERE
        gameModel.setBoardSquareContents(to, board[fromObj.rowIndex][fromObj.colIndex]);
        gameModel.setBoardSquareContents(from, NO_PIECE);

        return true;
    }

    protected getCaptureSquareContents(board: Piece[][], fromLoc: ParsedBoardLocation, toLoc: ParsedBoardLocation): Piece {
        return board[toLoc.rowIndex][toLoc.colIndex];
    }
}