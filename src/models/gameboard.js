import { freeze } from "../utils/functional.js";
import { validateShip, hit, isSunk } from "./ship.js";

/**
 * Represents a battleship game board. Game boards can place ships at specific coordinates,
 * determine if attack is a hit or miss and update game state accordingly, and keep track of
 * previous hits and misses.
 * @typedef GameBoard
 * @property {Cell[][]} board - a 10x10 board full of cells
 * @property {Map} ships - stores key-value pairs as shipID-Ship
 */

/**
 * Represents a cell on a game board. Each cell tracks whether it contains a ship and whether
 * it has been attacked.
 * @typedef Cell
 * @property {string|null} shipID - the ID of the ship covering this cell, or null if empty
 * @property {boolean} isAttacked - Whether this cell has been attacked
 */

/**
 * Represents a cell on the battleship game board
 * @typedef {[number, number]} Position - [row, col] coordinate on a game board
 */

/**
 * Creates a game board with a random ship configuration.
 * @param ships - the ships to place on the game board
 * @returns {GameBoard}
 */
export function createRandomGameBoard(ships) {
  // define the board
  let board = createEmptyGameBoard();

  ships.forEach((ship) => {
    let placed = false;

    // generate a random valid coordinate and a random direction (horizontal/vertical)
    while (!placed) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const isHorizontal = Math.random() < 0.5;

      try {
        board = placeShip(board, ship, [row, col], isHorizontal);
        placed = true;
      } catch {
        // Try again
      }
    }
  });

  return board;
}

/**
 * Creates an empty game board for a player.
 * @returns {GameBoard} game board full of empty cells
 */
export function createEmptyGameBoard() {
  const board = Array(10)
    .fill(null)
    .map(() =>
      Array(10)
        .fill(null)
        .map(() => createEmptyCell()),
    );
  const ships = new Map();

  return {
    board,
    ships,
  };
}

/**
 * Places a ship on the game board. The ship extends down/right from its starting point
 * based on its orientation, and covers cells based on the ship length.
 * @param {GameBoard} gameBoard - the game board to add a ship to
 * @param {Ship} ship - ship to place on the board
 * @param {Position} startPos - starting position of the ship
 * @param {boolean} isHorizontal - true if ship's orientation is horizontal, false if vertical
 * @returns {GameBoard} - game board with a new ship
 * @throws {TypeError} if board is not a GameBoard, shipID is not a string,
 * startPos is not a Position, isHorizontal is not a boolean, or length is not a number
 * @throws {RangeError} if ship placement stretches outside the game board
 * @throws {Error} if ship placement conflicts with an existing ship, or if ship has already been placed on the board
 */
export function placeShip(gameBoard, ship, startPos, isHorizontal) {
  validateGameBoard(gameBoard);
  validateShip(ship);
  validatePosition(startPos);
  if (typeof isHorizontal !== "boolean")
    throw new TypeError("isHorizontal must be a boolean");
  if (gameBoard.ships.has(ship.id)) {
    throw new Error("Ship already placed on board");
  }

  const gameBoardCopy = structuredClone(gameBoard);
  const [startRow, startCol] = startPos;
  let [endRow, endCol] = startPos;

  isHorizontal
    ? (endCol = startCol + ship.length - 1)
    : (endRow = startRow + ship.length - 1);

  const endPos = [endRow, endCol];
  validatePosition(endPos);

  let row, col;
  if (isHorizontal) {
    row = startRow;
    for (col = startCol; col <= endCol; col++) {
      if (gameBoardCopy.board[row][col].shipID !== null)
        throw new Error("A ship is already stored in this position");
      gameBoardCopy.board[row][col] = createShipCell(ship.id);
    }
  } else {
    col = startCol;
    for (row = startRow; row <= endRow; row++) {
      if (gameBoardCopy.board[row][col].shipID !== null)
        throw new Error("A ship is already stored in this position");
      gameBoardCopy.board[row][col] = createShipCell(ship.id);
    }
  }

  gameBoardCopy.ships.set(ship.id, ship);
  return gameBoardCopy;
}

/**
 * Attacks a position on the game board, and records the coordinates of the attack.
 * If the attack hits a ship, it increments the hit count of that ship.
 * @param {GameBoard} gameBoard game board to be attacked
 * @param {Position} pos - the position on the game board to attack
 * @returns {GameBoard} game board with a new attack
 * @throws {TypeError} if game board or position is invalid
 * @throws {RangeError} if position is out of board range
 * @throws {Error} if position has already been attacked
 */
export function receiveAttack(gameBoard, pos) {
  validateGameBoard(gameBoard);
  validatePosition(pos);

  const [row, col] = pos;
  const isAttacked = gameBoard.board[row][col].isAttacked;
  if (isAttacked) throw new Error("This position has already been attacked");

  const gameBoardCopy = structuredClone(gameBoard);
  gameBoardCopy.board[row][col].isAttacked = true;

  const attackHits = gameBoardCopy.board[row][col].shipID !== null;
  if (attackHits) {
    const shipID = gameBoardCopy.board[row][col].shipID;
    const ship = gameBoardCopy.ships.get(shipID);
    const shipAfterHit = hit(ship);
    gameBoardCopy.ships.set(shipID, shipAfterHit);
  }

  return gameBoardCopy;
}

/**
 * Checks whether all ships are sunk on a game board
 * @param {GameBoard} gameBoard - the game board to check
 * @returns {boolean} true if all ships are sunk, false otherwise
 * @throws {TypeError} if gameBoard is invalid
 */
export function areAllShipsSunk(gameBoard) {
  validateGameBoard(gameBoard);
  for (const ship of gameBoard.ships.values()) {
    if (!isSunk(ship)) return false;
  }
  return true;
}

/**
 * Checks if a cell has been attacked an missed
 * @param {Cell} cell - the cell to check
 * @returns {boolean} true if cell has been attacked and missed, false otherwise
 */

function isMiss(cell) {
  return cell.isAttacked && cell.shipID === null;
}

/**
 * Checks if a cell has been attacked an hit
 * @param {Cell} cell - the cell to check
 * @returns {boolean} true if cell has been attacked and hit, false otherwise
 */
function isHit(cell) {
  return cell.isAttacked && cell.shipID !== null;
}

/**
 * Creates an empty cell for the game board.
 * @returns {Cell} empty cell that has not been attacked
 */
function createEmptyCell() {
  return freeze({
    shipID: null,
    isAttacked: false,
  });
}

/**
 * Creates a cell that contains a ship ID for the game board
 * @param {string} shipID - ship ID to store within the cell
 * @returns {Cell} an un-attacked cell with a ship ID
 */
function createShipCell(shipID) {
  return freeze({
    shipID,
    isAttacked: false,
  });
}

/**
 * Validates a game board
 * @param {GameBoard} gameBoard - game board to validate
 * @returns {void}
 * @throws {TypeError} if board is invalid
 */
function validateGameBoard(gameBoard) {
  if (!Array.isArray(gameBoard.board) || gameBoard.board.length !== 10) {
    throw new TypeError("Board must be a 10x10 array");
  }
}

/**
 * Checks if a position is outside of the game board
 * @param pos - position to check
 * @returns {void}
 * @throws {TypeError} if position type is invalid
 * @throws {RangeError} if position is outside of the game board
 */
function validatePosition(pos) {
  if (!Array.isArray(pos) || pos.length !== 2)
    throw new TypeError(
      "Starting position must be an array of [row, col] coordinates",
    );

  const [row, col] = pos;
  if (row < 0 || row > 9 || col < 0 || col > 9)
    throw new RangeError("Position is outside of the game board");
}

/**
 * Checks if a cell is occupied by a ship
 * @param {Cell} cell - cell to check
 */
function hasShipAt(cell) {
  return cell.shipID !== null;
}

/**
 * Gets the display state of each cell on the board. Transforms internal board
 * representation into a 10x10 grid of display states for UI rendering.
 * @param {GameBoard} gameBoard - the game board to get display states from
 * @returns {string[][]} 10x10 grid where each cell is "empty", "ship", "hit", or "miss"
 * @throws {TypeError} if gameBoard is invalid
 */
export function getBoardStates(gameBoard) {
  validateGameBoard(gameBoard);

  const cellStates = [];
  gameBoard.board.forEach((row) => {
    const rowOfStates = [];
    row.forEach((cell) => {
      let value;
      if (isMiss(cell)) value = "miss";
      else if (isHit(cell)) value = "hit";
      else if (hasShipAt(cell)) value = "ship";
      else value = "empty";

      rowOfStates.push(value);
    });

    cellStates.push(rowOfStates);
  });

  return cellStates;
}

/**
 * Checks if a game board ahs received attacks
 * @param {GameBoard} gameBoard - the game board to check
 * @returns
 */
export function hasReceivedAttacks(gameBoard) {
  return gameBoard.board.some((row) => row.some((cell) => cell.isAttacked));
}
