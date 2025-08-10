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
        const [x, y] = coordinates; // x is column, y is row
        
        if (orientation === "horizontal") {
            // Check boundary along the x-axis (columns)
            if (x + ship.getLength() > this.size) {
                throw new Error("Ship placement out of bounds horizontally");
            }
            
            for (let i = 0; i < ship.getLength(); i++) {
                if (this.board[y][x + i] !== null) { // Access board[row][col]
                    throw new Error("Cannot place ship where another ship exists");
                }
            }
            
            for (let i = 0; i < ship.getLength(); i++) {
                this.board[y][x + i] = ship; // Access board[row][col]
            }
        } else if (orientation === "vertical") {
            // Check boundary along the y-axis (rows)
            if (y + ship.getLength() > this.size) {
                throw new Error("Ship placement out of bounds vertically");
            }
            
            for (let i = 0; i < ship.getLength(); i++) {
                if (this.board[y + i][x] !== null) { // Access board[row][col]
                    throw new Error("Cannot place ship where another ship exists");
                }
            }
            
            for (let i = 0; i < ship.getLength(); i++) {
                this.board[y + i][x] = ship; // Access board[row][col]
            }
        }
        this.ships.push(ship);
        return true;
    }

    receiveAttack(coordinates) {
        const [x, y] = coordinates; // x is column, y is row
        const target = this.board[y][x]; // Access board[row][col]
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

// module.exports = Gameboard;


// const board = new Gameboard();
// const ship = new Ship("Battleship", 4);
// board.placeShip(ship, [0, 0], "horizontal");

// board.receiveAttack([0, 0]);
// board.receiveAttack([0, 1]);
// board.receiveAttack([0, 2]);


// console.log(board.getBoard());