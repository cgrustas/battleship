import { createShip, hit, isSunk } from "../src/models/ship.js";

describe("createShip", () => {
  describe("input type validation", () => {
    test("handles invalid ID", () => {
      expect(() => createShip(null, 3)).toThrow(TypeError);
      expect(() => createShip("", 3)).toThrow(TypeError);
    });

    test("handles invalid length type", () => {
      expect(() => createShip("valid ID", null)).toThrow(TypeError);
      expect(() => createShip("valid ID", 2.2)).toThrow(TypeError);
    });
  });
});

describe("invalid ship creation", () => {
  test("handles invalid length range", () => {
    expect(() => createShip("too small", 1)).toThrow(RangeError);
    expect(() => createShip("too big", 6)).toThrow(RangeError);
  });
});

describe("hit", () => {
  test("increments hit count", () => {
    const ship1 = createShip("cruiser", 3);
    expect(isSunk(ship1)).toBe(false);

    const ship2 = hit(ship1);
    const ship3 = hit(ship2);
    expect(isSunk(ship3)).toBe(false);

    const ship4 = hit(ship3);
    expect(isSunk(ship4)).toBe(true);
  });
});

describe("isSunk", () => {
  test("returns false when hits are less than length", () => {
    const ship = createShip("destroyer", 2);
    expect(isSunk(ship)).toBe(false);

    const damagedShip = hit(ship);
    expect(isSunk(damagedShip)).toBe(false);
  });

  test("returns true when hits are greater than or equal to length", () => {
    const ship = createShip("destroyer", 2);

    const damagedShip = hit(ship);
    const sunkenShip = hit(damagedShip);
    expect(isSunk(sunkenShip)).toBe(true);
  });
});
