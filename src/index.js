import './styles.css';
import GameController from './logic/GameController.js';
import { HumanPlayer, ComputerPlayer } from './logic/Player.js';
import Ship from './logic/Ship.js';
import { renderBoard, updateBoards, updateGameStatus, handleCellClick } from './ui/ui.js';

console.log("Battleship game initialized");

document.addEventListener("DOMContentLoaded", () => {
    // initialise Players and GameController
    const humanPlayer = new HumanPlayer("Human");
    const computerPlayer = new ComputerPlayer();
    const gameController = new GameController(humanPlayer, computerPlayer);

    // get DOM elements
    const playerBoardElement = document.getElementById("player-board");
    const computerBoardElement = document.getElementById("computer-board");
    const startButton = document.getElementById("start-button");
    const rotateButton = document.getElementById("rotate-button");
    const resetButton = document.getElementById("reset-button");
    const shipPlacementContainer = document.getElementById("ship-placement-container");

    // initial board rendering
    updateBoards(humanPlayer.getGameboard().getBoard(), computerPlayer.getGameboard().getBoard());

    // ship placement logic for human player
    const ships = [
        new Ship("destroyer", 2),
        new Ship("submarine", 3),
        new Ship("cruiser", 3),
        new Ship("battleship", 4),
        new Ship("carrier", 5)
    ];

    let currentShipIndex = 0;
    let currentOrientation = "horizontal";

    rotateButton.addEventListener("click", () => {
        currentOrientation = currentOrientation === "horizontal" ? "vertical" : "horizontal";
    });

    playerBoardElement.addEventListener("click", (event) => {
        if (gameController.gamePhase === "setup" && currentShipIndex < ships.length) {
            const cell = event.target;
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            const currentShip = ships[currentShipIndex];

            try {
                humanPlayer.placeShip(currentShip, [x, y], currentOrientation);
                updateBoards(
                    humanPlayer.getGameboard().getBoard(),
                    computerPlayer.getGameboard().getBoard()
                );
                currentShipIndex++;
                // If all ships are placed, start the game
                if (currentShipIndex === ships.length) {
                    startButton.disabled = false;
                    gameController.startGame();
                }
            } catch(error) {
                updateGameStatus(error.message);
            }
        }
    });

    // ship placement for computer player and start game
    startButton.addEventListener("click", () => {
        if (gameController.gamePhase === "setup") {
            gameController.setupGameComputer(computerPlayer);
            updateBoards(
                humanPlayer.getGameboard().getBoard(),
                computerPlayer.getGameboard().getBoard()
            );
            gameController.gamePhase = "play";
            updateGameStatus("Game started! Your turn.");
        }
    });


    // play logic
    computerBoardElement.addEventListener("click", (event) => {
        if (gameController.gamePhase === "play" && gameController.currentPlayer === humanPlayer) {
            handleCellClick(event, gameController);
            

            if (gameController.gamePhase === "play" && gameController.currentPlayer === computerPlayer) {
                setTimeout(() => {
                    const result = gameController.playTurn();
                    const { x, y } = result.coordinates;
                    const cell = playerBoardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                    if (result.hit) {
                        cell.classList.add('hit');
                    } else {
                        cell.classList.add('miss');
                    }
                    if (gameController.getIsOver()) {
                        updateGameStatus(`Game Over! ${gameController.winner.getName()} wins!`);
                        resetButton.style.display = 'block';
                    }
                }, 1000); // Add a small delay for computer's move
            }
        }
    });


    // reset game logic
    resetButton.addEventListener("click", () => {
        gameController.resetGame();
        updateBoards(
            humanPlayer.getGameboard().getBoard(),
            computerPlayer.getGameboard().getBoard()
        );
        updateGameStatus("Game reset. Place your ships.");
        resetButton.style.display = 'none';
    });
});