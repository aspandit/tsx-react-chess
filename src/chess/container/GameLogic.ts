import BoardModel from "../model/BoardModel";
import SquareSelection from "../model/object/Selection";
import GameModel from "../model/GameModel";

export class GameLogic {
    boardModel:BoardModel = new BoardModel();
    gameModel:GameModel = new GameModel();

    static get colCoordinates():string[] {
        return [...BoardModel.colCoordinates];
    }

    static get rowCoordinates():string[] {
        return [...BoardModel.rowCoordinates];
    }

    static isOwnPiece(turn:Turn,piece:string):boolean {
        return turn === BoardModel.getPieceColor(piece);
    }

    isSquareOccupiedByOwnPiece(coord:SquareSelection):boolean {
        const piece:string = this.boardModel.getBoardSquareContents(coord);
        return piece !== "" && GameLogic.isOwnPiece(this.gameModel.turn, piece);
    }

    isSquareOccupiedByOpposingPiece(coord:SquareSelection):boolean {
        const piece:string = this.boardModel.getBoardSquareContents(coord);
        return piece !== "" && !GameLogic.isOwnPiece(this.gameModel.turn, piece);
    }

    isSquareEmpty(coord:SquareSelection): boolean {
        return this.boardModel.getBoardSquareContents(coord) === "";
    }

    toggleTurn() {
        this.gameModel.toggleTurn();
    }

    movePiece(from:SquareSelection, to:SquareSelection):string {
        const piece:string = this.boardModel.getBoardSquareContents(from);
        if(piece === "") { // do NOT move anything if piece is not selected
            return "";
        }
        this.boardModel.setBoardSquareContents(from, "");
        this.boardModel.setBoardSquareContents(to, piece);
        return piece;
    }

    get board():string[][] {
        return this.boardModel.board;
    }
}