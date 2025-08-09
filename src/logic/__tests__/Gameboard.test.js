const Gameboard = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Gameboard.js");
const Ship = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Ship.js");


describe("Gameboard", () => {
    // Test for creating a gameboard
    test("should create a gameboard with a specified size", () => {
        const board = new Gameboard();
        expect(board.getBoard()).toHaveLength(board.getSize());
        expect(board.getBoard()[0]).toHaveLength(board.getSize());
    });


    // Testing placing ships
    test("should place a ship on the board horizontally", () => {
        const board = new Gameboard();
        const ship = new Ship("Battleship", 4);
        board.placeShip(ship, [0, 0], "horizontal");
        expect(board.getBoard()[0][0]).toBe(ship);
        expect(board.getBoard()[0][1]).toBe(ship);
        expect(board.getBoard()[0][2]).toBe(ship);
        expect(board.getBoard()[0][3]).toBe(ship);
    });

    test("should place a ship on the board vertically", () => {
        const board = new Gameboard();
        const ship = new Ship("Battleship", 4);
        board.placeShip(ship, [0, 0], "vertical");
        expect(board.getBoard()[0][0]).toBe(ship);
        expect(board.getBoard()[1][0]).toBe(ship);
        expect(board.getBoard()[2][0]).toBe(ship);
        expect(board.getBoard()[3][0]).toBe(ship);
    });

    test("should not place a ship out of bounds horizontally", () => {
        const board = new Gameboard();
        const ship = new Ship("Battleship", 4);
        expect(() => {
            board.placeShip(ship, [7, 0], "horizontal");
        }).toThrow("Ship placement out of bounds horizontally");
    });

    test("should not place a ship out of bounds vertically", () => {
        const board = new Gameboard();
        const ship = new Ship("Battleship", 4);
        expect(() => {
            board.placeShip(ship, [0, 7], "vertical");
        }).toThrow("Ship placement out of bounds vertically");
    });

    test("should not place a ship where another ship exists", () => {
        const board = new Gameboard();
        const ship1 = new Ship("Battleship", 4);
        const ship2 = new Ship("Cruiser", 3);
        board.placeShip(ship1, [0, 0], "horizontal");
        expect(() => {
            board.placeShip(ship2, [0, 0], "vertical");
        }).toThrow("Cannot place ship where another ship exists");
    });

    // Testing ship hits and misses
    test("should record hits on ship object", () => {
        const board = new Gameboard();
        const ship = new Ship("Battleship", 4);
        board.placeShip(ship, [0, 0], "horizontal");
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        board.receiveAttack([0, 2]);
        expect(ship.getHits()).toBe(3);
    });

    test("should record hit locations", () => {
        const board = new Gameboard();
        const ship = new Ship("Battleship", 4);
        board.placeShip(ship, [0, 0], "horizontal");
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        expect(board.getHits()).toEqual([[0, 0], [0, 1]]);
    });

    test("should record miss locations", () => {
        const board = new Gameboard();
        const ship = new Ship("Battleship", 4);
        board.placeShip(ship, [0, 0], "horizontal");
        board.receiveAttack([0, 0]);
        board.receiveAttack([1, 1]);
        board.receiveAttack([6,4])
        expect(board.getMisses()).toEqual([[1, 1], [6, 4]]);
    });


    // check for if all ships have sunk
    test("should record all ships have sunk", () => {
        const board = new Gameboard();
        const ship1 = new Ship("Battleship", 4);
        const ship2 = new Ship("Cruiser", 3);
        board.placeShip(ship1, [0, 0], "horizontal");
        board.placeShip(ship2, [1, 1], "vertical");
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        board.receiveAttack([0, 2]);
        board.receiveAttack([0, 3]);
        board.receiveAttack([1, 1]);
        board.receiveAttack([2, 1]);
        board.receiveAttack([3, 1]);
        expect(board.areAllShipsSunk()).toBe(true);
    });

    test("should record not all ships have sunk", () => {
        const board = new Gameboard();
        const ship1 = new Ship("Battleship", 6);
        const ship2 = new Ship("Cruiser", 3);
        board.placeShip(ship1, [0, 0], "horizontal");
        board.placeShip(ship2, [1, 1], "vertical");
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        board.receiveAttack([0, 2]);
        board.receiveAttack([0, 3]);
        board.receiveAttack([1, 1]);
        board.receiveAttack([2, 1]);
        board.receiveAttack([3, 1]);
        expect(board.areAllShipsSunk()).toBe(false);
    });

});