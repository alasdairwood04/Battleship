import Gameboard from "./Gameboard.js";
import {HumanPlayer, ComputerPlayer} from "./Player.js";
import Ship from "./Ship.js";


export default class GameController {
        constructor(player1, player2) {
        this.player1 = player1;  // Use the passed-in player objects directly
        this.player2 = player2;
        this.currentPlayer = this.player1;  // Reference the stored players
        this.opponent = this.player2;
        this.isOver = false;
        this.winner = null;
        this.gamePhase = "setup"; // "setup", "play", or "gameOver"
    }

    switchPlayer() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
            this.opponent = this.player1;
        } else {
            this.currentPlayer = this.player1;
            this.opponent = this.player2;
        }
        return this.currentPlayer;
    }

    setupGameComputer(computerPlayer) {
    // Place ships for the computer player randomly
    const ships = [
        new Ship("destroyer", 2),
        new Ship("submarine", 3),
        new Ship("cruiser", 3),
        new Ship("battleship", 4),
        new Ship("carrier", 5)
    ];
    
    computerPlayer.placeShipsRandomly(ships);
    this.gamePhase = "play";
    
    return true;
}

    playTurn(coordinates = null) {
        let sunkenComputerShips = new Set();
        let sunkenPlayerShips = new Set();

        if (this.gamePhase !== "play") {
            throw new Error("Game is not in play phase");
        }

        // Implement the logic for a player's turn
        if (this.isOver) {
            return {
                success: true,
                sunkenComputerShips: sunkenComputerShips,
                sunkenPlayerShips: sunkenPlayerShips,
                message: "Game over"
            }
        }

        let attackCoordinates = coordinates;
        let attackResult;

        // handle computer player's turn
        if (this.currentPlayer instanceof ComputerPlayer) {
            attackCoordinates = this.currentPlayer.getAttackCoordinates();
            console.log(`Computer attacking at coordinates: ${attackCoordinates}`);
            console.log(`Computer attacking at board: ${this.opponent.getName()}`);
            attackResult = this.currentPlayer.attack(this.opponent.getGameboard(), attackCoordinates);


            // check if a ship has sunk
            for (const ship of this.opponent.getGameboard().getShips()) {
                if (ship.isSunk()) {
                    sunkenComputerShips.add(ship);
                }
            }

            if (this.opponent.getGameboard().areAllShipsSunk()) {
                this.isOver = true;
                this.winner = this.currentPlayer;
                this.gamePhase = "gameOver";
            }
        
            // Switch to the next player
            if (!this.isOver) {
                this.switchPlayer();
            }
            return {
                success: true,
                hit: attackResult,
                coordinates: attackCoordinates,
                sunkenComputerShips: sunkenComputerShips,
                sunkenPlayerShips: sunkenPlayerShips,
                message: attackResult ? 'Hit!' : 'Miss!'
            };
        }

        // Human player's turn
        if (coordinates) {

            if (this.opponent.getGameboard().isAlreadyAttacked(coordinates)) {
                return {
                    success: false,
                    alreadyAttacked: true,
                    sunkenPlayerShips: sunkenPlayerShips,
                    sunkenComputerShips: sunkenComputerShips,
                    message: 'You already attacked this position. Choose another one.'
                };
            }

            attackResult = this.currentPlayer.attack(this.opponent.getGameboard(), coordinates);


            // check if a ship has sunk
            for (const ship of this.opponent.getGameboard().getShips()) {
                if (ship.isSunk()) {
                    sunkenComputerShips.add(ship);
                }
            }


            // Check if the opponent's ships are sunk
            if (this.opponent.getGameboard().areAllShipsSunk()) {
                this.isOver = true;
                this.winner = this.currentPlayer;
                this.gamePhase = "gameOver";
            }

            // Switch to the next player
            if (!this.isOver) {
                this.switchPlayer();
            }

            return {
                success: true,
                hit: attackResult,
                coordinates: coordinates,
                sunkenComputerShips: sunkenComputerShips,
                sunkenPlayerShips: sunkenPlayerShips,
                message: attackResult ? 'Hit!' : 'Miss!'
            };
        }
        // If no coordinates are provided, it's an invalid turn
        return {
            success: false,
            sunkenComputerShips: sunkenComputerShips,
            sunkenPlayerShips: sunkenPlayerShips,
            message: 'Invalid turn'
        };
    }

    resetGame() {
        this.player1.gameboard = new Gameboard();
        this.player2.gameboard = new Gameboard();
        
        this.isOver = false;
        this.winner = null;
        this.gamePhase = "setup";
        this.currentPlayer = this.player1; // Reset to player1
        return true;
    }

    getPlayer1() {
        return this.player1;
    }

    getPlayer2() {
        return this.player2;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getIsOver() {
        return this.isOver;
    }
}

// module.exports = GameController;

// // Setup players
// const humanPlayer = new HumanPlayer("Human");
// const computerPlayer = new ComputerPlayer();

// // Create ships
// const humanShip = new Ship("destroyer", 2);
// const computerShip = new Ship("destroyer", 2);

// // Place ships
// humanPlayer.placeShip(humanShip, [0, 0], "horizontal");
// computerPlayer.placeShip(computerShip, [0, 0], "horizontal");


// console.log(humanPlayer.getGameboard().getBoard());

// // Create controller and set to play phase
// const controller = new GameController(humanPlayer, computerPlayer);
// controller.gamePhase = "play";
// controller.currentPlayer = computerPlayer;
// controller.opponent = humanPlayer;

// const computerMoveResult = controller.playTurn([0, 0]);
// console.log(computerMoveResult);