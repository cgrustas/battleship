import {
  createGame,
  processUserAttack,
  processComputerAttack,
  isGameOver,
  randomizeUserBoard,
} from "../models/gameState";
import {
  getBoardStates,
  areAllShipsSunk,
  hasReceivedAttacks,
} from "../models/gameBoard.js";
import {
  displayGame,
  onComputerCellClick,
  onPlayAgainButtonClick,
  onRandomizeButtonClick,
} from "../views/renderer";

/**
 * Represents the game state translated as display data for the view.
 * @typedef {Object} DisplayData
 * @property {CellState[][]} userBoardStates - a 10x10 grid of cell states from the user
 * @property {CellState[][]} computerBoardStates - a 10x10 grid of cell states from the computer
 * @property {boolean} isGameOver - true if the game is over, false otherwise
 * @property {"user"|"computer"|null} winner - "user" if user won, "computer" if computer won, null if game is not over
 * @property {boolean} canRandomize - true if the user can randomize the game board, false otherwise
 */

let gameState;

/**
 * Starts a new game of battleship
 * @returns {void}
 */
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
  const userWon = areAllShipsSunk(gameState.computerGameBoard);
  const computerWon = areAllShipsSunk(gameState.userGameBoard);
  const canRandomize =
    !hasReceivedAttacks(gameState.computerGameBoard) &&
    !hasReceivedAttacks(gameState.userGameBoard);

  return {
    userBoardStates: getBoardStates(gameState.userGameBoard),
    computerBoardStates: maskOpponentShips(
      getBoardStates(gameState.computerGameBoard),
    ),
    isGameOver: userWon || computerWon,
    winner: userWon ? "user" : computerWon ? "computer" : null,
    canRandomize,
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
  onPlayAgainButtonClick(startGame);
  onRandomizeButtonClick(handleUserBoardRandomization);
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

/**
 * Randomizes the user's board
 * @returns {void}
 */
function handleUserBoardRandomization() {
  gameState = randomizeUserBoard(gameState);
  updateScreen();
}
