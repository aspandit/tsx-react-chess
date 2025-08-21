import Piece from "../piece/baseclass/Piece";
import Move from "./baseclass/Move";
import {closedInterval, openInterval} from "../../../utils/Utils";
import GameModel from "../../GameModel";

export default class Diagonal extends Move {
    isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return super.isPathShapeCorrect(from,to)
            && closedInterval(from.rowIndex, to.rowIndex).length === closedInterval(from.colIndex, to.colIndex).length;
    }
    getPath(gameModel:GameModel, from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[] {
        const path:Piece[] = [];
        const rows:number[] = openInterval(from.rowIndex, to.rowIndex);
        const cols:number[] = openInterval(from.colIndex, to.colIndex);
        for (let i = 0; i < rows.length; i++) {
            path.push(gameModel.getBoardSquareContentsFromCoords(rows[i],cols[i]));
        }
        return path;
    }
}