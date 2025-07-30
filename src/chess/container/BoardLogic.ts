import {BoardModel} from "../model/BoardModel";
import SquareSelection from "../model/object/Selection";

export class BoardLogic {
    boardModel:BoardModel = new BoardModel();

    static get colCoordinates():string[] {
        return BoardModel.colCoordinates;
    }

    static get rowCoordinates():string[] {
        return BoardModel.rowCoordinates;
    }

    isSquareOccupied(coord:SquareSelection):boolean {
        const piece:string = this.boardModel.getBoardSquareContents(coord);
        return piece !== "";
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