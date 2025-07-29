import {BoardModel} from "../model/BoardModel";

export class BoardLogic {
    board:BoardModel = new BoardModel();

    static get colCoordinates(){
        return BoardModel.colCoordinates;
    }

    static get rowCoordinates(){
        return BoardModel.rowCoordinates;
    }

    getBoardRow(rowIdx:number):string[] {
        return this.board.getBoardRow(rowIdx);
    }
}