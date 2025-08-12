import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";


export class Player {
    constructor(name, gameboard = new Gameboard()) {
        this.name = name;
        this.gameboard = gameboard;
    }

    placeShip(ship, coordinates, orientation) {
        return this.gameboard.placeShip(ship, coordinates, orientation);
    }

    attack(opponentBoard, coordinates) {
        return opponentBoard.receiveAttack(coordinates);
    }

    getName() {
        return this.name;
    }

    getGameboard() {
        return this.gameboard;
    }
}

export class HumanPlayer extends Player {
    constructor(name, gameboard) {
        super(name, gameboard);
    }

    getAttackCoordinates(coordinates) {
        const [x, y] = coordinates;
        return [x, y];
    }
}

export class ComputerPlayer extends Player {
    constructor(gameboard) {
        super("Computer", gameboard);
        this.availableMoves = this.generateAllMoves();
    }

    generateAllMoves() {
        const moves = [];
        const size = this.gameboard.getSize(); // Use getter method for size
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                moves.push([x, y]);
            }
        }
        return moves;
    }

    getAttackCoordinates() {
        // Pick random move from available
        if (this.availableMoves.length === 0) {
            return null; // No moves left
        }
        const idx = Math.floor(Math.random() * this.availableMoves.length);
        return this.availableMoves.splice(idx, 1)[0];
    }
    

    attack(opponentBoard, coordinates) {
        if (coordinates) {
            return opponentBoard.receiveAttack(coordinates);
        }
    }

    placeShipsRandomly(ships) {
        const orientations = ["horizontal", "vertical"];
        
        for (const ship of ships) {
            let placed = false;
            
            // Keep trying until the ship is successfully placed
            while (!placed) {
                try {
                    // Generate random position and orientation
                    const x = Math.floor(Math.random() * this.gameboard.getSize());
                    const y = Math.floor(Math.random() * this.gameboard.getSize());
                    const orientation = orientations[Math.floor(Math.random() * orientations.length)];
                    
                    // Try to place the ship
                    this.placeShip(ship, [x, y], orientation);
                    placed = true;
                } catch (error) {
                    // If placement fails, try again with new random values
                    continue;
                }
            }
        }
        
        return true;
    }
}

// module.exports = { Player, HumanPlayer, ComputerPlayer };