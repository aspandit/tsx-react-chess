import Piece from "../piece/baseclass/Piece";
import Move from "./baseclass/Move";
import {openInterval} from "../../../utils/Utils";
import GameModel from "../../GameModel";

export default class LShape extends Move {
    isPathShapeCorrect(from: ParsedBoardLocation, to: ParsedBoardLocation): boolean {
        return super.isPathShapeCorrect(from,to)
            && ((Math.abs(from.rowIndex-to.rowIndex) == 2 && Math.abs(from.colIndex-to.colIndex) == 1)
                || (Math.abs(from.rowIndex-to.rowIndex) == 1 && Math.abs(from.colIndex-to.colIndex) == 2));
    }
    getPath(gameModel:GameModel, from: ParsedBoardLocation, to: ParsedBoardLocation): Piece[] {
        let path:Piece[] = [];
        for(let r of openInterval(from.rowIndex, to.rowIndex)) {
            path.push(gameModel.getBoardSquareContentsFromCoords(r,to.colIndex));
        }
        for(let c of openInterval(from.colIndex, to.colIndex)) {
            path.push(gameModel.getBoardSquareContentsFromCoords(to.rowIndex,c));
        }
        return path;
    }
}