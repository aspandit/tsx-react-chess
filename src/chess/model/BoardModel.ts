import SquareSelection from "./object/Selection";

export class BoardModel {
    board: string[][];

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
        this.board = BoardModel.initBoard;
    }

    getBoardSquareContents(coordinate:SquareSelection):string {
        const coords = this.parseCoordinate(coordinate);
        return this.board[coords.rowIndex][coords.colIndex];
    }

    setBoardSquareContents(coordinate:SquareSelection, content:string):void {
        const coords = this.parseCoordinate(coordinate);
        this.board[coords.rowIndex][coords.colIndex] = content;
    }

    private parseCoordinate(coordinate:SquareSelection):{rowIndex:number, colIndex:number} {
        return {
            rowIndex: BoardModel.rowCoordinates.indexOf(coordinate.toString().charAt(1)),
            colIndex: BoardModel.colCoordinates.indexOf(coordinate.toString().charAt(0))
        };
    }
}