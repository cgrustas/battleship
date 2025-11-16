import { freeze } from "../utils/functional.js";
import { validateShip } from "./ship.js";

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
 * Creates an empty game board for a player.
 * @returns {GameBoard} game board full of empty cells
 */
export function createGameBoard() {
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
 * SIDE EFFECT: Places ship in GameBoard.ships maps
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
 * Checks whether a ship covers the position on the board
 * @param {GameBoard} gameBoard - the game board
 * @param {Position} pos - the position on the game board
 * @returns {string|null} true if ship occupies the position, false otherwise
 * @throws {RangeError} if position is outside of the board
 */
export function getShipIDAt(gameBoard, pos) {
  validatePosition(pos);
  const [row, col] = pos;
  return gameBoard.board[row][col].shipID;
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
