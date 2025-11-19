import {
  areAllShipsSunk,
  createRandomGameBoard,
  receiveAttack,
  getBoardStates,
} from "./gameBoard";
import { createShip } from "./ship";

/**
 * Represents the current state of the battleship game.
 * @typedef {Object} GameState
 * @property {GameBoard} userGameBoard - the human's game board
 * @property {GameBoard} computerGameBoard - the computer's game board
 * @property {boolean} isUserTurn
 */

/**
 * Creates a new battleship game.
 * @returns {GameState} empty battleship game
 */
export function createGame() {
  return {
    userGameBoard: createRandomGameBoard(createStandardFleet()),
    computerGameBoard: createRandomGameBoard(createStandardFleet()),
    isUserTurn: true,
  };
}

/**
 * Creates a fleet of ships to be placed on each game board.
 * Uses Milton Bradley's version of the rules to specify the fleet.
 * @returns {Ship[]} fleet of ships
 */
function createStandardFleet() {
  return [
    createShip("carrier", 5),
    createShip("battleship", 4),
    createShip("cruiser", 3),
    createShip("submarine", 3),
    createShip("destroyer", 2),
  ];
}

/**
 * Attacks the cell at the given position on the computer's board
 * @param {GameState} gameState - the current state of the game
 * @param {number} row - the row on the board where the cell was attacked
 * @param {number} col - the column on the board where the cell was attacked
 * @returns {GameState} game state after attack has been processed
 */
export function processUserAttack(gameState, row, col) {
  return {
    ...gameState,
    computerGameBoard: receiveAttack(gameState.computerGameBoard, [row, col]),
    isUserTurn: false,
  };
}

/**
 * Attacks a random cell on the user's board
 * @param {GameState} gameState - the current state of the game
 * @returns {GameState} game state after attack has been processed
 */
export function processComputerAttack(gameState) {
  let row, col;
  const boardStates = getBoardStates(gameState.userGameBoard);
  do {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
  } while (boardStates[row][col] === "hit" || boardStates[row][col] === "miss");
  return {
    ...gameState,
    userGameBoard: receiveAttack(gameState.userGameBoard, [row, col]),
    isUserTurn: true,
  };
}

/**
 * Checks if a game is over
 * @param {GameState} gameState - the current state of the game
 * @returns {boolean} true if game is over, false otherwise
 */
export function isGameOver(gameState) {
  return (
    areAllShipsSunk(gameState.userGameBoard) ||
    areAllShipsSunk(gameState.computerGameBoard)
  );
}
