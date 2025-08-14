import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import OneAdjacent from "./move/OneAdjacent";
import {Direction} from "../Direction";
import GameModel from "../../GameModel";

export default class King extends Piece {
    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.KING, color, initialSquare);
        this._moves.push(new OneAdjacent(false, false, false, Direction.EITHER));
    }

    makeMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation): boolean {
        if(super.makeMove(gameModel, from, to)) {
            gameModel.updateKingLocation(this,to);
            return true;
        }
        return false;
    }
}