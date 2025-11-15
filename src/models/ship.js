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
 */
export function createShip(length) {
  if (length <= 0) throw new Error("Ship length must be positive");
  return freeze({
    length,
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
