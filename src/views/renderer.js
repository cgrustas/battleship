/**
 * Represents the display state of a cell on the game board. Each cell state
 * indicates what should be rendered in the UI based on ship presence and attack status.
 * This transformation keeps the view decoupled from the model's structure.
 * @typedef {"empty" | "ship" | "hit" | "miss"} CellState
 */

/**
 * @callback ComputerCellClickHandler
 * @param {number} row - Row index of the clicked cell (0-9)
 * @param {number} col - Column index of the clicked cell (0-9)
 * @returns {void}
 */

/**
 * Displays a game of battleship on the page.
 * @param {DisplayData} displayData - the game state to display
 * @returns {void}
 */
export function displayGame(displayData) {
  const body = document.querySelector("body");
  body.innerHTML = "";
  const battlefields = createBattlefields(
    displayData.userBoardStates,
    displayData.computerBoardStates,
  );
  body.appendChild(battlefields);
}

/**
 * Creates a container with two grids showing the current state of each player's board.
 * @param {CellState[][]} userBoardStates - 10x10 grid of cell states for the user's board
 * @param {CellState[][]} computerBoardStates - 10x10 grid of cell states for the computer's board
 * @returns {HTMLDivElement} battlefields container
 */
function createBattlefields(userBoardStates, computerBoardStates) {
  const battlefields = document.createElement("div");
  battlefields.classList.add("battlefields");

  const userBattlefield = createUserBattlefield(userBoardStates);
  const computerBattlefield = createComputerBattlefield(computerBoardStates);

  battlefields.appendChild(userBattlefield);
  battlefields.appendChild(computerBattlefield);
  return battlefields;
}

/**
 * Creates a container with a battlefield grid and user label,
 * showing the current state of the user's board.
 * @param {CellState[][]} userBoardStates - 10x10 grid of cell states for the user's board
 * @returns {HTMLDivElement} user battlefield container
 */
function createUserBattlefield(userBoardStates) {
  const userBattlefield = document.createElement("div");
  userBattlefield.classList.add("user");

  const grid = createBattlefieldGrid(userBoardStates);
  const label = createBattlefieldLabel("Your Grid");

  userBattlefield.appendChild(grid);
  userBattlefield.appendChild(label);
  return userBattlefield;
}

/**
 * Creates a container with a battlefield grid and user label,
 * showing the current state of the user's board.
 * @param {CellState[][]} computerBoardStates - 10x10 grid of cell states for the computer's board
 * @returns {HTMLDivElement} computer battlefield container
 */
function createComputerBattlefield(computerBoardStates) {
  const computerBattlefield = document.createElement("div");
  computerBattlefield.classList.add("computer");

  const grid = createBattlefieldGrid(computerBoardStates);
  const label = createBattlefieldLabel("Opponent's Grid");

  computerBattlefield.appendChild(grid);
  computerBattlefield.appendChild(label);
  return computerBattlefield;
}

/**
 * Creates a grid element displaying the state of a game board.
 * Generates a 10x10 grid of cell elements, each styled according to its state.
 * @param {GameBoard} boardStates - the game board states to display
 * @returns {HTMLDivElement} battlefield grid element containing all cells
 */
function createBattlefieldGrid(boardStates) {
  const grid = document.createElement("div");
  grid.classList.add("battlefield-grid");

  boardStates.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("battlefield-row");
    row.forEach((state) => {
      const cell = document.createElement("div");
      cell.classList.add("battlefield-cell");
      cell.classList.add(state);

      rowDiv.appendChild(cell);
    });

    grid.appendChild(rowDiv);
  });

  return grid;
}

/**
 * Registers a call back when a computer cell is clicked
 * @param {ComputerCellClickHandler} callback - function to call when a cell is clicked
 * @returns {void}
 */
export function onComputerCellClick(callback) {
  const computerCells = document.querySelectorAll(
    ".computer .battlefield-cell",
  );
  computerCells.forEach((cell, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;
    cell.addEventListener("click", () => callback(row, col));
  });
}

/**
 * Creates a battlefield label for a player.
 * @param {string} text - description of the player's battlefield (i.e. "your grid", "opponents grid")
 * @returns {HTMLDivElement} battlefield label
 */
function createBattlefieldLabel(text) {
  const label = document.createElement("div");
  label.classList.add("battlefield-label");
  label.textContent = text;
  return label;
}
