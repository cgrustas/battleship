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

describe("valid ship creation", () => {
  test("creates smallest ship", () =>
    expect(createShip("destroyer", 2)).toEqual({
      id: "destroyer",
      length: 2,
      hits: 0,
    }));

  test("creates largest ship", () =>
    expect(createShip("carrier", 5)).toEqual({
      id: "carrier",
      length: 5,
      hits: 0,
    }));
});

describe("hit", () => {
  test("increments hit count", () => {
    const ship = createShip("cruiser", 3);
    expect(ship.hits).toBe(0);

    const shipHitOnce = hit(ship);
    expect(shipHitOnce.hits).toBe(1);

    const shipHitTwice = hit(shipHitOnce);
    expect(shipHitTwice.hits).toBe(2);
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
