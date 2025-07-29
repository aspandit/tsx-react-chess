import {BoardModel} from "../model/BoardModel";

export class BoardLogic {
    board:BoardModel = new BoardModel();

    static get colCoordinates():string[] {
        return BoardModel.colCoordinates;
    }

    static get rowCoordinates():string[] {
        return BoardModel.rowCoordinates;
    }

    getBoardRow(rowIdx:number):string[] {
        return this.board.getBoardRow(rowIdx);
    }
}