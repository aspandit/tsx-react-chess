import BoardModel from "../model/BoardModel";
import GameModel from "../model/GameModel";
import Piece, {PieceColor} from "../model/object/piece/baseclass/Piece";
import {NO_PIECE} from "../model/object/piece/NoPiece";
import {isEqual} from "../utils/Utils";

export class GameLogic {
    boardModel:BoardModel = new BoardModel();
    gameModel:GameModel = new GameModel();

    static get colCoordinates():string[] {
        return [...BoardModel.colCoordinates];
    }

    static get rowCoordinates():string[] {
        return [...BoardModel.rowCoordinates];
    }

    static isOwnPiece(turn:Turn,piece:Piece):boolean {
        return turn === PieceColor[piece.color];
    }

    isSquareOccupiedByOwnPiece(coord:Coordinate):boolean {
        const piece:Piece = this.boardModel.getBoardSquareContents(coord);
        return piece !== NO_PIECE && GameLogic.isOwnPiece(this.gameModel.turn, piece);
    }

    isSquareOccupiedByOpposingPiece(coord:Coordinate):boolean {
        const piece:Piece = this.boardModel.getBoardSquareContents(coord);
        return piece !== NO_PIECE && !GameLogic.isOwnPiece(this.gameModel.turn, piece);
    }

    isSquareEmpty(coord:Coordinate): boolean {
        return this.boardModel.getBoardSquareContents(coord) === NO_PIECE;
    }

    movePiece(from:Coordinate, to:Coordinate):boolean {
        const piece:Piece = this.boardModel.getBoardSquareContents(from);
        // TODO Add logic in if condition that checks gameModel for conditions for castling, en passant, and two moves ahead for pawn
        if(!isEqual(piece,NO_PIECE) && piece.isMoveValid(this.boardModel.board,from,to)) {
            this.boardModel.setBoardSquareContents(from, NO_PIECE);
            this.boardModel.setBoardSquareContents(to, piece);
            this.toggleTurn();
            return true; // TODO make piece object for presentation/container; return captured piece or no piece to UI
        }
        return false; // TODO think about passing back more info for this case(no move made)
    }

    get boardStringView():string[][] {
        const bsv:string[][] = [];

        for(const row of this.boardModel.board) {
            const arr:string[] = [];
            for(const sq of row) {
                arr.push(sq.label)
            }
            bsv.push(arr);
        }

        return bsv;
    }

    private toggleTurn() {
        this.gameModel.toggleTurn();
    }
}