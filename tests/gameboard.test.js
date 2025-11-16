import { createShip } from "../src/models/ship";
import {
  createGameBoard,
  getShipIDAt,
  placeShip,
} from "../src/models/gameboard";

let gameBoard;
let destroyer;
let topLeftPos;
let isHorizontal;
let gameBoardWithShip;

beforeEach(() => {
  gameBoard = createGameBoard();
  destroyer = createShip("destroyer", 2);
  topLeftPos = [0, 0];
  isHorizontal = true;
  gameBoardWithShip = placeShip(gameBoard, destroyer, topLeftPos, isHorizontal);
});

describe("createGameBoard", () => {
  test("creates 10x10 empty game board with valid positions", () => {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        expect(getShipIDAt(gameBoard, [row, col])).toBeNull();
      }
    }
  });
});

describe("getShipIDAt", () => {
  test("handles invalid position types", () => {
    expect(() => getShipIDAt(gameBoard, null)).toThrow(TypeError);
    expect(() => getShipIDAt(gameBoard, "0,0")).toThrow(TypeError);
  });

  test("handles out of bounds positions", () => {
    expect(() => getShipIDAt(gameBoard, [-1, 0])).toThrow(RangeError);
    expect(() => getShipIDAt(gameBoard, [10, 0])).toThrow(RangeError);
    expect(() => getShipIDAt(gameBoard, [0, -1])).toThrow(RangeError);
    expect(() => getShipIDAt(gameBoard, [0, 10])).toThrow(RangeError);
  });
});

describe("placeShip", () => {
  describe("input type validation", () => {
    test("handles invalid board", () => {
      expect(() =>
        placeShip(null, destroyer, topLeftPos, isHorizontal),
      ).toThrow(TypeError);
    });
    test("handles invalid ship", () => {
      expect(() =>
        placeShip(gameBoard, null, topLeftPos, isHorizontal),
      ).toThrow(TypeError);
    });
    test("handles invalid starting position type", () => {
      expect(() => placeShip(gameBoard, destroyer, null, isHorizontal)).toThrow(
        TypeError,
      );
    });
    test("handles invalid orientation", () => {
      expect(() => placeShip(gameBoard, destroyer, topLeftPos, null)).toThrow(
        TypeError,
      );
    });
  });

  describe("invalid ship placement", () => {
    test("overflows board-bottom", () => {
      expect(() =>
        placeShip(gameBoard, destroyer, [9, 0], !isHorizontal),
      ).toThrow(RangeError);
    });
    test("overflows board-right", () => {
      expect(() =>
        placeShip(gameBoard, destroyer, [0, 9], isHorizontal),
      ).toThrow(RangeError);
    });
    test("overlays existing ship", () => {
      expect(() =>
        placeShip(gameBoardWithShip, destroyer, [0, 1], isHorizontal),
      ).toThrow(Error);

      expect(() =>
        placeShip(gameBoardWithShip, destroyer, [0, 0], !isHorizontal),
      ).toThrow(Error);
    });

    test("prevents placing the same ship twice", () => {
      expect(() =>
        placeShip(gameBoardWithShip, destroyer, [5, 5], isHorizontal),
      ).toThrow(Error);
    });
  });

  describe("valid ship placement", () => {
    test("places ship at top left corner", () => {
      expect(getShipIDAt(gameBoardWithShip, [0, 0])).toBe("destroyer");
      expect(getShipIDAt(gameBoardWithShip, [0, 1])).toBe("destroyer");

      expect(getShipIDAt(gameBoardWithShip, [1, 0])).toBeNull();
      expect(getShipIDAt(gameBoardWithShip, [0, 2])).toBeNull();
    });

    test("places ship at bottom right corner", () => {
      // occupies [9,8] [9,9]
      gameBoardWithShip = placeShip(gameBoard, destroyer, [9, 8], isHorizontal);

      expect(getShipIDAt(gameBoardWithShip, [9, 8])).toBe("destroyer");
      expect(getShipIDAt(gameBoardWithShip, [9, 9])).toBe("destroyer");

      expect(getShipIDAt(gameBoardWithShip, [9, 7])).toBeNull();
      expect(getShipIDAt(gameBoardWithShip, [8, 9])).toBeNull();
    });
  });

  describe("ship tracking", () => {
    test("places the correct ship ID in covered cells", () => {
      expect(getShipIDAt(gameBoardWithShip, [0, 0])).toBe("destroyer");
      expect(getShipIDAt(gameBoardWithShip, [0, 1])).toBe("destroyer");
    });

    test("different ships have different IDs in cells", () => {
      const gameBoardWithTwoShips = placeShip(
        gameBoardWithShip,
        createShip("carrier", 5),
        [1, 0], // just below first ship
        isHorizontal,
      );

      expect(getShipIDAt(gameBoardWithShip, [0, 0])).toBe("destroyer");
      expect(getShipIDAt(gameBoardWithShip, [0, 1])).toBe("destroyer");

      expect(getShipIDAt(gameBoardWithTwoShips, [1, 0])).toBe("carrier");
      expect(getShipIDAt(gameBoardWithTwoShips, [1, 1])).toBe("carrier");
    });
  });
});
