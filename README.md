# Battleship Game

## Project Overview

This is a JavaScript implementation of the classic Battleship game, designed to be played in a web browser. The project follows object-oriented programming principles with clean separation of game logic from the user interface.

### Current State

The project is currently in development with the core game logic implemented. The codebase includes:

- Ship class for creating and managing ships
- Gameboard class for handling the game board logic
- Player classes (Human and Computer) for player interactions
- GameController to manage the game state and turns
- Comprehensive test suites for all components

Implemented Features

- Ship creation with hit tracking and sinking status
- Gameboard with ship placement and attack tracking
-Support for both horizontal and vertical ship placement
- Attack system with hit/miss recording
- Player turn management
- Computer player with random move selection
-Random ship placement for computer players
- Win/loss detection
- Game phase management (setup, play, game over)
- Game reset functionality

In Progress

- User interface components
- Ship placement interface for human players
- Visual representation of game boards
- Hit/miss display
- Game status indicators

### Project Structure

```
Battleship/
├── src/
│   ├── logic/
│   │   ├── Ship.js         # Ship class definition
│   │   ├── Gameboard.js    # Gameboard class definition
│   │   ├── Player.js       # Player, HumanPlayer, and ComputerPlayer classes
│   │   ├── GameController.js # Game state and turn management
│   │   └── __tests__/      # Test files for game logic
│   │       ├── Ship.test.js
│   │       ├── Gameboard.test.js
│   │       ├── Player.test.js
│   │       └── GameController.test.js
│   ├── index.js            # Main entry point
│   └── ui/                 # UI components (in development)
├── dist/                   # Production build files
├── webpack.dev.js          # Webpack development configuration
├── webpack.prod.js         # Webpack production configuration
└── package.json            # Project dependencies and scripts```
```

### Key Classes

Ship

- Properties: name, length, hits, sunk status
- Methods: hit(), isSunk(), getName(), getLength(), getHits()

Gameboard

- Properties: ships array, board grid, hit/miss logs
- Methods: placeShip(), receiveAttack(), areAllShipsSunk()

Player

- Base class for all player types
- Methods: attack(), getName(), getGameboard()

HumanPlayer

- Extends Player
- Methods: chooseMove(x, y) for human input

ComputerPlayer

- Extends Player
- Methods: generateAllMoves(), getAttackCoordinates(), attack(), placeShipsRandomly

GameController

- Manages game state and player turns
- Methods: setupGame(), playTurn(), switchPlayer(), resetGame()
- Tracks game phases (setup, play, gameOver)

### How to Run

Development

```npm run dev```

Production Build

```npm run build```

Run Tests

```npm test```

Next Steps

1. Implement the user interface components
2. Create visual representation of game boards
3. Add drag-and-drop ship placement for human players
4. Develop visual indicators for hits, misses, and sunk ships
5. Add sound effects and animations
6. Improve computer AI with targeting logic after hits

### Technologies Used

- JavaScript (ES6+)
- Jest for testing
- Webpack for bundling
- HTML/CSS (to be implemented for UI)
