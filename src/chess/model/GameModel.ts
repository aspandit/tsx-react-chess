import BoardModel from "./BoardModel";
import Piece, {PieceColor, PieceType} from "./object/piece/baseclass/Piece";
import Pawn from "./object/piece/Pawn";
import King from "./object/piece/King";
import {NO_PIECE} from "./object/piece/NoPiece";
import {isEqual} from "../utils/Utils";
import {Direction} from "./object/Direction";

export default class GameModel {
    private readonly _boardModel: BoardModel;
    private _player: Player;
    private readonly _enPassantPawns: { [key in PieceColor]: Pawn[] }; // manages the pawns with en passant capabilities
    private _gameOver: boolean;
    private _checkedPlayer: Player | "";
    private _winner: Player | "";

    constructor() {
        this._gameOver = false;
        this._checkedPlayer = "";
        this._winner = "";
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

        this.checkForCheck();
    }

    checkForCheck() {
        const currColor:PieceColor = this.player === "WHITE" ? PieceColor.WHITE : PieceColor.BLACK;
        if(this.isBoardLocationThreatened(this.getKingLocation(),currColor)) {
            this._checkedPlayer = this.player;
        }
        else {
            this._checkedPlayer = "";
        }
    }

    endGame(winner: Player): void {
        this._gameOver = true;
        this._winner = winner;
    }

    get winner(): Player | "" {
        return this._winner;
    }

    get gameOver() {
        return this._gameOver;
    }

    get player() {
        return this._player;
    }

    get checkedPlayer() {
        return this._checkedPlayer;
    }

    set player(player: Player) {
        this._player = player;
    }

    get boardCopy() {
        return this._boardModel.boardCopy;
    }

    getKingLocation() {
        return this._boardModel.getKingLocation(this.player);
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

    /**
     * Determines if square is a threat on location for locationColor in the current gameModel
     * @param location
     * @param locationColor
     */
    isBoardLocationThreatened(location:BoardLocation,locationColor:PieceColor):boolean {
        return this.isThreatenedDiagonally(location,locationColor) || this.isThreatenedStraight(location,locationColor) || this.isThreatenedLShaped(location,locationColor);
    }

    private isThreatenedDiagonally(location:BoardLocation,locationColor:PieceColor):boolean {
        const piecesNOffset:[number,Piece][] = [];
        const oppColor:PieceColor = locationColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE; // TODO add error for NO_COLOR

        // Get Piece or no piece in all four diagonal directions
        for(let delta:number = 0; delta < 4; delta++) {
            // Get all four combinations of directions here
            const rdir:number = delta % 2 == 1 ? 1 : -1;
            const cdir:number = Math.trunc(delta/2) % 2 == 1 ? 1 : -1;
            for (let offset: number = 1; offset < 8; offset++) {
                const loc = BoardModel.getValidBoardLocationByOffset(location, rdir*offset, cdir*offset);
                if (loc != "") {
                    const piece: Piece = this.getBoardSquareContents(loc);
                    if (piece.type !== PieceType.NO_TYPE) {
                        piecesNOffset.push([offset, piece]);
                        break; // got the terminal piece in this direction; now break out of for loop
                    }
                }
                else {
                    break; // once an invalid location is encountered in this direction, we can change directions
                }
            }
        }

        // For each piece/offset, check if Piece is threat
            // return true or false accordingly
        for(let [offset,piece] of piecesNOffset) {
            if(!isEqual(piece,NO_PIECE) && piece.color === oppColor) {
                if (piece.type === PieceType.PAWN) {
                    if(offset === Direction.TO_BLACK_SIDE && piece.color === PieceColor.WHITE) {
                        return true;
                    }

                    if(offset === Direction.TO_WHITE_SIDE && piece.color === PieceColor.BLACK) {
                        return true;
                    }
                }
                else if(piece.type === PieceType.QUEEN || piece.type === PieceType.BISHOP) {
                    return true;
                }
            }
        }

        return false;
    }

    private isThreatenedStraight(location:BoardLocation,locationColor:PieceColor):boolean {
        const pieces:Piece[] = [];
        const oppColor:PieceColor = locationColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE; // TODO add error for NO_COLOR

        // Get Piece or no piece in all four straight directions
        for(let delta:number = 0; delta < 4; delta++) {
            // Get all four combinations of directions here
            const dir:number = delta % 2 == 1 ? 1 : -1;
            const [mag,oppmag] = Math.trunc(delta/2) % 2 == 1 ? [1,0] : [0,1];
            for (let offset: number = 1; offset < 8; offset++) {
                const loc = BoardModel.getValidBoardLocationByOffset(location, mag*dir*offset, oppmag*dir*offset);
                if (loc != "") {
                    const piece: Piece = this.getBoardSquareContents(loc);
                    if (piece.type !== PieceType.NO_TYPE) {
                        pieces.push(piece);
                        break; // got the terminal piece in this direction; now break out of for loop
                    }
                }
                else {
                    break; // once an invalid location is encountered in this direction, we can change directions
                }
            }
        }

        // For each piece, check if Piece is threat
            // return true or false accordingly
        for(let piece of pieces) {
            if(!isEqual(piece,NO_PIECE) && piece.color === oppColor) {
                if(piece.type === PieceType.QUEEN || piece.type === PieceType.ROOK) {
                    return true;
                }
            }
        }

        return false;
    }

    private isThreatenedLShaped(location:BoardLocation,locationColor:PieceColor):boolean {
        const locs = BoardModel.getValidLShapedOffsets(location);
        const oppColor:PieceColor = locationColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE; // TODO add error for NO_COLOR
        for(let offsetLoc of locs) {
            const piece:Piece = this.getBoardSquareContents(offsetLoc);
            if(piece.type === PieceType.KNIGHT
                && piece.color === oppColor) {
                return true;
            }
        }
        return false;
    }
}