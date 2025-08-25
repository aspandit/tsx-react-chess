import Piece, {PieceColor, PieceType} from "./object/piece/baseclass/Piece";
import Rook from "./object/piece/Rook";
import Knight from "./object/piece/Knight";
import Bishop from "./object/piece/Bishop";
import Queen from "./object/piece/Queen";
import King from "./object/piece/King";
import Pawn from "./object/piece/Pawn";
import NoPiece, {NO_PIECE} from "./object/piece/NoPiece";
import {openInterval} from "../utils/Utils";

export default class BoardModel {
    private readonly _board: Piece[][];
    private readonly _kingLocations: {"WHITE": BoardLocation, "BLACK": BoardLocation};

    static rowCoordinates: string[] = "87654321".split("");
    static colCoordinates: string[] = "abcdefgh".split("");

    static initBoard: Piece[][] = [
        [
            new Rook(PieceColor.BLACK, "a8"),
            new Knight(PieceColor.BLACK, "b8"),
            new Bishop(PieceColor.BLACK, "c8"),
            new Queen(PieceColor.BLACK, "d8"),
            new King(PieceColor.BLACK, "e8"),
            new Bishop(PieceColor.BLACK, "f8"),
            new Knight(PieceColor.BLACK, "g8"),
            new Rook(PieceColor.BLACK, "h8")
        ],
        Array(8).fill(null).map((val, idx, array) => new Pawn(PieceColor.BLACK, BoardModel.colCoordinates[idx] + "7" as BoardLocation)),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(null).map((val, idx, array) => new Pawn(PieceColor.WHITE, BoardModel.colCoordinates[idx] + "2" as BoardLocation)),
        [
            new Rook(PieceColor.WHITE, "a1"),
            new Knight(PieceColor.WHITE, "b1"),
            new Bishop(PieceColor.WHITE, "c1"),
            new Queen(PieceColor.WHITE, "d1"),
            new King(PieceColor.WHITE, "e1"),
            new Bishop(PieceColor.WHITE, "f1"),
            new Knight(PieceColor.WHITE, "g1"),
            new Rook(PieceColor.WHITE, "h1")
        ],
    ];

    static stalemateBoard: Piece[][] = [
        [
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new King(PieceColor.BLACK, "e8"),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, "")
        ],
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        Array(8).fill(new NoPiece(PieceColor.NO_COLOR, "")),
        [
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new Queen(PieceColor.WHITE, "d1"),
            new King(PieceColor.WHITE, "e1"),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, ""),
            new NoPiece(PieceColor.NO_COLOR, "")
        ],
    ];

    constructor() {
        this._board = [];
        for (let row of BoardModel.initBoard) {
            const aRow:Piece[] = [];
            this._board.push(aRow);
            for(let piece of row) {
                aRow.push(BoardModel.generateNewPiece(piece)); // it is VERY important we recreate the pieces as we do things like add/remove moves during gameplay
            }
        }
        this._kingLocations = {
            "WHITE": "e1",
            "BLACK": "e8"
        };
    }

    private static generateNewPiece(piece: Piece): Piece {
        switch (piece.type) {
            case PieceType.ROOK:
                return new Rook(piece.color,piece.initialSquare);
            case PieceType.KNIGHT:
                return new Knight(piece.color,piece.initialSquare);
            case PieceType.BISHOP:
                return new Bishop(piece.color,piece.initialSquare);
            case PieceType.QUEEN:
                return new Queen(piece.color,piece.initialSquare);
            case PieceType.KING:
                return new King(piece.color,piece.initialSquare);
            case PieceType.PAWN:
                return new Pawn(piece.color,piece.initialSquare);
            default:
                return NO_PIECE;
        }
    }

    static parseBoardLocation(coordinate: BoardLocation): ParsedBoardLocation {
        // TODO have error for ""
        return {
            rowIndex: BoardModel.rowCoordinates.indexOf(coordinate.toString().charAt(1)),
            colIndex: BoardModel.colCoordinates.indexOf(coordinate.toString().charAt(0))
        };
    }

    getBoardSquareContents(coordinate: BoardLocation): Piece {
        const coords = BoardModel.parseBoardLocation(coordinate);
        return this._board[coords.rowIndex][coords.colIndex];
    }

    setBoardSquareContents(coordinate: BoardLocation, content: Piece): void {
        const coords = BoardModel.parseBoardLocation(coordinate);
        this._board[coords.rowIndex][coords.colIndex] = content;
    }

    get boardCopy(): Piece[][] {
        let board: Piece[][] = [];
        for (let row of this._board) {
            board.push([...row]);
        }
        return board; // return copy so changes can't be made by client code; note we do not clone the pieces here
    }

    static leftSquare(coord: BoardLocation):BoardLocation {
        return BoardModel.getValidBoardLocationByOffset(coord,0,-1);
    }

    static rightSquare(coord: BoardLocation):BoardLocation {
        return BoardModel.getValidBoardLocationByOffset(coord,0,1);
    }

    /**
     * Returns a board location {@link rowOffset} units down and {@link colOffset} units right from {@link coords}. Note that row offsets
     * are positive in the DOWN direction and column offsets are positive in the RIGHT direction.
     *
     * That is, {@linkcode BoardModel.getValidBoardLocationByOffset}("a8",[0..7],[0..7]) is the full range of the board.
     * See BoardModel.test.ts for more examples.
     * @param coords
     * @param rowOffset
     * @param colOffset
     */
    static getValidBoardLocationByOffset(coords:BoardLocation, rowOffset:number, colOffset:number):BoardLocation {
        const parsed = BoardModel.parseBoardLocation(coords);
        if(parsed.colIndex + colOffset >= 0 &&
            parsed.colIndex + colOffset < BoardModel.colCoordinates.length &&
            parsed.rowIndex + rowOffset >= 0 &&
            parsed.rowIndex + rowOffset < BoardModel.rowCoordinates.length) {
            return (BoardModel.colCoordinates[parsed.colIndex+colOffset] + BoardModel.rowCoordinates[parsed.rowIndex+rowOffset]) as BoardLocation;
        }
        return "";
    }

    static getValidLShapedOffsets(loc:BoardLocation):BoardLocation[] {
        const ret: BoardLocation[] = [];
        let offsets:ParsedBoardLocation[] = [
                                                {rowIndex: 1,colIndex: 2}, {rowIndex: 2,colIndex: 1},
                                                {rowIndex: -1,colIndex: 2}, {rowIndex: 2,colIndex: -1},
                                                {rowIndex: 1,colIndex: -2}, {rowIndex: -2,colIndex: 1},
                                                {rowIndex: -1,colIndex: -2}, {rowIndex: -2,colIndex: -1}
                                            ];

        for(let offset of offsets) {
            const coords:BoardLocation = BoardModel.getValidBoardLocationByOffset(loc, offset.rowIndex, offset.colIndex);
            if(coords != "") {
                ret.push(coords);
            }
        }

        return ret;
    }

    static getDiagonalBoardLocations(loc:BoardLocation,roffset:number,coffset:number):BoardLocation[] {
        const locs:BoardLocation[] = [];
        if(Math.abs(roffset) === 1 && Math.abs(coffset) === 1) {
            return locs;
        }
        for(let r of openInterval(roffset/Math.abs(roffset),roffset)) {
            for(let c of openInterval(coffset/Math.abs(coffset),coffset)) {
                locs.push(BoardModel.getValidBoardLocationByOffset(loc,r,c));
            }
        }
        return locs.filter((loc:BoardLocation) => loc != "");
    }

    static getStraightBoardLocations(loc:BoardLocation,roffset:number,coffset:number):BoardLocation[] {
        const locs:BoardLocation[] = [];
        if(Math.abs(roffset) === 1 || Math.abs(coffset) === 1) {
            return locs;
        }
        if(roffset === 0) {
            for (let c of openInterval(coffset / Math.abs(coffset), coffset)) {
                locs.push(BoardModel.getValidBoardLocationByOffset(loc, BoardModel.parseBoardLocation(loc).rowIndex, c));
            }
        }
        else { //(coffset === 0)
            for (let r of openInterval(roffset / Math.abs(roffset), roffset)) {
                locs.push(BoardModel.getValidBoardLocationByOffset(loc, r, BoardModel.parseBoardLocation(loc).colIndex));
            }
        }
        return locs.filter((loc:BoardLocation) => loc != "");
    }

    updateKingLocation(king: King, to: BoardLocation) {
        if(king.color == PieceColor.WHITE) {
            this._kingLocations["WHITE"] = to;
        }
        else {
            this._kingLocations["BLACK"] = to;
        }
    }

    getKingLocation(player:Player):BoardLocation {
        return this._kingLocations[player];
    }
}