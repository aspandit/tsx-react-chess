import Piece, {PieceColor, PieceType} from "./object/piece/baseclass/Piece";
import Rook from "./object/piece/Rook";
import Knight from "./object/piece/Knight";
import Bishop from "./object/piece/Bishop";
import Queen from "./object/piece/Queen";
import King from "./object/piece/King";
import Pawn from "./object/piece/Pawn";
import NoPiece, {NO_PIECE} from "./object/piece/NoPiece";

export default class BoardModel {
    private readonly _board: Piece[][];
    private _kingLocations: {"WHITE": BoardLocation, "BLACK": BoardLocation};

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
        return board; // return copy so changes can't be made by client code
    }

    static leftSquare(coord: BoardLocation):BoardLocation | null {
        const coords = BoardModel.parseBoardLocation(coord);
        if(coords.colIndex > 0) {
            return (BoardModel.colCoordinates[coords.colIndex-1] + BoardModel.rowCoordinates[coords.rowIndex]) as BoardLocation;
        }
        return null;
    }

    static rightSquare(coord: BoardLocation):BoardLocation | null{
        const coords = BoardModel.parseBoardLocation(coord);
        if(coords.colIndex < BoardModel.colCoordinates.length - 1) {
            return (BoardModel.colCoordinates[coords.colIndex+1] + BoardModel.rowCoordinates[coords.rowIndex]) as BoardLocation;
        }
        return null;
    }

    updateKingLocation(king: King, to: BoardLocation) {
        if(king.color == PieceColor.WHITE) {
            this._kingLocations["WHITE"] = to;
        }
        else {
            this._kingLocations["BLACK"] = to;
        }
    }
}