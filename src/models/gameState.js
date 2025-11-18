import { createGameBoard, placeShip } from "./gameBoard";
import { createShip } from "./ship";
import { createPlayer } from "./player";

/**
 * Represents the current state of the battleship game.
 * @typedef {Object} GameState
 * @property {Player} user - the human user playing the game
 * @property {Player} computer - the computer the human is facing
 */

/**
 * TEMP: Will implement a system for allowing players to place their ships later
 * Creates a game with each player holding a game board with 5 ships,
 * all laid horizontally in the top five rows of the game board.
 * @returns {Player} players with template game boards
 */
export function createTemplateGame() {
  const carrier = createShip("carrier", 5);
  const battleship = createShip("battleship", 4);
  const cruiser = createShip("cruiser", 3);
  const submarine = createShip("submarine", 3);
  const destroyer = createShip("destroyer", 2);

  const emptyBoard = createGameBoard();
  const board1 = placeShip(emptyBoard, carrier, [0, 0], true);
  const board2 = placeShip(board1, battleship, [1, 0], true);
  const board3 = placeShip(board2, cruiser, [2, 0], true);
  const board4 = placeShip(board3, submarine, [3, 0], true);
  const templateBoard = placeShip(board4, destroyer, [4, 0], true);

  const user = createPlayer(templateBoard);
  const computer = createPlayer(structuredClone(templateBoard));

  return {
    user,
    computer,
  };
}
