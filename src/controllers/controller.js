import { createTemplateGame } from "../models/gameState";
import { getBoardStates } from "../models/gameBoard.js";
import { renderGameState } from "../views/renderer";

/**
 * Represents the game state translated as display data for the view.
 * @typedef {Object} DisplayData
 * @property {CellState[][]} userBoardStates - a 10x10 grid of cell states from the user
 * @property {CellState[][]} computerBoardStates - a 10x10 grid of cell states from the computer
 */

/**
 * TEMP: Will implement a system for allowing players to place their ships later
 * Sets up a game of battleship.
 * @returns {void}
 */
export function startTemplateGame() {
  const templateGame = createTemplateGame();
  const displayData = createDisplayData(templateGame);
  renderGameState(displayData);
}

/**
 * Translates game state into display-ready data
 * @param {GameState} gameState - the game to extract data from
 * @returns {DisplayData} display data
 */
function createDisplayData(gameState) {
  return {
    userBoardStates: getBoardStates(gameState.user.gameBoard),
    computerBoardStates: getBoardStates(gameState.computer.gameBoard),
  };
}
