import './BoardUI.css'
import {createContext, useContext, useState} from "react";
import {BoardLogic} from "../container/BoardLogic.js";

const SelectionContext = createContext({});

export default function BoardUI() {

    const boardLogic = new BoardLogic();

    const [selection, setSelection] = useState(null);

    return (
        <SelectionContext.Provider value={{selection, setSelection}}>
            {/*Generate board top-left to lower-right*/}
            <div className={"board"}>
                {/*Generate rows*/}
                {
                    BoardLogic.rowCoordinates.map((coord, idx) => <Row className={"row"} key={coord} coordinate={coord}
                                                            row={boardLogic.getBoardRow(idx)}/>)
                }
                {/*Generate lower-left coordinate label*/}
                <CoordinateLabel className={"cornerCoordinate"} key={" "} coordinate={" "}/>
                {/*Generate row of column coordinate labels*/}
                {
                    BoardLogic.colCoordinates.map((coord) => <CoordinateLabel className={"columnCoordinate"} key={coord}
                                                              coordinate={coord}/>)
                }
            </div>
        </SelectionContext.Provider>
    );
}

function Row(props) {
    return (
        <span className={"row"}>
            <CoordinateLabel className={"rowCoordinate"} coordinate={props.coordinate} row={props.row}/>
            {
                props.row.map((sq, idx) => (<Square key={BoardLogic.colCoordinates[idx] + props.coordinate}
                                                    coordinate={BoardLogic.colCoordinates[idx] + props.coordinate} content={sq}/>))
            }
        </span>
    );
}

function CoordinateLabel(props) {
    return (
        <span className={props.className}>
                {props.coordinate}
        </span>
    );
}

function Square(props) {
    function getColorClass(coordinate) {
        let coords = coordinate.split("");

        return (coords[0].charCodeAt(0) % 2 ^ coords[1] % 2 ? "white-square" : "black-square");
    }

    return (
        <span className={"square "+getColorClass(props.coordinate)} id={props.coordinate}>
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