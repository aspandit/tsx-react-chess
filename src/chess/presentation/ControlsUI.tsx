import './BoardUI.css';
import React from "react";
import {GameLogic} from "../container/GameLogic";
import Sha256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";
import {PieceColor, PieceType} from "../model/object/piece/baseclass/Piece";

export default function Controls(props: {className: string, clicks: BoardLocation[], setGameLogic:(gl:GameLogic) => void, setClicks:(clicks: BoardLocation[]) => void, setStatusMessage:(statusMessage:string) => void, promotions:[number,PieceColor,PieceType][], setPromotions:(promotions:[number,PieceColor,PieceType][]) => void}) {
    const clicks = props.clicks;
    const setClicks = props.setClicks;
    const promotions = props.promotions;
    const setPromotions = props.setPromotions;
    const setGameLogic = props.setGameLogic;
    const setStatusMessage = props.setStatusMessage;

    const importGameModel = (event:any) => {
        event.preventDefault();
        const reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onloadend = () => {
            const iClicks:BoardLocation[] = JSON.parse(reader.result as string).clicks;
            const iPromotions:[number,PieceColor,PieceType][] = JSON.parse(reader.result as string).promotions;
            const gl:GameLogic = new GameLogic();
            for(let idx:number = 0;idx < iClicks.length; idx++) {
                const click:BoardLocation = iClicks[idx];
                const pIdx:number = iPromotions.findIndex((val) => val[0] === idx);
                gl.selectSquare(click);
                if(pIdx > -1) {
                    gl.promotePawn(iPromotions[pIdx][1],iPromotions[pIdx][2]);
                }
            }
            setPromotions(promotions);
            setClicks(iClicks);
            setGameLogic(gl);
            setStatusMessage(gl.info);
        }
    };

    const exportGameModel = () => {
        const boards:string[][][] = generateExportData();
        const content:string = JSON.stringify({clicks: clicks, boards: boards, promotions: promotions});
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

    return (
        <table>
            <thead>
            <tr><td>Controls</td></tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    <input id={"btnImportInput"} type={"file"} onChange={importGameModel} hidden={true} />
                    <label htmlFor={"btnImportInput"}>
                        Import board...
                    </label>
                </td>
            </tr>
            <tr>
                <td><button id={"btnExport"} onClick={exportGameModel}>Export board...</button></td>
            </tr>
            </tbody>
        </table>
    );
}