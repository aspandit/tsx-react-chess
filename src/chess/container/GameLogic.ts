import BoardModel from "../model/BoardModel";
import SquareSelection from "../model/object/Selection";
import GameModel from "../model/GameModel";
import Piece, {NO_PIECE, PieceColor} from "../model/object/Piece";

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
        return piece !== NO_PIECE && GameLogic.isOwnPiece(this.gameModel.turn, piece);
    }

    isSquareOccupiedByOpposingPiece(coord:SquareSelection):boolean {
        const piece:Piece = this.boardModel.getBoardSquareContents(coord);
        return piece !== NO_PIECE && !GameLogic.isOwnPiece(this.gameModel.turn, piece);
    }

    isSquareEmpty(coord:SquareSelection): boolean {
        return this.boardModel.getBoardSquareContents(coord) === NO_PIECE;
    }

    toggleTurn() {
        this.gameModel.toggleTurn();
    }

    movePiece(from:SquareSelection, to:SquareSelection):Piece {
        const piece:Piece = this.boardModel.getBoardSquareContents(from);
        if(piece === NO_PIECE) { // do NOT move anything if piece is not selected
            return NO_PIECE;
        }
        this.boardModel.setBoardSquareContents(from, NO_PIECE);
        this.boardModel.setBoardSquareContents(to, piece);
        return piece;
    }

    get board():Piece[][] {
        return this.boardModel.board;
    }
}