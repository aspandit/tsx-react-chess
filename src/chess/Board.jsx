import './Board.css'
import {createContext, useContext, useState} from "react";

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

const SelectionContext = createContext({});

export default function Board() {

    const [selection, setSelection] = useState(null);

    return (
        <SelectionContext.Provider value={{selection, setSelection}}>
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
        </SelectionContext.Provider>
    );
}

function Row(props) {
    return (
        <span className={"row"}>
            <Coordinate className={"rowCoordinate"} coordinate={props.coordinate} row={props.row}/>
            {
                props.row.map((sq, idx) => (<Square key={colCoordinates[idx] + props.coordinate}
                                                    coordinate={colCoordinates[idx] + props.coordinate} content={sq}/>))
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
        <span className={"square"} id={props.coordinate}>
            <SquareInner className={props.className} content={props.content} coordinate={props.coordinate}/>
        </span>
    );
}

function SquareInner(props) {
    const {selection, setSelection} = useContext(SelectionContext);

    function squareClick(el, coordinate) {
        if (selection !== null) {
            const currSelections = document.getElementById(selection).getElementsByClassName("square-inner");
            Array.from(currSelections).forEach((sel) => {
                sel.classList.remove("square-inner-selected");
            });
        }

        if(selection === coordinate) {
            el.classList.remove("square-inner-selected");
            setSelection(null);
        }
        else {
            el.classList.add("square-inner-selected");
            setSelection(coordinate);
        }
    }

    return (
        <span className={"square-inner"} onClick={(event) => squareClick(event.target, props.coordinate)}>
          {props.content}
        </span>
    );
}