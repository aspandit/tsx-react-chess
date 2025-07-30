import SquareSelection from "./object/Selection";
import Piece, {PieceColor, PieceType} from "./object/Piece";

export default class BoardModel {
    private readonly _board: Piece[][];

    static initBoard: Piece[][] = [
        [
            new Piece(PieceType.ROOK,PieceColor.BLACK),
            new Piece(PieceType.KNIGHT,PieceColor.BLACK),
            new Piece(PieceType.BISHOP,PieceColor.BLACK),
            new Piece(PieceType.QUEEN,PieceColor.BLACK),
            new Piece(PieceType.KING,PieceColor.BLACK),
            new Piece(PieceType.BISHOP,PieceColor.BLACK),
            new Piece(PieceType.KNIGHT,PieceColor.BLACK),
            new Piece(PieceType.ROOK,PieceColor.BLACK)
        ],
        new Array(8).fill(new Piece(PieceType.PAWN,PieceColor.BLACK)),
        new Array(8).fill(new Piece(PieceType.NO_PIECE,PieceColor.NO_PIECE)),
        new Array(8).fill(new Piece(PieceType.NO_PIECE,PieceColor.NO_PIECE)),
        new Array(8).fill(new Piece(PieceType.NO_PIECE,PieceColor.NO_PIECE)),
        new Array(8).fill(new Piece(PieceType.NO_PIECE,PieceColor.NO_PIECE)),
        new Array(8).fill(new Piece(PieceType.PAWN,PieceColor.WHITE)),
        [
            new Piece(PieceType.ROOK,PieceColor.WHITE),
            new Piece(PieceType.KNIGHT,PieceColor.WHITE),
            new Piece(PieceType.BISHOP,PieceColor.WHITE),
            new Piece(PieceType.QUEEN,PieceColor.WHITE),
            new Piece(PieceType.KING,PieceColor.WHITE),
            new Piece(PieceType.BISHOP,PieceColor.WHITE),
            new Piece(PieceType.KNIGHT,PieceColor.WHITE),
            new Piece(PieceType.ROOK,PieceColor.WHITE)
        ],
    ];

    static rowCoordinates:string[] = "87654321".split("");
    static colCoordinates:string[] = "abcdefgh".split("");

    constructor() {
        this._board = [];
        for(let row of BoardModel.initBoard) {
            this._board.push([...row]);
        }
    }

    // TODO create enum/class "Piece" for pieces instead of using string
    static getPieceColor(piece:Piece):PieceColor {
        return piece.color // TODO raise error here for color === NO_PIECE
    }

    getBoardSquareContents(coordinate:SquareSelection):Piece {
        const coords = this.parseCoordinate(coordinate);
        return this._board[coords.rowIndex][coords.colIndex];
    }

    setBoardSquareContents(coordinate:SquareSelection, content:Piece):void {
        const coords = this.parseCoordinate(coordinate);
        this._board[coords.rowIndex][coords.colIndex] = content;
    }

    get board():Piece[][] {
        let board:Piece[][] = [];
        for(let row of this._board) {
            board.push([...row]);
        }
        return board; // return copy so changes can't be made by client code
    }

    private parseCoordinate(coordinate:SquareSelection):{rowIndex:number, colIndex:number} {
        return {
            rowIndex: BoardModel.rowCoordinates.indexOf(coordinate.toString().charAt(1)),
            colIndex: BoardModel.colCoordinates.indexOf(coordinate.toString().charAt(0))
        };
    }
}