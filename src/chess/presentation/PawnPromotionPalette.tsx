import './PawnPromotionPalette.css'
import React from "react";
import {PieceColor, PieceType} from "../model/object/piece/baseclass/Piece";
import {GameLogic} from "../container/GameLogic";

export default function PawnPromotionPalette(props: { gameLogic: GameLogic }) {
    const color: number = PieceColor[props.gameLogic.currPlayer];
    const showPalette: boolean = props.gameLogic.waitOnPawnPromotion;
    return (
        <table hidden={!showPalette}>
            <thead className={"palette-header"}>
            <tr>
                <td>Pick a replacement:</td>
            </tr>
            </thead>
            <tbody className={"palette-body"}>
            <tr>
                <td><span>{String.fromCodePoint(PieceType.QUEEN + color)}</span></td>
            </tr>
            <tr>
                <td><span>{String.fromCodePoint(PieceType.ROOK + color)}</span></td>
            </tr>
            <tr>
                <td><span>{String.fromCodePoint(PieceType.BISHOP + color)}</span></td>
            </tr>
            <tr>
                <td><span>{String.fromCodePoint(PieceType.KNIGHT + color)}</span></td>
            </tr>
            </tbody>
        </table>

    );
}