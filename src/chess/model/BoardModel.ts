import Piece, {PieceColor} from "./object/piece/interface/Piece";
import Rook from "./object/piece/Rook";
import Knight from "./object/piece/Knight";
import Bishop from "./object/piece/Bishop";
import Queen from "./object/piece/Queen";
import King from "./object/piece/King";
import Pawn from "./object/piece/Pawn";
import NoPiece from "./object/piece/NoPiece";

export default class BoardModel {
    private readonly _board: Piece[][];

    static initBoard: Piece[][] = [
        [
            new Rook(PieceColor.BLACK),
            new Knight(PieceColor.BLACK),
            new Bishop(PieceColor.BLACK),
            new Queen(PieceColor.BLACK),
            new King(PieceColor.BLACK),
            new Bishop(PieceColor.BLACK),
            new Knight(PieceColor.BLACK),
            new Rook(PieceColor.BLACK)
        ],
        new Array(8).fill(new Pawn(PieceColor.BLACK)),
        new Array(8).fill(new NoPiece(PieceColor.NO_PIECE)),
        new Array(8).fill(new NoPiece(PieceColor.NO_PIECE)),
        new Array(8).fill(new NoPiece(PieceColor.NO_PIECE)),
        new Array(8).fill(new NoPiece(PieceColor.NO_PIECE)),
        new Array(8).fill(new Pawn(PieceColor.WHITE)),
        [
            new Rook(PieceColor.WHITE),
            new Knight(PieceColor.WHITE),
            new Bishop(PieceColor.WHITE),
            new Queen(PieceColor.WHITE),
            new King(PieceColor.WHITE),
            new Bishop(PieceColor.WHITE),
            new Knight(PieceColor.WHITE),
            new Rook(PieceColor.WHITE)
        ],
    ];

    static rowCoordinates:string[] = "87654321".split("");
    static colCoordinates:string[] = "abcdefgh".split("");

    constructor(initBoard:Piece[][] = BoardModel.initBoard) {
        this._board = [];
        for(let row of initBoard) {
            this._board.push([...row]);
        }
    }

    static getPieceColor(piece:Piece):PieceColor {
        return piece.color // TODO raise error here for color === NO_PIECE
    }

    static parseCoordinate(coordinate:Coordinate):ParsedCoordinate {
        return {
            rowIndex: BoardModel.rowCoordinates.indexOf(coordinate.toString().charAt(1)),
            colIndex: BoardModel.colCoordinates.indexOf(coordinate.toString().charAt(0))
        };
    }

    getBoardSquareContents(coordinate:Coordinate):Piece {
        const coords = BoardModel.parseCoordinate(coordinate);
        return this._board[coords.rowIndex][coords.colIndex];
    }

    setBoardSquareContents(coordinate:Coordinate, content:Piece):void {
        const coords = BoardModel.parseCoordinate(coordinate);
        this._board[coords.rowIndex][coords.colIndex] = content;
    }

    get board():Piece[][] {
        let board:Piece[][] = [];
        for(let row of this._board) {
            board.push([...row]);
        }
        return board; // return copy so changes can't be made by client code
    }
}