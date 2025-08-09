const Gameboard = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Gameboard.js");
const Ship = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Ship.js");
const {Player, HumanPlayer, ComputerPlayer} = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/Player.js");
const GameController = require("C:/Users/alasd/OneDrive/Desktop/Full-Stack/Odin Project/JavaScript-Course/Battleship/src/logic/GameController.js");


describe("GameController", () => {
    test("should create a new game", () => {
        const player1 = new Player("Player1");
        const player2 = new ComputerPlayer();

        const gameController = new GameController(player1, player2);
        expect(gameController).toBeInstanceOf(GameController);
        expect(gameController.getPlayer1()).toBe(player1);
        expect(gameController.getPlayer2()).toBe(player2);
        expect(gameController.getCurrentPlayer()).toBe(player1);
        expect(gameController.getIsOver()).toBe(false);
    });

    test("switch player", () => {
        const player1 = new Player("Player1");
        const player2 = new ComputerPlayer();

        const gameController = new GameController(player1, player2);
        gameController.switchPlayer();
        expect(gameController.getCurrentPlayer()).toBe(player2);
        gameController.switchPlayer();
        expect(gameController.getCurrentPlayer()).toBe(player1);
    });


    test("setupGame should place ships on both player boards", () => {
        // Create players
        const humanPlayer = new HumanPlayer("Human");
        const computerPlayer = new ComputerPlayer();
        
        // Create game controller
        const controller = new GameController(humanPlayer, computerPlayer);
        
        // Mock the placement coordinates for human ships
        const humanShipPlacements = [
            { ship: new Ship("destroyer", 2), coordinates: [0, 0], orientation: "horizontal" },
            { ship: new Ship("submarine", 3), coordinates: [0, 2], orientation: "horizontal" },
            { ship: new Ship("cruiser", 3), coordinates: [0, 4], orientation: "horizontal" },
            { ship: new Ship("battleship", 4), coordinates: [0, 6], orientation: "horizontal" },
            { ship: new Ship("carrier", 5), coordinates: [5, 0], orientation: "vertical" }
        ];

        // Test setupGame
        controller.setupGame(humanPlayer, computerPlayer, humanShipPlacements);
        
        // Check that human ships were placed
        const humanBoard = humanPlayer.getGameboard().getBoard();
        expect(humanBoard[0][0]).not.toBeNull(); // destroyer
        expect(humanBoard[0][1]).not.toBeNull();
        
        expect(humanBoard[2][0]).not.toBeNull(); // submarine
        expect(humanBoard[2][1]).not.toBeNull();
        expect(humanBoard[2][2]).not.toBeNull();
        
        // Check that computer ships were placed (total count)
        const computerBoard = computerPlayer.getGameboard().getBoard();
        let shipCells = 0;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                if (computerBoard[y][x] !== null) {
                    shipCells++;
                }
            }
        }
        
        // Total cells should match sum of all ship lengths (2+3+3+4+5 = 17)
        expect(shipCells).toBe(17);
        
        // Check that game phase was updated
        expect(controller.gamePhase).toBe("play");
    });

    test("playTurn should handle human moves", () => {
        // Setup players
        const humanPlayer = new HumanPlayer("Human");
        const computerPlayer = new ComputerPlayer();
        
        // Create ships
        const humanShip = new Ship("destroyer", 2);
        const computerShip = new Ship("destroyer", 2);
        
        // Place ships
        humanPlayer.placeShip(humanShip, [0, 0], "horizontal");
        computerPlayer.placeShip(computerShip, [0, 0], "horizontal");
        
        // Create controller and set to play phase
        const controller = new GameController(humanPlayer, computerPlayer);
        controller.gamePhase = "play";
        controller.currentPlayer = humanPlayer;
        controller.opponent = computerPlayer;
        
        // Test human player turn (with hit)
        const humanMoveResult = controller.playTurn([0, 0]);
        expect(humanMoveResult.success).toBe(true);
        expect(humanMoveResult.hit).toBe(true);
        expect(humanMoveResult.coordinates).toEqual([0, 0]);
        expect(humanMoveResult.message).toBe('Hit!');

        // check current player has switched
        expect(controller.currentPlayer).toBe(computerPlayer);
    });
    
    test("playTurn should handle computer moves", () => {
        // Setup players
        const humanPlayer = new HumanPlayer("Human");
        const computerPlayer = new ComputerPlayer();
        
        // Create ships
        const humanShip = new Ship("destroyer", 2);
        const computerShip = new Ship("destroyer", 2);
        
        // Place ships
        humanPlayer.placeShip(humanShip, [0, 0], "horizontal");
        computerPlayer.placeShip(computerShip, [0, 0], "horizontal");
        
        // Create controller and set to play phase
        const controller = new GameController(humanPlayer, computerPlayer);
        controller.gamePhase = "play";
        controller.currentPlayer = computerPlayer; // Set computer as current player
        controller.opponent = humanPlayer;

        // Mock the computer's getAttackCoordinates method to return predictable coordinates
        const originalGetAttackCoordinates = computerPlayer.getAttackCoordinates;
        computerPlayer.getAttackCoordinates = jest.fn().mockReturnValue([0, 0]);

        // Test computer player turn
        const computerMoveResult = controller.playTurn();

        // Verify getAttackCoordinates was called
        expect(computerPlayer.getAttackCoordinates).toHaveBeenCalled();
        
        // Verify attack result properties
        expect(computerMoveResult.success).toBe(true);
        expect(computerMoveResult.hit).toBe(true);
        expect(computerMoveResult.coordinates).toEqual([0, 0]);
        expect(computerMoveResult.message).toBe('Hit!');
        
        // Check current player has switched to human
        expect(controller.currentPlayer).toBe(humanPlayer);
        
        // Restore original method
        computerPlayer.getAttackCoordinates = originalGetAttackCoordinates;
    });

    test("playTurn should handle computer winning the game", () => {
        // Setup players
        const humanPlayer = new HumanPlayer("Human");
        const computerPlayer = new ComputerPlayer();
        
        // Create ship (1-length to easily sink)
        const humanShip = new Ship("destroyer", 1);
        
        // Place ship
        humanPlayer.placeShip(humanShip, [0, 0], "horizontal");
        
        // Create controller and set to play phase
        const controller = new GameController(humanPlayer, computerPlayer);
        controller.gamePhase = "play";
        controller.currentPlayer = computerPlayer;
        controller.opponent = humanPlayer;
        // Mock the computer's getAttackCoordinates to target the ship
        computerPlayer.getAttackCoordinates = jest.fn().mockReturnValue([0, 0]);
        
        // Test computer sinking the ship
        const moveResult = controller.playTurn();
        
        // Game should be over with computer as winner
        expect(controller.isOver).toBe(true);
        expect(controller.gamePhase).toBe("gameOver");
        expect(controller.winner).toBe(computerPlayer);
        expect(moveResult.hit).toBe(true);
    });

    test("playTurn should handle computer missing shots", () => {
        // Setup players
        const humanPlayer = new HumanPlayer("Human");
        const computerPlayer = new ComputerPlayer();
        
        // Create ships
        const humanShip = new Ship("destroyer", 2);
        
        // Place ship away from where computer will target
        humanPlayer.placeShip(humanShip, [5, 5], "horizontal");
        
        // Create controller and set to play phase
        const controller = new GameController(humanPlayer, computerPlayer);
        controller.gamePhase = "play";
        controller.currentPlayer = computerPlayer;
        controller.opponent = humanPlayer;

        // Mock the computer's getAttackCoordinates to miss the ship
        computerPlayer.getAttackCoordinates = jest.fn().mockReturnValue([0, 0]);
        
        // Test computer missing
        const moveResult = controller.playTurn();
        
        // Verify miss
        expect(moveResult.hit).toBe(false);
        expect(moveResult.message).toBe('Miss!');
        expect(humanShip.getHits()).toBe(0); // Ship wasn't hit
        
        // Game should continue (not over)
        expect(controller.isOver).toBe(false);
        expect(controller.gamePhase).toBe("play");
        expect(controller.winner).toBeNull();
    });


    test("playTurn should handle game over conditions", () => {
        const humanPlayer = new HumanPlayer("Human");
        const computerPlayer = new ComputerPlayer();
        
        // Create ship
        const computerShip = new Ship("destroyer", 1); // 1-length ship to sink easily
        
        // Place ship
        computerPlayer.placeShip(computerShip, [0, 0], "horizontal");
        
        // Create controller and set to play phase
        const controller = new GameController(humanPlayer, computerPlayer);
        controller.gamePhase = "play";
        controller.currentPlayer = humanPlayer;
        controller.opponent = computerPlayer;
        
        // Sink the ship to trigger game over
        const moveResult = controller.playTurn([0, 0]);
        
        // Game should be over
        expect(controller.isOver).toBe(true);
        expect(controller.gamePhase).toBe("gameOver");
        expect(controller.winner).toBe(humanPlayer);
    });

    test("playTurn should reject moves when not in play phase", () => {
        const humanPlayer = new HumanPlayer("Human");
        const computerPlayer = new ComputerPlayer();
        
        const controller = new GameController(humanPlayer, computerPlayer);
        controller.gamePhase = "setup"; // Not in play phase
        
        expect(() => {
            controller.playTurn([0, 0]);
        }).toThrow("Game is not in play phase");
    });
    test("resetGame should reset the game state", () => {
        // Setup players
        const humanPlayer = new HumanPlayer("Human");
        const computerPlayer = new ComputerPlayer();
        
        // Create ships and place them
        const humanShip = new Ship("destroyer", 1);
        const computerShip = new Ship("destroyer", 1);
        
        humanPlayer.placeShip(humanShip, [0, 0], "horizontal");
        computerPlayer.placeShip(computerShip, [0, 0], "horizontal");
        
        // Create controller and start the game
        const controller = new GameController(humanPlayer, computerPlayer);
        controller.gamePhase = "play";
        controller.currentPlayer = humanPlayer;
        controller.opponent = computerPlayer;
        
        // Make a winning move
        controller.playTurn([0, 0]);
        
        // Verify game is in gameOver state
        expect(controller.isOver).toBe(true);
        expect(controller.gamePhase).toBe("gameOver");
        expect(controller.winner).toBe(humanPlayer);
        
        // Save board state to compare after reset
        const oldHumanBoard = humanPlayer.getGameboard().getBoard();
        const oldComputerBoard = computerPlayer.getGameboard().getBoard();
        
        // Reset the game
        controller.resetGame();
        
        // Check game state is reset
        expect(controller.isOver).toBe(false);
        expect(controller.gamePhase).toBe("setup");
        expect(controller.winner).toBeNull();
        expect(controller.currentPlayer).toBe(humanPlayer); // Default first player
        
        // Check gameboards were cleared
        const newHumanBoard = humanPlayer.getGameboard().getBoard();
        const newComputerBoard = computerPlayer.getGameboard().getBoard();
        
        // Boards should be different objects (newly created)
        expect(newHumanBoard).not.toBe(oldHumanBoard);
        
        // Check boards are empty (all null values)
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                expect(newHumanBoard[y][x]).toBeNull();
                expect(newComputerBoard[y][x]).toBeNull();
            }
        }
        
        // Check ship arrays are empty
        expect(humanPlayer.getGameboard().ships.length).toBe(0);
        expect(computerPlayer.getGameboard().ships.length).toBe(0);
        
        // Check hit/miss logs are empty
        expect(humanPlayer.getGameboard().getHits().length).toBe(0);
        expect(humanPlayer.getGameboard().getMisses().length).toBe(0);
        expect(computerPlayer.getGameboard().getHits().length).toBe(0);
        expect(computerPlayer.getGameboard().getMisses().length).toBe(0);
    });
});