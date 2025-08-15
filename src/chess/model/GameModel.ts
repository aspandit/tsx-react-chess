import BoardModel from "./BoardModel";
import Piece, {PieceColor, PieceType} from "./object/piece/baseclass/Piece";
import Pawn from "./object/piece/Pawn";
import King from "./object/piece/King";

export default class GameModel {
    private readonly _boardModel: BoardModel;
    private _player: Player;
    private _enPassantPawns: { [key in PieceColor]: Pawn[] }; // manages the pawns with en passant capabilities

    constructor() {
        this._boardModel = new BoardModel();
        this._player = "WHITE";
        this._enPassantPawns = {
            [PieceColor.WHITE]: [],
            [PieceColor.BLACK]: [],
            [PieceColor.NO_COLOR]: [],
        };
    }

    /**
     * Called after turn is complete.
     */
    toggleTurn() {
        if (this.player.toString() === "WHITE") {
            this.player = "BLACK";
            // remove en passant for white pawns in array and clear array
            for(let pawn of this._enPassantPawns[PieceColor.WHITE]) {
                pawn.clearEnPassant();
            }
        } else {
            this.player = "WHITE";
            // remove en passant for black pawns in array and clear array
            for(let pawn of this._enPassantPawns[PieceColor.BLACK]) {
                pawn.clearEnPassant();
            }
        }
    }

    get player() {
        return this._player;
    }

    set player(player: Player) {
        this._player = player;
    }

    get boardCopy() {
        return this._boardModel.boardCopy;
    }

    getBoardSquareContents(coord: BoardLocation) {
        return this._boardModel.getBoardSquareContents(coord);
    }

    getBoardSquareContentsFromCoords(row: number,col: number) {
        return this._boardModel.getBoardSquareContents(BoardModel.colCoordinates[col] + BoardModel.rowCoordinates[row] as BoardLocation);
    }

    setBoardSquareContents(coord: BoardLocation, piece: Piece) {
        this._boardModel.setBoardSquareContents(coord, piece);
    }

    assignToEnPassant(piece: Piece) {
        // Route to correct array
        if(piece.type === PieceType.PAWN) {
            if(piece.color === PieceColor.WHITE) {
                this._enPassantPawns[PieceColor.WHITE].push(piece as Pawn);
            }
            else {
                this._enPassantPawns[PieceColor.BLACK].push(piece as Pawn);
            }
            // TODO add error checking for PieceColor.NO_COLOR
        }
    }

    updateKingLocation(king: King, to: BoardLocation) {
        this._boardModel.updateKingLocation(king,to);
    }
}