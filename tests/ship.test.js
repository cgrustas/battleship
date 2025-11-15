import { createShip, hit } from "../src/models/ship.js";

describe("Ship", () => {
  test("hit()", () => {
    const ship = createShip(3);
    expect(ship.hits).toBe(0);

    const shipHitOnce = hit(ship);
    expect(shipHitOnce.hits).toBe(1);

    const shipHitTwice = hit(shipHitOnce);
    expect(shipHitTwice.hits).toBe(2);
  });
});
