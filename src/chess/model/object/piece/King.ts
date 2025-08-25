import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import OneAdjacent from "../move/OneAdjacent";
import {Direction} from "../Direction";
import GameModel from "../../GameModel";
import Move from "../move/baseclass/Move";
import Castle from "../move/Castle";

export default class King extends Piece {
    private _castle: Move | null;

    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.KING, color, initialSquare);
        this._moves.push(new OneAdjacent(false, false, false, Direction.EITHER));
        // we need clearPathOptional to be true since the rook will be in the path and check the path is clear manually
        this._castle = new Castle(false, true, true, Direction.EITHER);
    }

    makeMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation, rollback: boolean): boolean {
        if(super.makeMove(gameModel, from, to, rollback)) {
            if(!rollback) {
                gameModel.updateKingLocation(this,to);
                this._castle = null;
            }
            return true;
        }

        if(this._castle && this._castle.makeMove(gameModel, from, to, rollback)) {
            if(!rollback) {
                gameModel.updateKingLocation(this,to);
                this._castle = null;
            }
            return true;
        }

        return false;
    }
}