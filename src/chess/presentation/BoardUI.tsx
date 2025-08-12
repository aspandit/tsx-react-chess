import './BoardUI.css'
import {useEffect, useState} from "react";
import {GameLogic} from "../container/GameLogic";
import React from 'react';
import CryptoJS from "crypto-js";
import Sha256 from "crypto-js/sha256";

export default function Game() {
    const importGameModel = (event:any) => {
        event.preventDefault();
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onloadend = () => {
            const clicks:BoardLocation[] = JSON.parse(reader.result as string).clicks;
            const gl:GameLogic = new GameLogic();
            for(let click of clicks) {
                gl.selectSquare(click);
            }
            setGameLogic(gl);
        }
    };

    const exportGameModel = () => {
        const boards:string[][][] = generateExportData();
        const content:string = JSON.stringify({clicks: clicks, boards: boards});
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const filename:string = Sha256(content).toString(CryptoJS.enc.Hex);
        a.download = filename + '.json';

        // Append to body and click to trigger download, then remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the object URL
        URL.revokeObjectURL(url);
    };

    const generateExportData = () => {
        const boards: string[][][] = [];
        let gl: GameLogic = new GameLogic();
        for (let aClick of clicks) {
            gl.selectSquare(aClick);
            boards.push(gl.boardStringView);
        }
        return boards;
    }

    const [gameLogic,setGameLogic] = useState<GameLogic>(new GameLogic()); // TODO ***determine whether this and other classes need to be function-based***
    const [selection, setSelection] = useState<BoardLocation>("");
    const [clicks, setClicks] = useState<BoardLocation[]>([]);

    const handleSquareClick = (coords:BoardLocation) => {
        clicks.push(coords);
        setClicks(clicks);

        setSelection(gameLogic.selectSquare(coords));
    };

    return (
        <>
            <div>
                <input type={"file"} onChange={importGameModel} /> {/* TODO style this element to match other button */}
                <button onClick={exportGameModel}>Export...</button>
            </div>
            <div>
                <span>
                    <BoardUI className={"board"} selection={selection} board={gameLogic.boardStringView} onSquareClick={handleSquareClick} />
                </span>
            </div>
        </>
    );
}

function BoardUI(props: {className: string, selection:BoardLocation, board:string[][], onSquareClick:(coord:BoardLocation) => void}) {
    const selection:BoardLocation = props.selection;

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
        </>
    );
}

function Row(props: { className: string, coordinate: string, row: string[], onSquareClick: (coord:BoardLocation) => void }) {
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

function Square(props: { key: string, className: string, coordinate: string, content: string, onSquareClick: (coord:BoardLocation) => void }) {
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

function SquareInner(props: { content: string, coordinate: string, onSquareClick: (coord:BoardLocation) => void }) {
    function squareClick(coordinate: string) {
        props.onSquareClick(coordinate as BoardLocation);
    }

    return (
        <span className={"square-inner"} onClick={() => squareClick(props.coordinate)}>
          {props.content}
        </span>
    );
}