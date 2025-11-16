import { createGameBoard } from "../src/models/gameboard";

describe("createGameBoard", () => {
  test("creates 10x10 game board", () => {
    const board = createGameBoard();
    expect(board).toHaveLength(10);

    board.forEach((row) => {
      expect(row).toHaveLength(10);
    });
  });
});
