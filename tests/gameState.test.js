import { createTemplateGame, switchTurn } from "../src/models/gameState";

let templateGame;

beforeEach(() => {
  templateGame = createTemplateGame();
});

/**
 * Represents the current state of the battleship game.
 * @typedef {Object} GameState
 * @property {Player} user - the human user playing the game
 * @property {Player} computer - the computer the human is facing
 * @property {boolean} isUserTurn - true if user is the active player, false otherwise
 */
describe("switchTurn", () => {
  test("switches active player from computer to user", () => {
    expect(templateGame.isUserTurn).toBe(true);
    const game = switchTurn(templateGame);
    expect(game.isUserTurn).toBe(false);
  });

  test("switches player multiple times", () => {
    expect(templateGame.isUserTurn).toBe(true);

    const game1 = switchTurn(templateGame);
    expect(game1.isUserTurn).toBe(false);

    const game2 = switchTurn(game1);
    expect(game2.isUserTurn).toBe(true);

    const game3 = switchTurn(game2);
    expect(game3.isUserTurn).toBe(false);
  });
});
