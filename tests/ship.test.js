import { createShip, hit, isSunk } from "../src/models/ship.js";

describe("createShip", () => {
  describe("input ship creation", () => {
    test("handles invalid ID", () => {
      expect(() => createShip(null, 3)).toThrow(TypeError);
      expect(() => createShip("", 3)).toThrow(TypeError);
    });

    test("handles invalid length type", () => {
      expect(() => createShip("valid ID", null)).toThrow(TypeError);
      expect(() => createShip("valid ID", 2.2)).toThrow(TypeError);
    });

    test("handles invalid length range", () => {
      expect(() => createShip("too small", 1)).toThrow(RangeError);
      expect(() => createShip("too big", 6)).toThrow(RangeError);
    });
  });

  describe("valid ship creation", () => {
    test("creates ships with correct properties", () => {
      const ship1 = createShip("destroyer", 2);
      expect(ship1).toEqual({
        id: "destroyer",
        length: 2,
        hits: 0,
      });

      const ship2 = createShip("cruiser", 3);
      expect(ship2).toEqual({
        id: "cruiser",
        length: 3,
        hits: 0,
      });
    });
  });
});

describe("hit", () => {
  test("increments hit count", () => {
    const ship1 = createShip("cruiser", 3);
    expect(ship1.hits).toBe(0);

    const ship2 = hit(ship1);
    expect(ship2.hits).toBe(1);

    const ship3 = hit(ship2);
    expect(ship3.hits).toBe(2);
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
