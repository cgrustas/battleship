import { freeze } from "../utils/functional.js";

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
 * @throws {TypeError} if ship length is not an integer
 * @throws {RangeError} if ship length is less than 1 or greater than 5
 */
export function createShip(length) {
  if (!Number.isInteger(length)) throw new TypeError("Ship must be an integer");
  if (length <= 0 || length > 5)
    throw new RangeError("Ship length must be between 1 and 5 (inclusive)");
  return freeze({
    length: Math.floor(length),
    hits: 0,
  });
}

/**
 * Records a hit on the ship
 * @param {Ship} ship - the ship to hit
 * @returns {Ship} a new ship with an incremented hit count
 */
export function hit(ship) {
  return freeze({
    ...ship,
    hits: ship.hits + 1,
  });
}

/**
 * Checks whether a ship is sunk. A ship is considered sunk if
 * its length is less than or equal to the number of hits it has received.
 * @param {Ship} ship - the ship to evaluate
 * @returns {boolean} true if ship is sunk, false otherwise
 */
export function isSunk(ship) {
  return ship.length <= ship.hits;
}
