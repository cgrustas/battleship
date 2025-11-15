/**
 * Represents a ship in the battleship game. Each ship includes a length,
 * the number of times they’ve been hit, and whether or not they’ve been sunk.
 */
export class Ship {
  #length;
  #hits;
  #isSunk;

  constructor(length) {
    this.#length = length;
    this.#hits = 0;
    this.#isSunk = false;
  }
}
