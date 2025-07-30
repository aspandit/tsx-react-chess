import {describe, expect, test} from "@jest/globals";
import GameModel from "../../../src/chess/model/GameModel";

describe("GameModel", () => {
    test("Toggle through turns test", () => {
        let gameModel = new GameModel();
        expect(gameModel.turn).toBe("WHITE");
        gameModel.toggleTurn();
        expect(gameModel.turn).toBe("BLACK");
        gameModel.toggleTurn();
        expect(gameModel.turn).toBe("WHITE");
    });

    test("Initial turn test", () => {
        let gameModel = new GameModel();
        expect(gameModel.turn).toBe("WHITE");
    });
});