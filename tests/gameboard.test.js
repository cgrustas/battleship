import { createShip } from "../src/models/ship";
import {
  createGameBoard,
  placeShip,
  receiveAttack,
  getHits,
  getMisses,
  areAllShipsSunk,
} from "../src/models/gameBoard.js";

let emptyBoard;
let destroyer;

beforeEach(() => {
  emptyBoard = createGameBoard();
  destroyer = createShip("destroyer", 2);
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
    // TEMP: testing through internals until public API is complete
    test("places ship at top left corner", () => {
      // test initial state
      expect(emptyBoard.board[0][0].shipID).toBeNull();
      expect(emptyBoard.board[0][1].shipID).toBeNull();

      // place ship at top left corner
      const board = placeShip(emptyBoard, destroyer, [0, 0], true);

      // confirm that ship is held at top left corner
      expect(board.board[0][0].shipID).toBe("destroyer");
      expect(board.board[0][1].shipID).toBe("destroyer");
    });

    // TEMP: testing through internals until public API is complete
    test("places ship at bottom right corner", () => {
      // test initial state
      expect(emptyBoard.board[9][8].shipID).toBeNull();
      expect(emptyBoard.board[9][9].shipID).toBeNull();

      // place ship at top left corner
      const board = placeShip(emptyBoard, destroyer, [9, 8], true);

      // confirm that ship is held at top left corner
      expect(board.board[9][8].shipID).toBe("destroyer");
      expect(board.board[9][9].shipID).toBe("destroyer");
    });
  });

  describe("ship tracking", () => {
    // TEMP: testing through internals until public API is complete
    test("track multiple ships independently", () => {
      const board1 = placeShip(
        emptyBoard,
        createShip("ship1", 2),
        [0, 0],
        true,
      );
      const board2 = placeShip(board1, createShip("ship2", 2), [1, 0], true);

      const ship1ID = board2.board[0][0].shipID;
      const ship2ID = board2.board[1][0].shipID;

      expect(ship1ID).toBe("ship1");
      expect(ship2ID).toBe("ship2");
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
    // TEMP: testing through internals until public API is complete
    test("records attack on empty cell as miss", () => {
      // test initial board state
      expect(getMisses(emptyBoard)).not.toContainEqual([0, 0]);

      // receive attack
      const board = receiveAttack(emptyBoard, [0, 0]);

      // test final board state
      expect(getMisses(board)).toContainEqual([0, 0]);
    });

    // TEMP: testing through internals until public API is complete
    test("records attack on ship cell as hit", () => {
      // test initial board state
      const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
      expect(getHits(board1)).not.toContainEqual([0, 0]);

      // receive attack
      const board2 = receiveAttack(board1, [0, 0]);

      // test final board state
      expect(getHits(board2)).toContainEqual([0, 0]);
    });

    // TEMP: testing through internals until public API is complete
    test("accumulates multiple attacks", () => {
      expect(getMisses(emptyBoard)).toHaveLength(0);

      const board1 = receiveAttack(emptyBoard, [0, 0]);
      const board2 = receiveAttack(board1, [1, 1]);

      expect(getMisses(board2)).toHaveLength(2);
    });
  });
  describe("ship damage", () => {
    // TEMP: testing through internals until public API is complete
    test("increments hit count on correct ship", () => {
      const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
      expect(board1.ships.get("destroyer").hits).toBe(0);

      const board2 = receiveAttack(board1, [0, 0]);
      expect(board2.ships.get("destroyer").hits).toBe(1);
    });

    test("does not increment hit count on miss", () => {
      const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
      expect(board1.ships.get("destroyer").hits).toBe(0);

      const board2 = receiveAttack(board1, [5, 5]);
      expect(board2.ships.get("destroyer").hits).toBe(0);
    });

    // TEMP: testing through internals until public API is complete
    test("damages correct ship when multiple ships on board", () => {
      const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
      const board2 = placeShip(board1, createShip("carrier", 5), [1, 0], true);
      expect(board2.ships.get("destroyer").hits).toBe(0);
      expect(board2.ships.get("carrier").hits).toBe(0);

      const board3 = receiveAttack(board2, [0, 0]);

      expect(board3.ships.get("destroyer").hits).toBe(1);
      expect(board3.ships.get("carrier").hits).toBe(0);
    });
  });
});

describe("getMisses", () => {
  test("handles invalid game board", () => {
    expect(() => getMisses(null)).toThrow(TypeError);
  });

  test("returns an empty array for board with no attacks", () => {
    expect(getMisses(emptyBoard)).toHaveLength(0);
  });
  test("records multiple misses", () => {
    const board1 = receiveAttack(emptyBoard, [0, 0]);
    const board2 = receiveAttack(board1, [1, 1]);

    expect(getMisses(board2)).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });
  test("excludes hits from results", () => {
    const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
    const board2 = receiveAttack(board1, [0, 0]);
    const board3 = receiveAttack(board2, [0, 1]);
    const board4 = receiveAttack(board3, [1, 1]);

    expect(getMisses(board4)).toHaveLength(1);
  });
});

describe("getHits", () => {
  test("handles invalid game board", () => {
    expect(() => getHits(null)).toThrow(TypeError);
  });

  test("returns an empty array for board with no attacks", () => {
    expect(getHits(emptyBoard)).toHaveLength(0);
  });

  test("records multiple hits", () => {
    const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
    const board2 = receiveAttack(board1, [0, 0]);
    const board3 = receiveAttack(board2, [0, 1]);

    expect(getHits(board3)).toEqual([
      [0, 0],
      [0, 1],
    ]);
  });

  test("excludes misses from results", () => {
    const board1 = placeShip(emptyBoard, destroyer, [0, 0], true);
    const board2 = receiveAttack(board1, [1, 1]);
    const board3 = receiveAttack(board2, [2, 2]);
    const board4 = receiveAttack(board3, [0, 0]);

    expect(getHits(board4)).toHaveLength(1);
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
