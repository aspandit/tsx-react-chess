import GameModel from "../../GameModel";
import Piece, {PieceType} from "../piece/baseclass/Piece";
import Move from "./baseclass/Move";
import {Direction} from "../Direction";
import {openInterval} from "../../../utils/Utils";
import BoardModel from "../../BoardModel";
import {NO_PIECE} from "../piece/NoPiece";
import Rook from "../piece/Rook";

export default class Castle extends Move {
    constructor(captureRequired: boolean, captureProhibited: boolean, clearPathOptional: boolean, direction: Direction) {
        super(captureRequired, captureProhibited, clearPathOptional, direction);
    }

    protected isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return super.isPathShapeCorrect(from, to) && to.rowIndex === from.rowIndex
                && Math.abs(to.colIndex - from.colIndex) === 2;
    }

    getPath(gameModel: GameModel, from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[] {
        let pieces: Piece[] = [];
        for(let c of openInterval(from.colIndex,to.colIndex)) {
            pieces.push(gameModel.getBoardSquareContents(BoardModel.getValidBoardLocationByOffset("a8",to.rowIndex,c)));
        }
        return pieces;
    }

    protected doMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation, rollback: boolean): boolean {
        const movingPiece:Piece = gameModel.getBoardSquareContents(from);
        let moveAllowed: boolean = true;

        // Rollback and return false if own king is threatened after move - a player cannot put themselves in check
        // if the king is being moved make sure to see if they are moving into a checked location
        // this logic is SPECIALIZED for castling: we need to make sure the king is not in check and is not moving through
        // or onto a threatened square. The coordination/rollback between king and rook also needs to be handled.
        const colDelta:number = (BoardModel.parseBoardLocation(to).colIndex - BoardModel.parseBoardLocation(from).colIndex);
        const rookFrom:BoardLocation = colDelta > 0 ? BoardModel.getValidBoardLocationByOffset(from,0,3) : BoardModel.getValidBoardLocationByOffset(from,0,-4);
        const rookTo:BoardLocation = colDelta > 0 ? BoardModel.getValidBoardLocationByOffset(from,0,1) : BoardModel.getValidBoardLocationByOffset(from,0,-1);
        const rookAsPiece:Piece = gameModel.getBoardSquareContents(rookFrom);
        if(movingPiece.type === PieceType.KING) { // check for threat to king in current, middle, and intended BoardLocations
            moveAllowed = !gameModel.isBoardLocationThreatened(to, movingPiece.color).underThreat
                && !gameModel.isBoardLocationThreatened(from, movingPiece.color).underThreat
                && !gameModel.isBoardLocationThreatened(BoardModel.getValidBoardLocationByOffset(from,0,colDelta/2), movingPiece.color).underThreat
                && this.areIntermediateSquaresEmpty(gameModel, from, rookFrom)
                && rookAsPiece.type === PieceType.ROOK && (rookAsPiece as Rook).canCastle && rookAsPiece.makeMove(gameModel, rookFrom, rookTo, true); // check if rook is there and can make move
        }

        if(!rollback && moveAllowed) {
            rookAsPiece.makeMove(gameModel, rookFrom, rookTo, false); // make the move since we are not rolling back and castling the king is allowed
            // make the move - order is important HERE
            gameModel.setBoardSquareContents(to, movingPiece);
            gameModel.setBoardSquareContents(from, NO_PIECE);
        }
        return moveAllowed;
    }

    private areIntermediateSquaresEmpty(gameModel:GameModel, from: BoardLocation, otherFrom: BoardLocation) {
        let pFrom: ParsedBoardLocation = BoardModel.parseBoardLocation(from);
        let poFrom: ParsedBoardLocation = BoardModel.parseBoardLocation(otherFrom);
        for(let c of openInterval(pFrom.colIndex,poFrom.colIndex)) {
            if(gameModel.getBoardSquareContents(BoardModel.getValidBoardLocationByOffset("a8",pFrom.rowIndex,c)) !== NO_PIECE) {
                return false;
            }
        }
        return true;
    }
}