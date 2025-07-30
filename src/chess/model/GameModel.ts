export default class GameModel {
    private _turn: Turn = "WHITE";

    toggleTurn() {
        if(this.turn.toString() === "WHITE") {
            this.turn = "BLACK";
        }
        else {
            this.turn = "WHITE";
        }
    }

    get turn() {
        return this._turn;
    }

    set turn(turn: Turn) {
        this._turn = turn;
    }
}