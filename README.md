# Battleship Game

## Project Overview

This is a JavaScript implementation of the classic Battleship game, designed to be played in a web browser. The project follows object-oriented programming principles with clean separation of game logic from the user interface.

## Features

### Completed Features

- Ship creation with hit tracking and sinking status
- Gameboard with ship placement and attack tracking
- Support for both horizontal and vertical ship placement
- Attack system with hit/miss recording
- Player turn management
- Computer player with random move selection
- Random ship placement for computer players
- Win/loss detection
- Game phase management (setup, play, game over)
- Game reset functionality
- User interface with visual game boards
- Ship placement interface for human players
- Visual indicators for hits and misses
- Game status updates
- Rotate button for ship orientation during placement
- Start and reset game buttons
- Turn-based gameplay with computer AI

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
│   └── ui/                 # UI components
│        └── ui.js          # UI rendering and event handling
├── dist/                   # Production build files
├── webpack.dev.js          # Webpack development configuration
├── webpack.prod.js         # Webpack production configuration
└── package.json            # Project dependencies and scripts
```

### Key Classes

## Key Classes

### Ship
- Properties: name, length, hits, sunk status
- Methods: hit(), isSunk(), getName(), getLength(), getHits()

### Gameboard
- Properties: ships array, board grid, hit/miss logs
- Methods: placeShip(), receiveAttack(), areAllShipsSunk()

### Player
- Base class for all player types
- Methods: attack(), getName(), getGameboard()

### HumanPlayer
- Extends Player
- Methods: placeShip() for manual ship placement

### ComputerPlayer
- Extends Player
- Methods: generateAllMoves(), getAttackCoordinates(), attack(), placeShipsRandomly()

### GameController
- Manages game state and player turns
- Methods: setupGameComputer(), playTurn(), switchPlayer(), resetGame()
- Tracks game phases (setup, play, gameOver)

## Game Flow

1. **Setup Phase**
   - Player places ships on their board by clicking cells
   - Ships can be rotated between horizontal and vertical orientation
   - Computer ships are placed randomly

2. **Play Phase**
   - Player attacks computer's board by clicking on cells
   - Hits and misses are visually displayed
   - Computer automatically makes its move after the player
   - Turn alternates between player and computer

3. **Game Over**
   - Game ends when all ships of either player are sunk
   - Winner is announced
   - Game can be reset to play again

## UI Components

- Two game boards (player's and computer's)
- Ship placement interface with rotation button
- Game status display
- Start button to begin the game
- Reset button to start over

## How to Run

### Development

```npm run dev```

Production Build

```npm run build```

Run Tests

```npm test```

## Future Enhancements

1. Improve computer AI with targeting logic after hits
2. Add drag-and-drop ship placement for human players
3. Add sound effects and animations
4. Add difficulty levels for computer opponent
5. Implement multiplayer functionality
6. Add responsive design for mobile devices
7. hide computers ships

## Technologies Used

- JavaScript (ES6+)
- HTML5/CSS3
- Jest for testing
- Webpack for bundling
