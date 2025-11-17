import { createGameBoard } from "./gameBoard.js";

/**
 * Represents a player in the battleship game. A player is either a 'real' or 'computer' player.
 * Each player holds a game board.
 * @typedef {Object} Player
 * @property {GameBoard} gameBoard - the game board the player holds
 */

/**
 * Creates a player object
 * @returns {Player} a player holding an empty game board
 */
export function createPlayer() {
  return {
    gameBoard: createGameBoard(),
  };
}
