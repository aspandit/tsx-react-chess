import BoardModel from "./BoardModel";
import Piece from "./object/piece/baseclass/Piece";

export default class GameModel {
    private _boardModel:BoardModel = new BoardModel();
    private _turn: Turn = "WHITE";

    toggleTurn() {
        if(this.turn.toString() === "WHITE") {
            this.turn = "BLACK";
        }
        else {
            this.turn = "WHITE";
        }
    }

    get turn() {
        return this._turn;
    }

    set turn(turn: Turn) {
        this._turn = turn;
    }

    get board():Piece[][] {
        return this._boardModel.board;
    }

    getBoardSquareContents(coord: BoardLocation) {
        return this._boardModel.getBoardSquareContents(coord);
    }

    setBoardSquareContents(coord: BoardLocation, piece: Piece) {
        this._boardModel.setBoardSquareContents(coord, piece);
    }
}