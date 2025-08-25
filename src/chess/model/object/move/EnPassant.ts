import Move from "./baseclass/Move";
import Piece from "../piece/baseclass/Piece";
import GameModel from "../../GameModel";
import BoardModel from "../../BoardModel";
import {NO_PIECE} from "../piece/NoPiece";
import {Direction} from "../Direction";

export default class EnPassant extends Move {
    _grantorLocation:BoardLocation; // location of the Pawn that granted the EnPassant ability

    constructor(captureRequired: boolean, captureProhibited: boolean, clearPathOptional: boolean, direction: Direction, grantorLocation:BoardLocation) {
        super(captureRequired, captureProhibited, clearPathOptional, direction);
        this._grantorLocation = grantorLocation;
    }

    protected isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return super.isPathShapeCorrect(from, to)
            && (to.rowIndex - from.rowIndex == this._direction && Math.abs(to.colIndex - from.colIndex) == 1);
    }

    getPath(gameModel:GameModel, from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[] {
        return [];
    }

    protected doMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation, rollback: boolean): boolean {
        const fromObj = BoardModel.parseBoardLocation(from);
        const toObj = BoardModel.parseBoardLocation(to);
        let moveAllowed: boolean = false;
        const targetLocation: BoardLocation = (BoardModel.colCoordinates[toObj.colIndex] + BoardModel.rowCoordinates[fromObj.rowIndex]) as BoardLocation;

        if(targetLocation !== this._grantorLocation) {
            return false;
        }

        // make the move - order is important HERE
        const targetPawn:Piece = gameModel.getBoardSquareContents(targetLocation);
        const movingPawn:Piece = gameModel.getBoardSquareContents(from);
        gameModel.setBoardSquareContents(to, movingPawn);
        gameModel.setBoardSquareContents(from, NO_PIECE);
        gameModel.setBoardSquareContents(targetLocation, NO_PIECE);

        // Rollback and return false if own king is threatened after move - a player cannot put themselves in check
        moveAllowed = !gameModel.isBoardLocationThreatened(gameModel.getKingLocation(), movingPawn.color).underThreat;

        if(rollback || !moveAllowed) {
            gameModel.setBoardSquareContents(to, NO_PIECE);
            gameModel.setBoardSquareContents(from, movingPawn);
            gameModel.setBoardSquareContents(targetLocation, targetPawn);
        }

        return moveAllowed;
    }

    protected getCaptureSquareContents(gameModel:GameModel, fromLoc: ParsedBoardLocation, toLoc: ParsedBoardLocation): Piece {
        return gameModel.getBoardSquareContentsFromCoords(fromLoc.rowIndex,toLoc.colIndex);
    }
}