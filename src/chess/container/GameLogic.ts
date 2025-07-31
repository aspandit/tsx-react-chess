import BoardModel from "../model/BoardModel";
import SquareSelection from "../model/object/Selection";
import GameModel from "../model/GameModel";
import Piece, {PieceColor} from "../model/object/piece/Piece";
import {EMPTY_SQUARE} from "../model/object/piece/NoPiece";

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

    isSquareOccupiedByOwnPiece(coord:SquareSelection):boolean {
        const piece:Piece = this.boardModel.getBoardSquareContents(coord);
        return piece !== EMPTY_SQUARE && GameLogic.isOwnPiece(this.gameModel.turn, piece);
    }

    isSquareOccupiedByOpposingPiece(coord:SquareSelection):boolean {
        const piece:Piece = this.boardModel.getBoardSquareContents(coord);
        return piece !== EMPTY_SQUARE && !GameLogic.isOwnPiece(this.gameModel.turn, piece);
    }

    isSquareEmpty(coord:SquareSelection): boolean {
        return this.boardModel.getBoardSquareContents(coord) === EMPTY_SQUARE;
    }

    toggleTurn() {
        this.gameModel.toggleTurn();
    }

    movePiece(from:SquareSelection, to:SquareSelection):Piece {
        const piece:Piece = this.boardModel.getBoardSquareContents(from);
        if(piece === EMPTY_SQUARE) { // do NOT move anything if piece is not selected
            return EMPTY_SQUARE;
        }
        this.boardModel.setBoardSquareContents(from, EMPTY_SQUARE);
        this.boardModel.setBoardSquareContents(to, piece);
        return piece;
    }

    get board():Piece[][] {
        return this.boardModel.board;
    }
}