import './styles.css';
import GameController from './logic/GameController.js';
import { HumanPlayer, ComputerPlayer } from './logic/Player.js';
import Ship from './logic/Ship.js';
import { renderBoard, updateBoards, updateGameStatus, handleCellClick, updateShipInfoDisplay, updateSunkShips, updateNotification } from './ui/ui.js';

console.log("Battleship game initialized");

document.addEventListener("DOMContentLoaded", () => {
    // initialise Players and GameController
    const humanPlayer = new HumanPlayer("Human");
    const computerPlayer = new ComputerPlayer();
    const gameController = new GameController(humanPlayer, computerPlayer);

    // get DOM elements
    const computerBoardElement = document.getElementById("computer-board");
    const startButton = document.getElementById("start-button");
    const rotateButton = document.getElementById("rotate-button");
    const resetButton = document.getElementById("reset-button");
    const setUpContainer = document.getElementById("setup-container");
    const gameContainer = document.querySelector("#game-container");
    const gameBoardHuman = document.getElementById("game-board-container-human");
    const gameBoardComputer = document.getElementById("game-board-container-computer");
    const shipPlacementHumanBoard = document.querySelector(".ship-placement-and-human-board");
    const playerSunkShipsList = document.getElementById("player-sunk-ships");
    const computerSunkShipsList = document.getElementById("computer-sunk-ships");
    const gameInfo = document.getElementById("game-info");
    const notification = document.getElementById("notification");

    // create player board element
    const playerBoardElement = document.createElement("div");
    playerBoardElement.id = "player-board";
    playerBoardElement.classList.add("game-board");

    // start with hiding game-container
    // gameContainer.style.display = "none";

            
    // adding player board to setup-container
    shipPlacementHumanBoard.appendChild(playerBoardElement);

    renderBoard(playerBoardElement, humanPlayer.getGameboard().getBoard());
    
    // updateBoards(humanPlayer.getGameboard().getBoard(), 
    //         computerPlayer.getGameboard().getBoard()
    //         );



// ================================= Ship Placement Logic ========================================

    // ship placement logic for human player
    const ships = [
        new Ship("destroyer", 2),
        new Ship("submarine", 3),
        new Ship("cruiser", 3),
        new Ship("battleship", 4),
        new Ship("carrier", 5)
    ];

    const shipSelectionList = document.querySelector(".ship-selection-list");

    let currentShipIndex = null;
    let currentOrientation = "horizontal";
    const placedShips = new Set();

    function updateShipSelectionList() {
        shipSelectionList.innerHTML = '<h3>Place your ships:</h3>';
        ships.forEach((ship, index) => {
            const shipItem = document.createElement("div");

            if (placedShips.has(index)) {
                shipItem.classList.add("placed");
            } else if (currentShipIndex === index) {
                shipItem.classList.add("selected");
            } else {
                shipItem.classList.add("ship-item");
            }

            shipItem.textContent = `${ship.getName()} (${ship.getLength()} cells)`;
            shipItem.dataset.index = index;

            if (!placedShips.has(index)) {
                shipItem.addEventListener("click", () => {
                    if (currentShipIndex !== index) {
                        currentShipIndex = index;
                        // updateShipInfoDisplay(ship);
                        updateShipSelectionList();
                    }
                });
            }

            shipSelectionList.appendChild(shipItem);
        });

         // Add instruction text
        const instructionElement = document.createElement("p");
        instructionElement.className = "ship-instructions";
        
        if (currentShipIndex !== null) {
            const selectedShip = ships[currentShipIndex];
            instructionElement.textContent = `${currentOrientation} orientation. Use the rotate button to change orientation.`;
        } else if (placedShips.size === ships.length) {
            instructionElement.textContent = "All ships placed. Click 'Start Game' to begin!";
        } else {
            instructionElement.textContent = "Select a ship from the list above to place it.";
        }
        
        shipSelectionList.appendChild(instructionElement);

    }

    updateShipSelectionList();

    rotateButton.addEventListener("click", () => {
        currentOrientation = currentOrientation === "horizontal" ? "vertical" : "horizontal";
    });

    playerBoardElement.addEventListener("click", (event) => {
        if (gameController.gamePhase === "setup" && currentShipIndex !== null && !placedShips.has(currentShipIndex)) {
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

                placedShips.add(currentShipIndex);

                currentShipIndex = null;
                updateGameStatus(`${currentShip.getName()} placed successfully. Select another ship.`);


                // If all ships are placed, start the game
                if (placedShips.size === ships.length) {
                    startButton.disabled = false;
                    updateGameStatus("All ships placed. Click 'Start Game' to begin!");
                }

                updateShipSelectionList();
            } catch(error) {
                updateGameStatus(error.message);
            }
        } else if (gameController.gamePhase === "setup" && currentShipIndex === null) {
            updateGameStatus("Please select a ship from the list first.");
        }
    });

    // ================================= Ship Placement Logic ========================================


    // ship placement for computer player and start game
    startButton.addEventListener("click", () => {
        if (gameController.gamePhase === "setup" && placedShips.size === ships.length) {
            gameController.setupGameComputer(computerPlayer);
            
            // Switch from setup to game view
            setUpContainer.classList.add("hidden");
            gameContainer.classList.remove("hidden");


            // Move player board from setup to game container if needed
            gameBoardHuman.appendChild(playerBoardElement);

            updateBoards(
                humanPlayer.getGameboard().getBoard(),
                computerPlayer.getGameboard().getBoard()
            );
            gameController.gamePhase = "play";
            updateGameStatus("Game started! Your turn.");
        }
    });




    let computerSunkShipLength = 0;
    let playerSunkShipLength = 0;

    let previouslySunkenComputerShips = new Set();
    let previouslySunkenPlayerShips = new Set();

    // ================================= Game Logic ========================================
    computerBoardElement.addEventListener("click", (event) => {
        console.log("computer sunk ship length: ", computerSunkShipLength);
        console.log("player sunk ship length:", playerSunkShipLength);

        if (gameController.gamePhase === "play" && gameController.currentPlayer === humanPlayer) {
            const cell = event.target;
            if (!cell.dataset.x || !cell.dataset.y) {
                return; // Skip if click wasn't on a cell
            }
            
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            const coordinates = [x, y];
            
            // Make the move directly instead of using handleCellClick
            const result = gameController.playTurn(coordinates);

            console.log("sunken computer ships array:", result.sunkenComputerShips);
            console.log("sunken player ships array:", result.sunkenPlayerShips);

            if (result.sunkenComputerShips && result.sunkenComputerShips.size > 0) {
            // Check for NEW sunken ships
            let newlySunkShips = false;
            result.sunkenComputerShips.forEach(ship => {
                if (!previouslySunkenComputerShips.has(ship.getName())) {
                    previouslySunkenComputerShips.add(ship.getName());
                    newlySunkShips = true;
                }
            });
            
            updateSunkShips(result.sunkenComputerShips, computerSunkShipsList);
                
                if (newlySunkShips) {
                    updateNotification(`You sunk a ship!`);
                    gameInfo.classList.remove("hidden");
                }
            }

            // Check if it was a valid move
            if (!result.success && result.alreadyAttacked) {
                updateGameStatus(result.message);
                return;
            }
            
            // Update the UI based on the result
            if (result.hit) {
                cell.classList.add('hit');
                updateGameStatus("You hit a ship!");
            } else {
                cell.classList.add('miss');
                updateGameStatus("You missed!");
            }

            if (gameController.getIsOver()) {
                updateGameStatus(`Game Over! ${gameController.winner.getName()} wins!`);
                resetButton.style.display = 'block';
                return;
            }

            // Computer player's turn
            if (gameController.gamePhase === "play" && gameController.currentPlayer === computerPlayer) {
                updateGameStatus("Computer is thinking...");
                
                setTimeout(() => {
                    const computerResult = gameController.playTurn();
                    const [cx, cy] = computerResult.coordinates;
                    const computerCell = playerBoardElement.querySelector(`[data-x="${cx}"][data-y="${cy}"]`);

                    if (computerResult.sunkenPlayerShips && computerResult.sunkenPlayerShips.size > 0) {
                        // Check for NEW sunken ships
                        let newlySunkShips = false;
                        computerResult.sunkenPlayerShips.forEach(ship => {
                            if (!previouslySunkenPlayerShips.has(ship.getName())) {
                                previouslySunkenPlayerShips.add(ship.getName());
                                newlySunkShips = true;
                            }
                        });
                        
                        updateSunkShips(computerResult.sunkenPlayerShips, playerSunkShipsList);
                    
                        // Only show notification for newly sunk ships
                        if (newlySunkShips) {
                            updateNotification(`Computer sunk your ship!`);
                            gameInfo.classList.remove("hidden");
                        }
                    }    
                    // Update UI based on computer's move
                    if (computerResult.hit) {
                        computerCell.classList.add('hit');
                        updateGameStatus("Computer hit your ship!");
                    } else {
                        computerCell.classList.add('miss');
                        updateGameStatus("Computer missed! Your turn.");
                    }

                    if (gameController.getIsOver()) {
                        updateGameStatus(`Game Over! ${gameController.winner.getName()} wins!`);
                        updateNotification(`Game Over! ${gameController.winner.getName()} wins!`);
                        resetButton.style.display = 'block';
                    }
                }, 500);
            }
            
        }
    });
    // ================================= Game Logic ========================================


    // ================================= Reset Game Logic ========================================
    resetButton.addEventListener("click", () => {
        gameController.resetGame();
        
        // Reset ship placement state
        currentShipIndex = null;
        currentOrientation = "horizontal";
        placedShips.clear();
        
        // Reset player ships
        for (let i = 0; i < ships.length; i++) {
            ships[i] = new Ship(ships[i].getName(), ships[i].getLength());
        }
        
        // Switch back to setup view
        gameContainer.classList.add("hidden"); // Hide game container
        // gameInfo.classList.add("hidden"); // Hide game info
        setUpContainer.classList.remove("hidden"); // Show setup container
        
        // Move player board back to setup container
        shipPlacementHumanBoard.appendChild(playerBoardElement);
        
        // Reset UI elements
        startButton.disabled = true;
        
        // Re-render player board
        renderBoard(playerBoardElement, humanPlayer.getGameboard().getBoard());
        
        updateShipSelectionList();
        updateGameStatus("Game reset. Select a ship to place.");
    });

    // ================================= Reset Game Logic ========================================

});