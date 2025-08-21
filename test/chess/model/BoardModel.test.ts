import {describe, expect, test} from "@jest/globals";
import BoardModel from "../../../src/chess/model/BoardModel";

describe("GameModel", () => {
    test("Test offsets", () => {
        expect(BoardModel.getValidBoardLocationByOffset("a1", 1, 1)).toBe("");
        expect(BoardModel.getValidBoardLocationByOffset("a8", 7, 1)).toBe("b1");
    });
});