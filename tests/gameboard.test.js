import { createShip } from "../src/models/ship.js";
import {
  createEmptyGameBoard,
  createRandomGameBoard,
  placeShip,
  receiveAttack,
  areAllShipsSunk,
  getBoardStates,
} from "../src/models/gameBoard.js";

let emptyBoard;
let destroyer;

beforeEach(() => {
  emptyBoard = createEmptyGameBoard();
  destroyer = createShip("destroyer", 2);
});

describe("createEmptyGameBoard", () => {
  test("creates game board with correct properties", () => {
    expect(emptyBoard.board).toHaveLength(10);
    expect(emptyBoard.ships.size).toBe(0);
  });
});

describe("createRandomGameBoard", () => {
  const fleet = [createShip("destroyer", 2), createShip("cruiser", 3)];
  const board = createRandomGameBoard(fleet);

  test("returns a valid game board", () => {
    expect(board).toBeDefined();
    expect(board.board).toHaveLength(10);
    expect(board.ships).toBeDefined();
  });

  test("places all provided ships", () => {
    expect(board.ships.size).toBe(2);
    expect(board.ships.has("destroyer")).toBe(true);
    expect(board.ships.has("cruiser")).toBe(true);
  });

  test("produces different configurations", () => {
    const board1 = createRandomGameBoard(fleet);
    const board2 = createRandomGameBoard(fleet);

    expect(board1).not.toEqual(board2);
  });
});

describe("placeShip", () => {
  describe("input type validation", () => {
    test("handles invalid board", () => {
      expect(() => placeShip(null, destroyer, [0, 0], true)).toThrow(TypeError);
    });
    test("handles invalid ship", () => {
      expect(() => placeShip(emptyBoard, null, [0, 0], true)).toThrow(
        TypeError,
      );
    });
    test("handles invalid starting position type", () => {
      expect(() => placeShip(emptyBoard, destroyer, null, true)).toThrow(
        TypeError,
      );
    });
    test("handles invalid orientation", () => {
      expect(() => placeShip(emptyBoard, destroyer, [0, 0], null)).toThrow(
        TypeError,
      );
    });
  });

  describe("invalid ship placement", () => {
    let boardWithShip;
    beforeEach(() => {
      boardWithShip = placeShip(emptyBoard, destroyer, [0, 0], true);
    });

    test("overflows board-bottom", () => {
      expect(() => placeShip(emptyBoard, destroyer, [9, 0], false)).toThrow(
        RangeError,
      );
    });
    test("overflows board-right", () => {
      expect(() => placeShip(emptyBoard, destroyer, [0, 9], true)).toThrow(
        RangeError,
      );
    });
    test("overlays existing ship", () => {
      expect(() => placeShip(boardWithShip, destroyer, [0, 1], true)).toThrow(
        Error,
      );

      expect(() => placeShip(boardWithShip, destroyer, [0, 0], false)).toThrow(
        Error,
      );
    });

    test("prevents placing the same ship twice", () => {
      expect(() => placeShip(boardWithShip, destroyer, [5, 5], true)).toThrow(
        Error,
      );
    });
  });

  describe("valid ship placement", () => {
    test("places a single ship", () => {
      const boardStates1 = getBoardStates(emptyBoard);
      expect(boardStates1[0][0]).toBe("empty");
      expect(boardStates1[0][1]).toBe("empty");

      const board = placeShip(emptyBoard, destroyer, [0, 0], true);

      const boardStates2 = getBoardStates(board);
      expect(boardStates2[0][0]).toBe("ship");
      expect(boardStates2[0][1]).toBe("ship");
    });

    test("places multiple ships on the same board", () => {
      const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
      const board2 = placeShip(board1, createShip("cruiser", 3), [7, 9], false);

      const boardStates = getBoardStates(board2);

      expect(boardStates[0][0]).toBe("ship");
      expect(boardStates[0][1]).toBe("ship");
      expect(boardStates[7][9]).toBe("ship");
      expect(boardStates[8][9]).toBe("ship");
      expect(boardStates[9][9]).toBe("ship");
    });
  });
});

/**
 * Attacks a position on the game board, and records the coordinates of the attack.
 * If the attack hits a ship, it increments the hit count of that ship.
 * @param {GameBoard} gameBoard game board to be attacked
 * @param {Position} pos - the position on the game board to attack
 * @returns {GameBoard} game board with a new attack
 * @throws {TypeError} if position type is invalid
 * @throws {RangeError} if position is outside of the game board
 * @throws {Error} if position has already been attacked
 */
// function receiveAttack(pos) {}
describe("receiveAttack", () => {
  describe("input validation", () => {
    test("handles invalid game board", () => {
      expect(() => receiveAttack(null, [0, 0])).toThrow(TypeError);
    });
    test("handles invalid position type", () => {
      expect(() => receiveAttack(emptyBoard, null)).toThrow(TypeError);
    });
    test("handles invalid position range", () => {
      expect(() => receiveAttack(emptyBoard, [10, 9])).toThrow(RangeError);
      expect(() => receiveAttack(emptyBoard, [-1, 0])).toThrow(RangeError);
    });
    test("handles duplicate attack", () => {
      const attackedBoard = receiveAttack(emptyBoard, [0, 0]);
      expect(() => receiveAttack(attackedBoard, [0, 0])).toThrow(Error);
    });
  });

  describe("hit/miss tracking", () => {
    test("records attack on empty cell as miss", () => {
      // test initial board state
      const boardStates1 = getBoardStates(emptyBoard);
      expect(boardStates1[0][0]).toBe("empty");
      expect(boardStates1[0][1]).toBe("empty");

      // receive attack
      const board = receiveAttack(emptyBoard, [0, 0]);

      // test final board state
      const boardStates2 = getBoardStates(board);
      expect(boardStates2[0][0]).toBe("miss");
    });

    test("records attack on ship cell as hit", () => {
      // test initial board state
      const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
      const boardStates1 = getBoardStates(board1);
      expect(boardStates1[0][0]).toBe("ship");
      expect(boardStates1[0][1]).toBe("ship");

      // receive attack
      const board2 = receiveAttack(board1, [0, 0]);

      // test final board state
      const boardStates2 = getBoardStates(board2);
      expect(boardStates2[0][0]).toBe("hit");
    });
  });

  describe("ship damage", () => {
    test("increments hit count on correct ship", () => {
      // attacking a 2-length ship once should increment, not sink the ship
      const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
      const board2 = receiveAttack(board1, [0, 0]);
      expect(areAllShipsSunk(board2)).toBe(false);

      // attacking twice should sink the ship
      const board3 = receiveAttack(board2, [0, 1]);
      expect(areAllShipsSunk(board3)).toBe(true);
    });
  });
});

describe("areAllShipsSunk", () => {
  test("handles invalid inputs", () => {
    expect(() => areAllShipsSunk(null)).toThrow(TypeError);
  });

  test("returns true for an empty board", () => {
    expect(areAllShipsSunk(emptyBoard)).toBe(true);
  });

  test("returns true only when all ships are sunk", () => {
    const ship1 = createShip("ship1", 2);
    const ship2 = createShip("ship2", 2);
    const board1 = placeShip(emptyBoard, ship1, [0, 0], true);
    const board2 = placeShip(board1, ship2, [1, 0], true);

    const board3 = receiveAttack(board2, [0, 0]);
    const board4 = receiveAttack(board3, [0, 1]);
    const board5 = receiveAttack(board4, [1, 0]);
    expect(areAllShipsSunk(board5)).toBe(false);

    const board6 = receiveAttack(board5, [1, 1]);
    expect(areAllShipsSunk(board6)).toBe(true);
  });
});

describe("getBoardStates", () => {
  test("handles invalid inputs", () => {
    expect(() => getBoardStates(null)).toThrow(TypeError);
  });

  test("returns 10x10 grid of empty cell states for empty board", () => {
    const boardStates = getBoardStates(emptyBoard);
    expect(boardStates).toHaveLength(10);
    boardStates.forEach((row) => {
      expect(row).toHaveLength(10);
      row.forEach((cell) => {
        expect(cell).toBe("empty");
      });
    });
  });

  test("records ship cell state", () => {
    const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
    const boardStates = getBoardStates(board1);
    expect(boardStates[0][0]).toBe("ship");
  });

  test("records hit cell state", () => {
    const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
    const board2 = receiveAttack(board1, [0, 0]);
    const boardStates = getBoardStates(board2);
    expect(boardStates[0][0]).toBe("hit");
  });

  test("records miss cell state", () => {
    const board1 = receiveAttack(emptyBoard, [0, 0]);
    const boardStates = getBoardStates(board1);
    expect(boardStates[0][0]).toBe("miss");
  });
});
