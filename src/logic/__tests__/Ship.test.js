const Ship = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Ship.js");


describe("Ship", () => {
    test("should create a ship with a name and length", () => {
        const ship = new Ship("Battleship", 4);
        expect(ship.getName()).toBe("Battleship");
        expect(ship.getLength()).toBe(4);
    });

    test("should register a hit", () => {
        const ship = new Ship("Battleship", 4);
        ship.hit();
        expect(ship.getHits()).toBe(1);
    });

    test("should sink the ship when it reaches its length", () => {
        const ship = new Ship("Battleship", 4);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });

    test("should create different ships with different properties", () => {
        const destroyer = new Ship("Destroyer", 3);
        expect(destroyer.getName()).toBe("Destroyer");
        expect(destroyer.getLength()).toBe(3);
        expect(destroyer.getHits()).toBe(0);
        expect(destroyer.isSunk()).toBe(false);
    });

    test("should not sink ship when hits are less than length", () => {
        const submarine = new Ship("Submarine", 3);
        submarine.hit();
        submarine.hit();
        expect(submarine.getHits()).toBe(2);
        expect(submarine.isSunk()).toBe(false);
    });

    test("should correctly track multiple hits", () => {
        const patrolBoat = new Ship("Patrol Boat", 2);
        expect(patrolBoat.getHits()).toBe(0);
        patrolBoat.hit();
        expect(patrolBoat.getHits()).toBe(1);
        patrolBoat.hit();
        expect(patrolBoat.getHits()).toBe(2);
    });
});

    test("should sink the ship when it reaches its length", () => {
        const newShip = new Ship("Cruiser", 5);
        newShip.hit();
        newShip.hit();
        newShip.hit();
        newShip.hit();
        expect(newShip.isSunk()).toBe(false);
        newShip.hit();
        expect(newShip.isSunk()).toBe(true);
    });
