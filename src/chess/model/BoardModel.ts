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

    getBoardSquareContents(coordinate:string):string {
        return this.board[BoardModel.rowCoordinates.indexOf(coordinate.charAt(0))][BoardModel.colCoordinates.indexOf(coordinate.charAt(1))];
    }

    getBoardRow(rowIdx:number):string []{
        return this.board[rowIdx];
    }
}