import { freeze } from "../utils/functional.js";
/**
 * Represents a battleship game board. Game boards can place ships at specific coordinates,
 * determine if attack is a hit or miss and update game state accordingly, and keep track of
 * previous hits and misses.
 * @typedef GameBoard
 * @property {Cell[][]} board - a 10x10 board full of cells
 */

/**
 * Represents a cell on a game board. Each cell tracks whether it contains a ship and whether
 * it has been attacked.
 * @typedef Cell
 * @property {string|null} shipID - the ID of the ship covering this cell, or null if empty
 * @property {boolean} isAttacked - Whether this cell has been attacked
 */

/**
 * Creates an empty game board for a player.
 * @returns {GameBoard} game board full of empty cells
 */
export function createGameBoard() {
  return Array(10)
    .fill(null)
    .map(() =>
      Array(10)
        .fill(null)
        .map(() => createEmptyCell()),
    );
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
