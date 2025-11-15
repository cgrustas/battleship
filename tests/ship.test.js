import { createShip, hit } from "../src/models/ship.js";

describe("createShip", () => {
  test("creates a ship with a valid length", () => {
    const ship1 = createShip(4);
    expect(ship1).toEqual({
      length: 4,
      hits: 0,
    });

    const ship2 = createShip(2);
    expect(ship2).toEqual({
      length: 2,
      hits: 0,
    });
  });

  test("throws error for non-integers", () => {
    expect(() => createShip(1.1)).toThrow(TypeError);
    expect(() => createShip(4.3)).toThrow(TypeError);
  });

  test("throws error for invalid length", () => {
    expect(() => createShip(0)).toThrow(RangeError);
    expect(() => createShip(6)).toThrow(RangeError);
  });
});

describe("hit", () => {
  test("increments hit count", () => {
    const ship = createShip(3);
    expect(ship.hits).toBe(0);

    const shipHitOnce = hit(ship);
    expect(shipHitOnce.hits).toBe(1);

    const shipHitTwice = hit(shipHitOnce);
    expect(shipHitTwice.hits).toBe(2);
  });
});
