import BoardModel from "./BoardModel";
import Piece, {PieceColor, PieceType} from "./object/piece/baseclass/Piece";
import Pawn from "./object/piece/Pawn";
import King from "./object/piece/King";
import {NO_PIECE} from "./object/piece/NoPiece";
import {isEqual} from "../utils/Utils";
import {Direction} from "./object/Direction";
import ThreatStatus, {Threat} from "../container/object/ThreatStatus";

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
        const oppPlayer = this.player;
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

        const currColor: PieceColor = this.player.toString() === "WHITE" ? PieceColor.WHITE : PieceColor.BLACK;
        const ts:ThreatStatus = this.checkForCheck();
        if(ts.underThreat) {
            // Check for checkmate condition
             if(!( // NOT the OR of the three conditions below
                // 1) can the checking piece be captured AND, if so, will that release the current player from check
                 this.canCheckingPieceBeCaptured(ts)
                // 2) can the current player's king be moved out of check
                || this.canKingMoveOutOfCheck(this.getBoardSquareContents(this.getKingLocation()),this.getKingLocation())
                // 3) can the current player move another piece to block the checking piece
                || this.canCheckBeBlocked(currColor,ts)
             )) {
                 this.endMatch(oppPlayer);
             }
        }
        else {
            // Check for stalemate condition - TODO this is inefficient, but works: refactor at some point
            const board: Piece[][] = this.boardCopy;
            for(let r: number = 0;r < board.length;r++) {
                for(let c: number = 0;c < board[r].length;c++) {
                    const piece: Piece = board[r][c];
                    if(piece.color === currColor) {
                        const loc: BoardLocation = BoardModel.getValidBoardLocationByOffset("a8",r,c); // offsets of row and columns are from top left square
                        const moves:BoardLocation[] = piece.type === PieceType.KNIGHT
                            ? BoardModel.getValidLShapedOffsets(loc)
                            : [BoardModel.getValidBoardLocationByOffset(loc,-1,1),
                                BoardModel.getValidBoardLocationByOffset(loc,1,-1),
                                BoardModel.getValidBoardLocationByOffset(loc,-1,-1),
                                BoardModel.getValidBoardLocationByOffset(loc,1,1),
                                BoardModel.getValidBoardLocationByOffset(loc,-1,0),
                                BoardModel.getValidBoardLocationByOffset(loc,0,1),
                                BoardModel.getValidBoardLocationByOffset(loc,0,-1),
                                BoardModel.getValidBoardLocationByOffset(loc,1,0)] // this is all eight square around the current location;
                                                                                                        // a piece needs to move at least one square
                                                                                                        // away to be able to move more than one square away
                                .filter((bl:BoardLocation): boolean => bl != "");
                        for(let mv of moves) {
                            if (piece.makeMove(this, loc, mv, true)) {
                                return; // as soon as a legal move is found, break out of method (do NOT end match)
                            }
                        }
                    }
                }
            }
            this.endMatch(""); // end in stalemate - TODO TEST THIS "STALEMATE" CASE
        }
    }

    /**
     * Checks if the current player is in check and returns true if so. This method should be called after
     * the turn is over.
     */
    checkForCheck():ThreatStatus {
        const currColor:PieceColor = this.player === "WHITE" ? PieceColor.WHITE : PieceColor.BLACK;
        const ts:ThreatStatus = this.isBoardLocationThreatened(this.getKingLocation(),currColor);
        if(ts.underThreat) {
            this._checkedPlayer = this.player;
            return ts;
        }
        else {
            this._checkedPlayer = "";
            return new ThreatStatus(false,this.getKingLocation(),Piece.getPlayer(currColor));
        }
    }

    endMatch(winner: Player | ""): void {
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
     * Determines if square is under threat for a particular location and locationColor in the current gameModel. Use this to ensure
     * the current move is not putting the current player into check or to see if the latest move put the current player into check.
     * @param location
     * @param locationColor
     */
    isBoardLocationThreatened(location:BoardLocation,locationColor:PieceColor):ThreatStatus {
        let diagonally:ThreatStatus = this.isThreatenedDiagonally(location,locationColor);
        let straight:ThreatStatus = this.isThreatenedStraight(location,locationColor);
        let lShaped:ThreatStatus = this.isThreatenedLShaped(location,locationColor);

        if(diagonally.underThreat || straight.underThreat || lShaped.underThreat) {
            const threat:ThreatStatus = new ThreatStatus(true, location, Piece.getPlayer(locationColor));

            threat.merge([diagonally,straight,lShaped]);

            return threat;
        }
        return new ThreatStatus(false, location, locationColor == PieceColor.WHITE ? "WHITE" : "BLACK");
    }

    private isThreatenedDiagonally(location:BoardLocation,locationColor:PieceColor):ThreatStatus {
        const piecesNOffset:[number,Piece,BoardLocation,BoardLocation[]][] = [];
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
                        piecesNOffset.push([rdir*offset, piece, loc, BoardModel.getDiagonalBoardLocations(location,rdir*offset,cdir*offset)]);
                        break; // got the terminal piece in this direction; now break out of for loop
                    }
                }
                else {
                    break; // once an invalid location is encountered in this direction, we can change directions
                }
            }
        }

        const threats:Threat[] = [];

        // For each piece/offset, check if Piece is threat
        for(let [roffset,piece,threatLocation,threatPath] of piecesNOffset) {
            if(!isEqual(piece,NO_PIECE) && piece.color === oppColor) {
                if (piece.type === PieceType.PAWN) {
                    if(roffset === Direction.TO_BLACK_SIDE && piece.color === PieceColor.WHITE) {
                        threats.push(new Threat(threatLocation,piece.type,threatPath));
                    }

                    if(roffset === Direction.TO_WHITE_SIDE && piece.color === PieceColor.BLACK) {
                        threats.push(new Threat(threatLocation,piece.type,threatPath));
                    }
                }
                else if(piece.type === PieceType.QUEEN || piece.type === PieceType.BISHOP) {
                    threats.push(new Threat(threatLocation,piece.type,threatPath));
                }
                else if(piece.type === PieceType.KING) {
                    threats.push(new Threat(threatLocation,piece.type,threatPath));
                }
            }
        }

        if(threats.length > 0) {
            let ts:ThreatStatus = new ThreatStatus(true, location, Piece.getPlayer(locationColor));
            ts.addThreats(threats);
            return ts;
        }

        return new ThreatStatus(false, location, Piece.getPlayer(locationColor));
    }

    private isThreatenedStraight(location:BoardLocation,locationColor:PieceColor):ThreatStatus {
        const pieces:[Piece,BoardLocation,BoardLocation[]][] = [];
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
                        pieces.push([piece,loc,BoardModel.getStraightBoardLocations(location, mag*dir*offset, oppmag*dir*offset)]);
                        break; // got the terminal piece in this direction; now break out of for loop
                    }
                }
                else {
                    break; // once an invalid location is encountered in this direction, we can change directions
                }
            }
        }

        const threats:Threat[] = [];

        // For each piece, check if Piece is threat
        for(let [piece,threatLocation,threatPath] of pieces) {
            if(!isEqual(piece,NO_PIECE) && piece.color === oppColor) {
                if(piece.type === PieceType.QUEEN || piece.type === PieceType.ROOK) {
                    threats.push(new Threat(threatLocation,piece.type,threatPath));
                }
            }
        }

        if(threats.length > 0) {
            let ts:ThreatStatus = new ThreatStatus(true, location, Piece.getPlayer(locationColor));
            ts.addThreats(threats);
            return ts;
        }

        return new ThreatStatus(false, location, Piece.getPlayer(locationColor));
    }

    private isThreatenedLShaped(location:BoardLocation,locationColor:PieceColor):ThreatStatus {
        const locs = BoardModel.getValidLShapedOffsets(location);
        const oppColor:PieceColor = locationColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE; // TODO add error for NO_COLOR
        const threats:Threat[] = [];
        for(let offsetLoc of locs) {
            const piece:Piece = this.getBoardSquareContents(offsetLoc);
            if(piece.type === PieceType.KNIGHT
                && piece.color === oppColor) {
                threats.push(new Threat(offsetLoc,piece.type,[])); // for a knight, the path doesn't matter since they can jump over pieces
            }
        }
        if(threats.length > 0) {
            const ts:ThreatStatus = new ThreatStatus(true, location, Piece.getPlayer(locationColor));
            ts.addThreats(threats);
            return ts;
        }
        return new ThreatStatus(false, location, Piece.getPlayer(locationColor));
    }

    static flipPlayertoOppositePieceColor(p:Player):PieceColor {
        return p == "BLACK" ? PieceColor.WHITE : PieceColor.BLACK;
    }

    /**
     * Assumes the king is under threat
     * @param ts the threat status object for current king threat
     * @private
     */
    private canCheckingPieceBeCaptured(ts:ThreatStatus):boolean {
        if(ts.threatInfo?.threats.length == 1) {
            const threatLocation: BoardLocation = ts.threatInfo.threats[0].threatLocation;
            const threateningPlayerTS: ThreatStatus = this.isBoardLocationThreatened(threatLocation,
                GameModel.flipPlayertoOppositePieceColor(ts.threatInfo.threatenedPlayer));
            const to: BoardLocation = threateningPlayerTS.threatInfo ? threateningPlayerTS.threatInfo?.threatenedLocation : "";
            if(to != "" && threateningPlayerTS.threatInfo && threateningPlayerTS.threatInfo?.threats.length > 0) {
                for (let t of threateningPlayerTS.threatInfo?.threats) { // cycle through threats to piece threatening the king
                    const from: BoardLocation = t.threatLocation;
                    const potentialCapPiece: Piece = this.getBoardSquareContents(t.threatLocation);
                    if (potentialCapPiece.makeMove(this,from,to,true)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private canKingMoveOutOfCheck(king: Piece,location:BoardLocation):boolean {
        const adjs:BoardLocation[] = [BoardModel.getValidBoardLocationByOffset(location,-1,1),
                                        BoardModel.getValidBoardLocationByOffset(location,1,-1),
                                        BoardModel.getValidBoardLocationByOffset(location,-1,-1),
                                        BoardModel.getValidBoardLocationByOffset(location,1,1),
                                        BoardModel.getValidBoardLocationByOffset(location,-1,0),
                                        BoardModel.getValidBoardLocationByOffset(location,0,1),
                                        BoardModel.getValidBoardLocationByOffset(location,0,-1),
                                        BoardModel.getValidBoardLocationByOffset(location,1,0)]
                                    .filter(loc => loc != "");

        for(let to of adjs) {
            if(king.makeMove(this,location,to,true)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Assumes king is under threat, ie, ts.underThreat is true.
     * @param currColor
     * @param ts
     * @private
     */
    private canCheckBeBlocked(currColor:PieceColor,ts:ThreatStatus):boolean {
        if(!ts.threatInfo || ts.threatInfo.threats.length > 1) {
            return false; // cannot block more than one threat in one move
        }
        // Check each piece to see if it can be moved into path - TODO this is inefficient, but works: refactor at some point
        const board: Piece[][] = this.boardCopy;
        for(let r: number = 0;r < board.length;r++) {
            for(let c: number = 0;c < board[r].length;c++) {
                const piece: Piece = board[r][c];
                if(piece.color === currColor) {
                    for(let loc of ts.threatInfo.threats[0].threatPath) {
                        if (piece.makeMove(this, BoardModel.getValidBoardLocationByOffset("a8",r,c), loc, true)) {
                            return true; // as soon as a legal move is found to block the current check, return true
                        }
                    }
                }
            }
        }
        return false;
    }
}