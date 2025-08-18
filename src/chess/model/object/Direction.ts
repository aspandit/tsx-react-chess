// TODO Write tests: Numbering is important here and should NOT be changed
// TODO Change this: Due to how the board matrix is laid out decreasing direction is positive change in indices
export enum Direction {
    TO_WHITE_SIDE = 1,     // decreasing row index direction: towards white side
    EITHER = 0, // either decreasing or increasing row index direction
    TO_BLACK_SIDE = -1 // increasing row index direction: towards black side
}