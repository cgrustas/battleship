import {
  createGame,
  processUserAttack,
  processComputerAttack,
  isGameOver,
} from "../models/gameState";
import { getBoardStates } from "../models/gameBoard.js";
import { displayGame, onComputerCellClick } from "../views/renderer";

/**
 * Represents the game state translated as display data for the view.
 * @typedef {Object} DisplayData
 * @property {CellState[][]} userBoardStates - a 10x10 grid of cell states from the user
 * @property {CellState[][]} computerBoardStates - a 10x10 grid of cell states from the computer
 */

let gameState;

export function startGame() {
  gameState = createGame();
  updateScreen();
}

/**
 * Updates the screen to reflect the current state of the game.
 * Called during initialization, and on every state change.
 * @returns {void}
 */
function updateScreen() {
  const displayData = createDisplayData();
  displayGame(displayData);
  setUpGameHandlers();
}

/**
 * Translates game state into display-ready data
 * @returns {DisplayData} display data
 */
function createDisplayData() {
  return {
    userBoardStates: getBoardStates(gameState.userGameBoard),
    computerBoardStates: maskOpponentShips(
      getBoardStates(gameState.computerGameBoard),
    ),
  };
}

/**
 * Masks ship positions that haven't been hit, showing them as empty cells.
 * Used to hide opponent's ship locations from the player's view.
 * @param {CellState[][]} boardStates - 10x10 grid of cell states
 * @returns {CellState[][]} Board states with "ship" replaced by "empty"
 */
function maskOpponentShips(boardStates) {
  return boardStates.map((row) =>
    row.map((state) => (state === "ship" ? "empty" : state)),
  );
}

/**
 * Connects game logic handlers to DOM events. Wires user interactions
 * from the view to their corresponding game actions in the controller.
 * @returns {void}
 */
function setUpGameHandlers() {
  onComputerCellClick(handleUserAttack);
}

/**
 * Attacks the cell at the given position on the computer's board
 * @param {number} row - the row on the board where the cell was attacked
 * @param {number} col - the column on the board where the cell was attacked
 * @returns {void}
 */
function handleUserAttack(row, col) {
  if (!gameState.isUserTurn) return;

  try {
    gameState = processUserAttack(gameState, row, col); // update reference
    updateScreen();

    if (!isGameOver(gameState)) {
      setTimeout(() => {
        gameState = processComputerAttack(gameState); // update reference
        updateScreen();
      }, 1000);
    }
  } catch (error) {
    if (error.message === "This position has already been attacked") {
      return; // Stay on user's turn, ignore the click
    }

    throw error;
  }
}
