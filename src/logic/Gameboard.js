import Ship from "./Ship.js";

export default class Gameboard {
    constructor(size = 10) {
        this.ships = [];
        this.board = Array.from({ length: size}, () => 
            Array(size).fill(null)
        );
        this.size = size;
        this.logOfHits = [];
        this.logOfMisses = [];
    }

    placeShip(ship, coordinates, orientation) {
        const [x, y] = coordinates; // [x, y]
        
        if (orientation === "horizontal") {
            if (x + ship.getLength() > this.size) {
                throw new Error("Ship placement out of bounds horizontally");
            }
            
            // Check if any position is already occupied
            for (let i = 0; i < ship.getLength(); i++) {
                if (this.board[y][x + i] !== null) {
                    throw new Error("Cannot place ship where another ship exists");
                }
            }
            
            // Place the ship
            for (let i = 0; i < ship.getLength(); i++) {
                this.board[y][x + i] = ship;
            }
        } else if (orientation === "vertical") {
            if (y + ship.getLength() > this.size) {
                throw new Error("Ship placement out of bounds vertically");
            }
            
            // Check for existing ships
            for (let i = 0; i < ship.getLength(); i++) {
                if (this.board[y + i][x] !== null) {
                    throw new Error("Cannot place ship where another ship exists");
                }
            }
            
            // Place the ship
            for (let i = 0; i < ship.getLength(); i++) {
                this.board[y + i][x] = ship;
            }
        }
        this.ships.push(ship);
        return true;
    }

    receiveAttack(coordinates) {
        const [x, y] = coordinates; // [x, y]
        const target = this.board[x][y];
        if (target) {
            target.hit();
            this.logOfHits.push(coordinates);
            return true;
        }
        this.logOfMisses.push(coordinates);
        return false;
    }

    getHits() {
        return this.logOfHits;
    }

    getMisses() {
        return this.logOfMisses;
    }

    getBoard() {
        return this.board;
    }

    areAllShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }

    getSize() {
        return this.size;
    }
}

module.exports = Gameboard;


// const board = new Gameboard();
// const ship = new Ship("Battleship", 4);
// board.placeShip(ship, [0, 0], "horizontal");

// board.receiveAttack([0, 0]);
// board.receiveAttack([0, 1]);
// board.receiveAttack([0, 2]);


// console.log(board.getBoard());