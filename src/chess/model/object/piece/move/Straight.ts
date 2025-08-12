import Piece from "../baseclass/Piece";
import Move from "./baseclass/Move";
import {openInterval, xor} from "../../../../utils/Utils";
import GameModel from "../../../GameModel";

export default class Straight extends Move {
    isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return super.isPathShapeCorrect(from,to)
                && xor((from.colIndex - to.colIndex === 0),(from.rowIndex - to.rowIndex === 0));
    }
    getPath(gameModel: GameModel, from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[] {
        const path:Piece[] = [];
        const rows:number[] = openInterval(from.rowIndex, to.rowIndex);
        const cols:number[] = openInterval(from.colIndex, to.colIndex);
        if(from.colIndex == to.colIndex) {
            for (let i = 0; i < rows.length; i++) {
                path.push(gameModel.getBoardSquareContentsFromCoords(rows[i],to.colIndex));
            }
        }
        if(from.rowIndex == to.rowIndex) {
            for (let i = 0; i < cols.length; i++) {
                path.push(gameModel.getBoardSquareContentsFromCoords(to.rowIndex,cols[i]));
            }
        }
        return path;
    }

}