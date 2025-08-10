import BoardModel from "../model/BoardModel";
import GameModel from "../model/GameModel";
import Piece, {PieceColor} from "../model/object/piece/baseclass/Piece";
import {NO_PIECE} from "../model/object/piece/NoPiece";
import {isEqual} from "../utils/Utils";

// TODO add check for check and checkmate after each move
// TODO handle checkmate/end game
// TODO add Castle move with check for check in castled king squares
export class GameLogic {
    private readonly _gameModel:GameModel = new GameModel();

    static get colCoordinates():string[] {
        return [...BoardModel.colCoordinates];
    }

    static get rowCoordinates():string[] {
        return [...BoardModel.rowCoordinates];
    }

    static isOwnPiece(player:Player, piece:Piece):boolean {
        return player === PieceColor[piece.color];
    }

    isSquareOccupiedByOwnPiece(coord:BoardLocation):boolean {
        const piece:Piece = this._gameModel.getBoardSquareContents(coord);
        return piece !== NO_PIECE && GameLogic.isOwnPiece(this._gameModel.player, piece);
    }

    isSquareOccupiedByOpposingPiece(coord:BoardLocation):boolean {
        const piece:Piece = this._gameModel.getBoardSquareContents(coord);
        return piece !== NO_PIECE && !GameLogic.isOwnPiece(this._gameModel.player, piece);
    }

    isSquareEmpty(coord:BoardLocation): boolean {
        return this._gameModel.getBoardSquareContents(coord) === NO_PIECE;
    }

    movePiece(from:BoardLocation, to:BoardLocation):boolean {
        const piece:Piece = this._gameModel.getBoardSquareContents(from);
        if(!isEqual(piece,NO_PIECE) && piece.makeMove(this._gameModel,from,to)) {
            this.toggleTurn();
            return true; // TODO make piece object for presentation/container; return captured piece or no piece to UI
        }
        return false; // TODO think about passing back more info for this case(no move made)
    }

    get boardStringView():string[][] {
        const bsv:string[][] = [];

        for(const row of this._gameModel.board) {
            const arr:string[] = [];
            for(const sq of row) {
                arr.push(sq.label)
            }
            bsv.push(arr);
        }

        return bsv;
    }

    private toggleTurn() {
        this._gameModel.toggleTurn();
    }
}