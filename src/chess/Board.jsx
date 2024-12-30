import './Board.css'

const rowCoordinates = "87654321".split("");
const colCoordinates = "abcdefgh".split("");

const board = [
    ["\u265C", "\u265E", "\u265D", "\u265B", "\u265A", "\u265D", "\u265E", "\u265C"],
    ["\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659"],
    ["\u2656", "\u2658", "\u2657", "\u2655", "\u2654", "\u2657", "\u2658", "\u2656"]
];

export default function Board() {

    return (
        <div className={"board"}>
            {
                rowCoordinates.map((coord, idx) => <Row className={"row"} key={coord} coordinate={coord}
                                                        row={board[idx]}/>)
            }
            <Coordinate className={"cornerCoordinate"} key={" "} coordinate={" "}/>
            {
                colCoordinates.map((coord) => <Coordinate className={"columnCoordinate"} key={coord}
                                                          coordinate={coord}/>)
            }
        </div>
    );
}

function Row(props) {
    return (
        <span className={"row"}>
            <Coordinate className={"rowCoordinate"} coordinate={props.coordinate} row={props.row}/>
            {
                props.row.map((sq, idx) => (<Square key={colCoordinates[idx] + props.coordinate}
                                                    coordinate={props.coordinate} content={sq}/>))
            }
        </span>
    );
}

function Coordinate(props) {
    return (
        <span className={props.className}>
                {props.coordinate}
        </span>
    );
}

function Square(props) {
    return (
        <span className={"square"}>
            <SquareInner className={props.className} content={props.content}/>
        </span>
    );
}

function SquareInner(props) {
    function onClick(el) {
        el.target.classList.toggle("square-inner-selected");
    }

    return (
        <span className={"square-inner"} onClick={onClick}>
          {props.content}
        </span>
    );
}