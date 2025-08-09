const Gameboard = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Gameboard.js");
const Ship = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Ship.js");
const {Player, HumanPlayer, ComputerPlayer} = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Player.js");

describe("Human Player", () => {
    test("should create a human player with a name and an empty gameboard", () => {
        const player = new HumanPlayer("Player1");
        expect(player.getName()).toBe("Player1");
        expect(player.getGameboard().getBoard()).toHaveLength(10);
        expect(player.getGameboard().getBoard()[0]).toHaveLength(10);
    });

    test("should place a ship on the human player's gameboard", () => {
        const player = new HumanPlayer("Player1");
        const ship = new Ship("Battleship", 4);
        expect(player.placeShip(ship, [0, 0], "horizontal")).toBe(true);
        expect(player.getGameboard().getBoard()[0][0]).toBe(ship);
    });

    test("should receive an attack and register hits or misses", () => {
        const player = new HumanPlayer("Player1");
        const opponent = new HumanPlayer("Player2");
        const ship = new Ship("Battleship", 4);
        player.placeShip(ship, [0, 0], "horizontal");

        expect(opponent.attack(player.getGameboard(), [0, 0])).toBe(true);
        expect(ship.getHits()).toBe(1);
        expect(opponent.attack(player.getGameboard(), [1, 1])).toBe(false);
    });

    test("should check if all ships are sunk", () => {
        const player = new HumanPlayer("Player1");
        const ship = new Ship("Battleship", 4);
        player.placeShip(ship, [0, 0], "horizontal");

        for (let i = 0; i < ship.getLength(); i++) {
            player.getGameboard().receiveAttack([0, i]);
        }
        
        expect(player.getGameboard().areAllShipsSunk()).toBe(true);
    });
});

describe("Computer Player", () => {
    test("should create a computer player with a name and an empty gameboard", () => {
        const computer = new ComputerPlayer();
        expect(computer.getName()).toBe("Computer");
        expect(computer.getGameboard().getBoard()).toHaveLength(10);
        expect(computer.getGameboard().getBoard()[0]).toHaveLength(10);
    });

    test("should place a ship on the computer's gameboard", () => {
        const computer = new ComputerPlayer();
        const ship = new Ship("Battleship", 4);
        expect(computer.placeShip(ship, [0, 0], "horizontal")).toBe(true);
        expect(computer.getGameboard().getBoard()[0][0]).toBe(ship);
    });

    test("should choose a random move from available moves", () => {
        const computer = new ComputerPlayer();
        const move = computer.chooseMove();
        expect(move).toBeDefined();
        expect(move.length).toBe(2);
    });

    test("should place ships randomly on the computer's gameboard", () => {
        const computer = new ComputerPlayer();
        const ships = [
            new Ship("Destroyer", 2),
            new Ship("Submarine", 3),
            new Ship("Battleship", 4)
        ];
        
        expect(computer.placeShipsRandomly(ships)).toBe(true);
        
        // Check that all ships were placed
        const board = computer.getGameboard().getBoard();
        let shipCells = 0;
        
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                if (board[y][x] !== null) {
                    shipCells++;
                }
            }
        }
        
        // Sum of all ship lengths should equal number of occupied cells
        const totalShipLength = ships.reduce((sum, ship) => sum + ship.getLength(), 0);
        expect(shipCells).toBe(totalShipLength);
    });

    test("should attack the opponent's gameboard", () => {
        const player1 = new HumanPlayer("Player1");
        const player2 = new HumanPlayer("Player2");
        const ship = new Ship("Battleship", 4);
        player1.placeShip(ship, [0, 0], "horizontal");

        expect(player2.attack(player1.getGameboard(), [0, 0])).toBe(true);
        expect(ship.getHits()).toBe(1);
        expect(player2.attack(player1.getGameboard(), [1, 1])).toBe(false);
    });

    test("computer should attack the opponent's gameboard", () => {
        const player1 = new HumanPlayer("Player1");
        const computer = new ComputerPlayer();
        const ship = new Ship("Battleship", 4);
        player1.placeShip(ship, [0, 0], "horizontal");

        expect(computer.attack(player1.getGameboard())).toBe(true);
        expect(ship.getHits()).toBe(1);
        expect(computer.attack(player1.getGameboard())).toBe(false);
    });
});
