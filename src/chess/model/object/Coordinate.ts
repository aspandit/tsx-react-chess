// const crossProduct = (arr1, arr2) => {
//     return arr1.reduce((accumulator, item1) => {
//         // For each element in arr1, map over arr2 to create pairs
//         const pairs = arr2.map(item2 => [item1, item2]);
//         // Concatenate the newly created pairs to the accumulator
//         return accumulator.concat(pairs);
//     }, []); // Initialize accumulator as an empty array
// };

// TODO see if crossProduct above can be used to generate what is below
type Coordinate = "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8"
    | "b1" | "b2" | "b3" | "b4" | "b5" | "b6" | "b7" | "b8"
    | "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8"
    | "d1" | "d2" | "d3" | "d4" | "d5" | "d6" | "d7" | "d8"
    | "e1" | "e2" | "e3" | "e4" | "e5" | "e6" | "e7" | "e8"
    | "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8"
    | "g1" | "g2" | "g3" | "g4" | "g5" | "g6" | "g7" | "g8"
    | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7" | "h8"
    | "";

type ParsedCoordinate = {
    rowIndex:number,
    colIndex:number,
};