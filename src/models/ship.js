/**
 * Represents a ship in the battleship game. Each ship includes a length,
 * the number of times they’ve been hit, and whether or not they’ve been sunk.
 */
export class Ship {
  #length;
  #hits;
  #isSunk;

  constructor(length, hits = 0, isSunk = false) {
    this.#length = length;
    this.#hits = hits;
    this.#isSunk = isSunk;
  }
}
