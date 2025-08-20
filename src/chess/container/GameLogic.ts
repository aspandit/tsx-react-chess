import BoardModel from "../model/BoardModel";
import GameModel from "../model/GameModel";
import Piece, {PieceColor} from "../model/object/piece/baseclass/Piece";
import {NO_PIECE} from "../model/object/piece/NoPiece";
import {capitalizeFirstLetter, isEqual} from "../utils/Utils";

// TODO add Castle move with check for check in castled king squares
// TODO add pawn promotion
export class GameLogic {
    private readonly _gameModel:GameModel = new GameModel();
    private _selection: BoardLocation = "";

    static get colCoordinates():string[] {
        return [...BoardModel.colCoordinates];
    }

    static get rowCoordinates():string[] {
        return [...BoardModel.rowCoordinates];
    }

    private static isOwnPiece(player:Player, piece:Piece):boolean {
        return player === PieceColor[piece.color];
    }

    get boardStringView():string[][] {
        const bsv:string[][] = [];

        for(const row of this._gameModel.boardCopy) {
            const arr:string[] = [];
            for(const sq of row) {
                arr.push(sq.label)
            }
            bsv.push(arr);
        }

        return bsv;
    }

    get info() {
        const currPlayer:string = capitalizeFirstLetter(this._gameModel.player) + " to move.";
        const checkedPlayer:string = this._gameModel.checkedPlayer != "" ? capitalizeFirstLetter(this._gameModel.checkedPlayer) + " is in check." : "";
        const winner:string = this._gameModel.winner != "" ? capitalizeFirstLetter(this._gameModel.winner) + " wins." : "";
        const stalemate:string = this._gameModel.gameOver ? "This match concluded in a stalemate." : "";
        return [winner, stalemate, checkedPlayer, currPlayer].find((str:string):boolean => str !== "");
    }

    selectSquare(coords: BoardLocation): BoardLocation {
        if(this._gameModel.gameOver) {
            return "";
        }

        if(this._selection === ""){ // no square was previously selected
            if(this.isSquareOccupiedByOwnPiece(coords)) { // initially selected square must have the player's own piece on it
                this._selection = coords;
            }
        }
        else if(this._selection === coords) { // the previously selected square was clicked again
            this._selection = "";
        }
        else {
            if(this.isSquareOccupiedByOwnPiece(coords)) { // set selection to another square with own piece if it was clicked
                this._selection = coords;
            }
            else { // don't try to move piece unless destination square is empty or has opposing piece
                if (this.movePiece(this._selection, coords)) {
                    this._selection = "";
                }
            }
        }

        return this._selection;
    }

    private isSquareOccupiedByOwnPiece(coord:BoardLocation):boolean {
        const piece:Piece = this._gameModel.getBoardSquareContents(coord);
        return !isEqual(piece, NO_PIECE) && GameLogic.isOwnPiece(this._gameModel.player, piece);
    }

    private isSquareOccupiedByOpposingPiece(coord:BoardLocation):boolean {
        const piece:Piece = this._gameModel.getBoardSquareContents(coord);
        return !isEqual(piece, NO_PIECE) && !GameLogic.isOwnPiece(this._gameModel.player, piece);
    }

    private isSquareEmpty(coord:BoardLocation): boolean {
        return isEqual(this._gameModel.getBoardSquareContents(coord),NO_PIECE);
    }

    private movePiece(from:BoardLocation, to:BoardLocation):boolean {
        const piece:Piece = this._gameModel.getBoardSquareContents(from);
        if(!isEqual(piece,NO_PIECE) && piece.makeMove(this._gameModel,from,to)) {
            this.toggleTurn();
            return true; // TODO make piece object for presentation/container; return captured piece or no piece to UI
        }
        return false; // TODO think about passing back more info for this case(no move made)
        /* TODO Pass back result object instead of boolean: moveMade:boolean, catpturedPiece:Piece, noMoveReason:string */
    }

    private toggleTurn() {
        this._gameModel.toggleTurn();
    }
}