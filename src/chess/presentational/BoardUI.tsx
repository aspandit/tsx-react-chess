import './BoardUI.css'
import {createContext, useContext, useState} from "react";
import {BoardLogic} from "../container/BoardLogic.js";
import React from 'react';

// const crossProduct = (arr1, arr2) => {
//     return arr1.reduce((accumulator, item1) => {
//         // For each element in arr1, map over arr2 to create pairs
//         const pairs = arr2.map(item2 => [item1, item2]);
//         // Concatenate the newly created pairs to the accumulator
//         return accumulator.concat(pairs);
//     }, []); // Initialize accumulator as an empty array
// };

// TODO see if crossProduct above cab be used to generate what is below
type Selection = "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8"
                    | "b1" | "b2" | "b3" | "b4" | "b5" | "b6" | "b7" | "b8"
                    | "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8"
                    | "d1" | "d2" | "d3" | "d4" | "d5" | "d6" | "d7" | "d8"
                    | "e1" | "e2" | "e3" | "e4" | "e5" | "e6" | "e7" | "e8"
                    | "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8"
                    | "g1" | "g2" | "g3" | "g4" | "g5" | "g6" | "g7" | "g8"
                    | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7" | "h8"
                    | "";

const SelectionContext = createContext<Selection>("");

const useGetSelection = () => useContext(SelectionContext);

export default function BoardUI() {

    const boardLogic = new BoardLogic();

    const [selection, setSelection] = useState<Selection>("");

    const handleSquareClick = (coord:Selection) => {
        setSelection(coord);
    };

    return (
        <SelectionContext.Provider value={selection}>
            {/*Generate board top-left to lower-right*/}
            <div className={"board"}>
                {/*Generate rows*/}
                {
                    BoardLogic.rowCoordinates.map((coord: string, idx: number) => <Row className={"row"} key={coord}
                                                                                       coordinate={coord}
                                                                                       row={boardLogic.getBoardRow(idx)}
                                                                                       onSquareClick={handleSquareClick} />)
                }
                {/*Generate lower-left coordinate label*/}
                <CoordinateLabel className={"cornerCoordinate"} key={" "} coordinate={" "}/>
                {/*Generate row of column coordinate labels*/}
                {
                    BoardLogic.colCoordinates.map((coord: string) => <CoordinateLabel className={"columnCoordinate"}
                                                                                      key={coord}
                                                                                      coordinate={coord}/>)
                }
            </div>
        </SelectionContext.Provider>
    );
}

function Row(props: { className: string, coordinate: string, row: string[], onSquareClick: (coord:Selection) => void }) {
    return (
        <span className={"row"}>
            <CoordinateLabel className={"rowCoordinate"} coordinate={props.coordinate}/>
            {
                props.row.map((sq: string, idx: number) => (
                    <Square key={BoardLogic.colCoordinates[idx] + props.coordinate}
                            className={props.className} coordinate={BoardLogic.colCoordinates[idx] + props.coordinate}
                            content={sq} onSquareClick={props.onSquareClick} />))
            }
        </span>
    );
}

function CoordinateLabel(props: { className: string, coordinate: string }) {
    return (
        <span className={props.className}>
                {props.coordinate}
        </span>
    );
}

function Square(props: { key: string, className: string, coordinate: string, content: string, onSquareClick: (coord:Selection) => void }) {
    function getColorClass(coordinate: string) {
        let coords: string[] = coordinate.split("");

        return ((coords[0].charCodeAt(0) % 2) ^ (coords[1].charCodeAt(0) % 2) ? "white-square" : "black-square");
    }

    return (
        <span className={"square " + getColorClass(props.coordinate)} id={props.coordinate}>
            <SquareInner content={props.content} coordinate={props.coordinate} onSquareClick={props.onSquareClick}/>
        </span>
    );
}

function SquareInner(props: { content: string, coordinate: string, onSquareClick: (coord:Selection) => void }) {
    const selection = useGetSelection();

    function squareClick(el: Element, coordinate: string) {
        // Clear previous selection(s)
        if (selection !== "") {
            const currSelections = document.getElementsByClassName("square-inner-selected");
            Array.from(currSelections).forEach((sel: Element) => {
                sel.classList.remove("square-inner-selected");
            });
        }

        if (selection === coordinate) { // previously selected coordinate was clicked
            el.classList.remove("square-inner-selected");
            props.onSquareClick("");
        } else { // any other coordinate was selected
            el.classList.add("square-inner-selected");
            props.onSquareClick(coordinate as Selection);
        }
    }

    return (
        <span className={"square-inner"} onClick={(event) => squareClick(event.target as Element, props.coordinate)}>
          {props.content}
        </span>
    );
}