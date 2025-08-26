import BoardModel from "../model/BoardModel";
import GameModel from "../model/GameModel";
import Piece, {PieceColor, PieceType} from "../model/object/piece/baseclass/Piece";
import {NO_PIECE} from "../model/object/piece/NoPiece";
import {capitalizeFirstLetter, isEqual} from "../utils/Utils";

export class GameLogic {
    private readonly _gameModel:GameModel = new GameModel();
    private _selection: BoardLocation = "";
    private _promotingPawnLocation: BoardLocation = "";

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

    get waitOnPawnPromotion():boolean {
        return this._promotingPawnLocation !== "";
    }

    get promotingPawnLocation():BoardLocation {
        return this._promotingPawnLocation;
    }

    get currPlayer():Player {
        return this._gameModel.player;
    }

    get info() {
        const checkedPlayer:string = this._gameModel.checkedPlayer != "" ? capitalizeFirstLetter(this._gameModel.checkedPlayer) + " is in check." : "";
        const winner:string = this._gameModel.gameOver && this._gameModel.winner != "" ? capitalizeFirstLetter(this._gameModel.winner) + " wins." : "";
        const stalemate:string = this._gameModel.gameOver && this._gameModel.winner == "" ? "This match concluded in a stalemate." : "";
        const info = [winner, stalemate, checkedPlayer].find((str:string):boolean => str !== "");

        return info ? info : capitalizeFirstLetter(this._gameModel.player) + " to move.";
    }

    selectSquare(coords: BoardLocation): BoardLocation {
        if(this._gameModel.gameOver) {
            return ""; // if game is over, do not allow for any more moves
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

    promotePawn(color:PieceColor, type:PieceType):void {
        if(this._gameModel.promotePawn(color, type, this._promotingPawnLocation)) {
            this._promotingPawnLocation = "";
            this._gameModel.toggleTurn();
        }
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
        if(!isEqual(piece,NO_PIECE) && piece.makeMove(this._gameModel,from,to,false)) {
            if(!this.checkForPawnPromotion()) { // do NOT toggle turn here during pawn promotion
                this.toggleTurn();
            }
            return true; // TODO make piece object for presentation/container; return captured piece or no piece to UI
        }
        return false;
    }

    private checkForPawnPromotion():boolean {
        for(let c of BoardModel.colCoordinates) {
            const potentialWhitePawn:Piece = this._gameModel.getBoardSquareContents(c+"8" as BoardLocation);
            if(potentialWhitePawn.type === PieceType.PAWN && potentialWhitePawn.color === PieceColor.WHITE) {
                this._promotingPawnLocation = c+"8" as BoardLocation;
            }

            const potentialBlackPawn:Piece = this._gameModel.getBoardSquareContents(c+"1" as BoardLocation);
            if(potentialBlackPawn.type === PieceType.PAWN && potentialBlackPawn.color === PieceColor.BLACK) {
                this._promotingPawnLocation = c+"1" as BoardLocation;
            }
        }
        return this._promotingPawnLocation !== "";
    }

    private toggleTurn() {
        this._gameModel.toggleTurn();
    }
}