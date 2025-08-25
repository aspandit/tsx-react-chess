import Piece, {PieceColor, PieceType} from "./baseclass/Piece";
import {Direction} from "../Direction";
import Straight from "../move/Straight";
import GameModel from "../../GameModel";

export default class Rook extends Piece {
    private _canCastle: boolean;

    constructor(color: PieceColor, initialSquare: BoardLocation) {
        super(PieceType.ROOK, color, initialSquare);
        this._moves.push(new Straight(false, false, false, Direction.EITHER));
        this._canCastle = true;
    }

    makeMove(gameModel: GameModel, from: BoardLocation, to: BoardLocation, rollback: boolean): boolean {
        if(super.makeMove(gameModel, from, to, rollback)) {
            if(!rollback) {
                this._canCastle = false;
            }
            return true;
        }
        return false;
    }

    get canCastle() {
        return this._canCastle;
    }
}