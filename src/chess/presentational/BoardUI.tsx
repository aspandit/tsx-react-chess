import './BoardUI.css'
import {createContext, useContext, useEffect, useState} from "react";
import {GameLogic} from "../container/GameLogic";
import React from 'react';
import SquareSelection from "../model/object/Selection";
import Piece from "../model/object/piece/Piece";
import {EMPTY_SQUARE} from "../model/object/piece/NoPiece";

const SelectionContext = createContext<SquareSelection>("");

const useGetSelection = () => useContext(SelectionContext);

export default function Game() {
    const [gameLogic,setGameLogic] = useState<GameLogic>(new GameLogic()); // TODO ***determine whether this and other classes need to be function-based***
    const [selection, setSelection] = useState<SquareSelection>("");

    const handleSquareClick = (coord:SquareSelection) => {
        if(selection === ""){ // no square was previously selected
            if(gameLogic.isSquareOccupiedByOwnPiece(coord)) { // initially selected square must have the player's own piece on it
                setSelection(coord);
            }
        }
        else if(selection === coord) { // the previously selected square was clicked again
            setSelection("");
        }
        else {
            if(gameLogic.isSquareOccupiedByOwnPiece(coord)) { // set selection to another square with own piece if it was clicked
                setSelection(coord);
            }
            else { // don't try to move piece unless destination square is empty or has opposing piece
                const piece: Piece = gameLogic.movePiece(selection, coord);
                if (piece !== EMPTY_SQUARE) { // if a piece is being moved
                    setSelection("");
                    gameLogic.toggleTurn();
                }
            }
        }
    };

    return (
      <BoardUI className={"board"} selection={selection} board={gameLogic.board} onSquareClick={handleSquareClick} />
    );
}

function BoardUI(props: {className: string, selection:SquareSelection, board:Piece[][], onSquareClick:(coord:SquareSelection) => void}) {
    return (
        <SelectionContext.Provider value={props.selection}>
            {/*Generate board top-left to lower-right*/}
            <div className={"board"}>
                {/*Generate rows*/}
                {
                    GameLogic.rowCoordinates.map((coord: string, idx: number) => <Row className={"row"} key={coord}
                                                                                      coordinate={coord}
                                                                                      row={props.board[idx]}
                                                                                      onSquareClick={props.onSquareClick} />)
                }
                {/*Generate lower-left coordinate label*/}
                <CoordinateLabel className={"cornerCoordinate"} key={" "} coordinate={" "}/>
                {/*Generate row of column coordinate labels*/}
                {
                    GameLogic.colCoordinates.map((coord: string) => <CoordinateLabel className={"columnCoordinate"}
                                                                                     key={coord}
                                                                                     coordinate={coord}/>)
                }
            </div>
        </SelectionContext.Provider>
    );
}

function Row(props: { className: string, coordinate: string, row: Piece[], onSquareClick: (coord:SquareSelection) => void }) {
    return (
        <span className={"row"}>
            <CoordinateLabel className={"rowCoordinate"} coordinate={props.coordinate}/>
            {
                props.row.map((sq: Piece, idx: number) => (
                    <Square key={GameLogic.colCoordinates[idx] + props.coordinate}
                            className={props.className} coordinate={GameLogic.colCoordinates[idx] + props.coordinate}
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

function Square(props: { key: string, className: string, coordinate: string, content: Piece, onSquareClick: (coord:SquareSelection) => void }) {
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

function SquareInner(props: { content: Piece, coordinate: string, onSquareClick: (coord:SquareSelection) => void }) {
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
          {props.content.toString()}
        </span>
    );
}