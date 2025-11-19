import {
  createGame,
  processUserAttack,
  processComputerAttack,
} from "../src/models/gameState";

/**
 * Represents the current state of the battleship game.
 * @typedef {Object} GameState
 * @property {GameBoard} userGameBoard - the human's game board
 * @property {GameBoard} computerGameBoard - the computer's game board
 */

/**
 * Attacks the cell at the given position on the computer's board
 * @param {GameState} gameState - the current state of the game
 * @param {number} row - the row on the board where the cell was attacked
 * @param {number} col - the column on the board where the cell was attacked
 * @returns {GameState} game state after attack has been processed
 */
// export function processUserAttack(gameState, row, col) {}

describe("createGameState", () => {
  test("creates game state with correct properties", () => {
    const gameState = createGame();
    expect(gameState.userGameBoard).toBeDefined();
    expect(gameState.computerGameBoard).toBeDefined();
    expect(gameState.isUserTurn).toBe(true);
  });
});

describe("process attacks", () => {
  test("processUserAttack updates computer's board with the attack result", () => {
    const game1 = createGame();
    const game2 = processUserAttack(game1, 4, 4);

    expect(game1.userGameBoard).toEqual(game2.userGameBoard);
    expect(game1.computerGameBoard).not.toEqual(game2.computerGameBoard);
    expect(game2.isUserTurn).toBe(false);
  });

  test("processComputerAttack updates user's board with the attack result", () => {
    const game1 = createGame();
    const game2 = processComputerAttack(game1);

    expect(game1.userGameBoard).not.toEqual(game2.userGameBoard);
    expect(game1.computerGameBoard).toEqual(game2.computerGameBoard);
    expect(game2.isUserTurn).toBe(true);
  });
});
