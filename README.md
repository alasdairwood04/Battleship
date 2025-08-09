# Battleship Game

## Project Overview

This is a JavaScript implementation of the classic Battleship game, designed to be played in a web browser. The project follows object-oriented programming principles with clean separation of game logic from the user interface.

### Current State

The project is currently in development with the core game logic implemented. The codebase includes:

- Ship class for creating and managing ships
- Gameboard class for handling the game board logic
- Player classes (Human and Computer) for player interactions
- Test suites for all components

Implemented Features

- Ship creation with hit tracking and sinking status
- Gameboard with ship placement and attack tracking
- Support for both horizontal and vertical ship placement
- Attack system with hit/miss recording
- Computer player with random move selection
- Random ship placement for computer players

In Progress

- let user and computer to select starting positions logic
- User interface components
- Game controller to manage turns and game state
- Win/loss conditions display
- Ship placement interface for human players

### Project Structure

```
Battleship/
├── src/
│   ├── logic/
│   │   ├── Ship.js         # Ship class definition
│   │   ├── Gameboard.js    # Gameboard class definition
│   │   ├── Player.js       # Player, HumanPlayer, and ComputerPlayer classes
│   │   └── __tests__/      # Test files for game logic
│   │       ├── Ship.test.js
│   │       ├── Gameboard.test.js
│   │       └── Player.test.js
│   ├── index.js            # Main entry point
│   └── ui/                 # UI components (to be implemented)
├── dist/                   # Production build files
├── webpack.dev.js          # Webpack development configuration
├── webpack.prod.js         # Webpack production configuration
└── package.json            # Project dependencies and scripts
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
- Methods: generateAllMoves(), chooseMove(), placeShipsRandomly()

### How to Run

Development

```npm run dev```

Production Build

```npm run build```

Run Tests

```npm test```

Next Steps

1. Complete the user interface components
2. Implement game controller to manage turns
3. Add drag-and-drop ship placement for human players
4. Add game reset functionality
5. Improve computer AI with targeting logic after hits

### Technologies Used

- JavaScript (ES6+)
- Jest for testing
- Webpack for bundling
- HTML/CSS (to be implemented for UI)
