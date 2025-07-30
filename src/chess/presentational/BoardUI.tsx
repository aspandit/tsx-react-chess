import './BoardUI.css'
import {createContext, useContext, useEffect, useState} from "react";
import {BoardLogic} from "../container/BoardLogic.js";
import React from 'react';
import SquareSelection from "../model/object/Selection";

const SelectionContext = createContext<SquareSelection>("");

const useGetSelection = () => useContext(SelectionContext);

export default function Game() {
    const boardLogic = new BoardLogic();

    const [selection, setSelection] = useState<SquareSelection>("");

    const handleSquareClick = (coord:SquareSelection) => {
        if(selection === ""){ // no square was previously selected
            if(boardLogic.isSquareOccupied(coord)) { // initially selected square must have a piece on it
                setSelection(coord);
            }
        }
        else if(selection === coord) { // the previously selected square was clicked again
            setSelection("");
        }
        else {
            const piece: string = boardLogic.movePiece(selection, coord);
            if (piece !== "") { // if a piece is being moved
                setSelection("");
            } else {
                setSelection(coord)
            }
        }
    };

    return (
      <BoardUI selection={selection} board={boardLogic.board} onSquareClick={handleSquareClick} />
    );
}

function BoardUI(props: {selection:SquareSelection, board:string[][], onSquareClick:(coord:SquareSelection) => void}) {
    return (
        <SelectionContext.Provider value={props.selection}>
            {/*Generate board top-left to lower-right*/}
            <div className={"board"}>
                {/*Generate rows*/}
                {
                    BoardLogic.rowCoordinates.map((coord: string, idx: number) => <Row className={"row"} key={coord}
                                                                                       coordinate={coord}
                                                                                       row={props.board[idx]}
                                                                                       onSquareClick={props.onSquareClick} />)
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

function Row(props: { className: string, coordinate: string, row: string[], onSquareClick: (coord:SquareSelection) => void }) {
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

function Square(props: { key: string, className: string, coordinate: string, content: string, onSquareClick: (coord:SquareSelection) => void }) {
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

function SquareInner(props: { content: string, coordinate: string, onSquareClick: (coord:SquareSelection) => void }) {
    const selection = useGetSelection();

    function squareClick(coordinate: string) {
        props.onSquareClick(coordinate as SquareSelection);
    }

    useEffect(() => {
        // TODO figure out why this is called so many times(and how many times) when a new selection is made. Maybe because selection is at the Game component level? If so, consider using useRef in Game component?
        // Clear previous selection(s)
        const currSelections = document.getElementsByClassName("square-inner-selected");
        Array.from(currSelections).forEach((sel: Element) => {
            sel.classList.remove("square-inner-selected");
        });

        // Highlight inner square if new selection was made
        if (selection !== "") {
            document.getElementById(selection as string)?.getElementsByClassName("square-inner")[0].classList.add("square-inner-selected");
        }
    }, [selection]);

    return (
        <span className={"square-inner"} onClick={() => squareClick(props.coordinate)}>
          {props.content}
        </span>
    );
}