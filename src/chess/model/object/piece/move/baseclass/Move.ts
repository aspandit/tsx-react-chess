import Piece, {PieceType} from "../../baseclass/Piece";
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
        const fromLoc: ParsedBoardLocation = BoardModel.parseBoardLocation(from);
        const toLoc: ParsedBoardLocation = BoardModel.parseBoardLocation(to);

        const captureSquareContents: Piece = this.getCaptureSquareContents(gameModel, fromLoc, toLoc);
        const pathShapeCorrect = this.isPathShapeCorrect(fromLoc, toLoc);
        const pathClear = this.isPathClear(this.getPath(gameModel, fromLoc, toLoc));
        const capturing = this.isCapturing(captureSquareContents);
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
     * @param gameModel
     * @param from
     * @param to
     */
    abstract getPath(gameModel: GameModel, from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[];

    private isPathClear(path: Piece[]): boolean {
        return path.reduce((accum, val) => accum && isEqual(val, NO_PIECE), true);
    }

    private isCapturing(captureSquareContents: Piece): boolean {
        return !isEqual(captureSquareContents, NO_PIECE);
    }

    /**
     * This method is overridden by subclasses for special moves. The move is done and the board is checked to see if it causes a
     * check to be revealed for the current player. If check is revealed for current player, the move is rolled back and false is returned.
     * @param gameModel
     * @param from
     * @param to
     * @protected
     */
    protected doMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation): boolean {
        const movingPiece:Piece = gameModel.getBoardSquareContents(from);
        const toLocPiece:Piece = gameModel.getBoardSquareContents(to);
        // make the move - order is important HERE
        gameModel.setBoardSquareContents(to, movingPiece);
        gameModel.setBoardSquareContents(from, NO_PIECE);

        // Rollback and return false if own king is threatened after move - a player cannot put themselves in check
            // if the king is being moved make sure to see if they are moving into a checked location
        if((movingPiece.type === PieceType.KING && gameModel.isBoardLocationThreatened(to,movingPiece.color))
            || (movingPiece.type !== PieceType.KING && gameModel.isBoardLocationThreatened(gameModel.getKingLocation(),movingPiece.color))) {
            gameModel.setBoardSquareContents(to, toLocPiece);
            gameModel.setBoardSquareContents(from, movingPiece);

            return false;
        }

        return true;
    }

    protected getCaptureSquareContents(gameModel:GameModel, fromLoc: ParsedBoardLocation, toLoc: ParsedBoardLocation): Piece {
        return gameModel.getBoardSquareContents((BoardModel.colCoordinates[toLoc.colIndex] + BoardModel.rowCoordinates[toLoc.rowIndex]) as BoardLocation);
    }
}