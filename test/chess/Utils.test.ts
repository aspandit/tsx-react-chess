import {openInterval, closedInterval, startExclusiveInterval} from "../../src/chess/utils/Utils";
import {describe, expect, test} from "@jest/globals";

describe("Interval generation tests", () => {
    test("openInterval test", () => {
        expect(openInterval(2,6)).toStrictEqual([3,4,5]);
    });

    test("closedInterval test", () => {
        expect(closedInterval(2,6)).toStrictEqual([2,3,4,5,6])
    });

    test("startExclusiveInterval test", () => {
        expect(startExclusiveInterval(2,6)).toStrictEqual([3,4,5,6])
    });

    test("openInterval test", () => {
        expect(openInterval(6,2)).toStrictEqual([5,4,3]);
    });

    test("closedInterval test", () => {
        expect(closedInterval(6,2)).toStrictEqual([6,5,4,3,2])
    });

    test("startExclusiveInterval test", () => {
        expect(startExclusiveInterval(6,2)).toStrictEqual([5,4,3,2])
    });
});