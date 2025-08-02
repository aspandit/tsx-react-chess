// TODO Write tests: Numbering is important here and should NOT be changed
// TODO Change this: Due to how the board matrix is laid out decreasing direction is positive change in indices
export enum Direction {
    DECREASING = 1,     // decreasing row index direction: towards white side
    EITHER = 0, // either decreasing or increasing row index direction
    INCREASING = -1 // increasing row index direction: towards black side
}