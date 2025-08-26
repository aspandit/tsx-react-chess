import './BoardUI.css'
import {useEffect, useState} from "react";
import {GameLogic} from "../container/GameLogic";
import React from 'react';
import Controls from "./ControlsUI";
import PawnPromotionPalette from "./PawnPromotionPalette";
import {PieceColor, PieceType} from "../model/object/piece/baseclass/Piece";

export default function Game() {
    const [gameLogic,setGameLogic] = useState<GameLogic>(new GameLogic()); // TODO ***determine whether this and other classes need to be function-based***
    const [selection, setSelection] = useState<BoardLocation>("");
    const [clicks, setClicks] = useState<BoardLocation[]>([]);
    const [promotions, setPromotions] = useState<[number,PieceColor,PieceType][]>([]);
    const [statusMessage, setStatusMessage] = useState<string>("White to move.");

    const handleSquareClick = (coords:BoardLocation, color:PieceColor | null, type: PieceType | null) => {
        if(color && type) {
            promotions.push([clicks.length,color,type]);
            setPromotions(promotions);
        }

        clicks.push(coords);
        setClicks(clicks);

        setSelection(gameLogic.selectSquare(coords));
        setStatusMessage(gameLogic.info);
    };

    return (
        <>
            <div className={"main"}>
                <span>
                    <BoardUI className={"board"} selection={selection} board={gameLogic.boardStringView} handleSquareClick={handleSquareClick} />
                </span>
                <span className={"right-margin"}>
                    <span className={"status-bar"}>{statusMessage}</span>
                    <PawnPromotionPalette gameLogic={gameLogic} handleSquareClick={handleSquareClick} />
                    <Controls className={"controls"} clicks={clicks} setGameLogic={setGameLogic} setClicks={setClicks} setStatusMessage={setStatusMessage}
                                promotions={promotions} setPromotions={setPromotions} />
                </span>
            </div>
        </>
    );
}

function BoardUI(props: {className: string, selection:BoardLocation, board:string[][], handleSquareClick:(coords:BoardLocation, color:PieceColor | null, type: PieceType | null) => void}) {
    const selection:BoardLocation = props.selection;
    const handleSquareClick = props.handleSquareClick;

    useEffect(() => {
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

    return (<>{/*Generate board top-left to lower-right*/}
            <div className={"board"}>
                {/*Generate rows*/}
                {
                    GameLogic.rowCoordinates.map((coord: string, idx: number) => <Row className={"row"} key={coord}
                                                                                      coordinate={coord}
                                                                                      row={props.board[idx]}
                                                                                      onSquareClick={handleSquareClick} />)
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
        </>
    );
}

function Row(props: { className: string, coordinate: string, row: string[], onSquareClick: (coord:BoardLocation, color:PieceColor | null, type: PieceType | null) => void }) {
    return (
        <span className={"row"}>
            <CoordinateLabel className={"rowCoordinate"} coordinate={props.coordinate}/>
            {
                props.row.map((sq: string, idx: number) => (
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

function Square(props: { key: string, className: string, coordinate: string, content: string, onSquareClick: (coord:BoardLocation, color:PieceColor | null, type: PieceType | null) => void }) {
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

function SquareInner(props: { content: string, coordinate: string, onSquareClick: (coord:BoardLocation, color:PieceColor | null, type: PieceType | null) => void }) {
    function squareClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, coordinate: string) {
        event.preventDefault();
        props.onSquareClick(coordinate as BoardLocation, null, null);
    }

    return (
        <span className={"square-inner"} onClick={(event) => squareClick(event,props.coordinate)}>
          {props.content}
        </span>
    );
}