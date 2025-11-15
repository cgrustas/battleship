/**
 * Represents a ship in the battleship game. Each ship includes a length,
 * the number of times they’ve been hit, and whether or not they’ve been sunk.
 * @typedef {Object} Ship
 * @property {number} length - the length of the ship
 * @property {number} hits - the number of times the ship has been hit
 */

/**
 * Creates a new ship with the specified length.
 * @param {number} length - the length of the ship
 * @returns {Ship} a new ship with no hits
 */
function createShip(length) {
  if (length <= 0) throw new Error("Ship length must be positive");
  return Object.freeze({
    length,
    hits: 0,
  });
}
