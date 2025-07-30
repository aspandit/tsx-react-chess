import SquareSelection from "./object/Selection";

export default class BoardModel {
    private readonly _board: string[][];

    static initBoard: string[][] = [
        ["\u265C", "\u265E", "\u265D", "\u265B", "\u265A", "\u265D", "\u265E", "\u265C"],
        ["\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659"],
        ["\u2656", "\u2658", "\u2657", "\u2655", "\u2654", "\u2657", "\u2658", "\u2656"]
    ];

    static rowCoordinates:string[] = "87654321".split("");
    static colCoordinates:string[] = "abcdefgh".split("");

    constructor() {
        this._board = BoardModel.initBoard;
    }

    // TODO create enum/class "Piece" for pieces instead of using string
    static getPieceColor(piece:string):string {
        if(["\u2656", "\u2658", "\u2657", "\u2655", "\u2654","\u2659"].indexOf(piece) !== -1) {
            return "WHITE";
        }
        if(["\u265C", "\u265E", "\u265D", "\u265B", "\u265A","\u265F"].indexOf(piece) !== -1) {
            return "BLACK";
        }
        return ""; // TODO raise error here
    }

    getBoardSquareContents(coordinate:SquareSelection):string {
        const coords = this.parseCoordinate(coordinate);
        return this._board[coords.rowIndex][coords.colIndex];
    }

    setBoardSquareContents(coordinate:SquareSelection, content:string):void {
        const coords = this.parseCoordinate(coordinate);
        this._board[coords.rowIndex][coords.colIndex] = content;
    }

    get board():string[][] {
        return [...this._board]; // return copy so changes can't be made by client code
    }

    private parseCoordinate(coordinate:SquareSelection):{rowIndex:number, colIndex:number} {
        return {
            rowIndex: BoardModel.rowCoordinates.indexOf(coordinate.toString().charAt(1)),
            colIndex: BoardModel.colCoordinates.indexOf(coordinate.toString().charAt(0))
        };
    }
}