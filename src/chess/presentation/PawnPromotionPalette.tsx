import './PawnPromotionPalette.css'
import React from "react";
import {PieceColor, PieceType} from "../model/object/piece/baseclass/Piece";
import {GameLogic} from "../container/GameLogic";

export default function PawnPromotionPalette(props: { gameLogic: GameLogic, handleSquareClick: (coords:BoardLocation, color:PieceColor | null, type: PieceType | null) => void }) {
    let color: number = PieceColor[props.gameLogic.currPlayer];
    let showPalette: boolean = props.gameLogic.waitOnPawnPromotion;

    function promotePawn(event: React.MouseEvent<HTMLSpanElement>, color: PieceColor, type: PieceType):void {
        event.preventDefault();
        const loc:BoardLocation = props.gameLogic.promotingPawnLocation;
        props.gameLogic.promotePawn(color, type);
        props.handleSquareClick(loc,color,type);
        props.handleSquareClick(loc,null,null);
    }

    return (
        <table hidden={!showPalette}>
            <thead className={"palette-header"}>
            <tr>
                <td>Pick a replacement:</td>
            </tr>
            </thead>
            <tbody className={"palette-body"}>
            <tr>
                <td><span onClick={(event) => promotePawn(event, color, PieceType.QUEEN)}>{String.fromCodePoint(PieceType.QUEEN + color)}</span></td>
            </tr>
            <tr>
                <td><span onClick={(event) => promotePawn(event, color, PieceType.ROOK)}>{String.fromCodePoint(PieceType.ROOK + color)}</span></td>
            </tr>
            <tr>
                <td><span onClick={(event) => promotePawn(event, color, PieceType.BISHOP)}>{String.fromCodePoint(PieceType.BISHOP + color)}</span></td>
            </tr>
            <tr>
                <td><span onClick={(event) => promotePawn(event, color, PieceType.KNIGHT)}>{String.fromCodePoint(PieceType.KNIGHT + color)}</span></td>
            </tr>
            </tbody>
        </table>

    );
}