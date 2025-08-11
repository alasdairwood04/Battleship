function renderBoard(boardElement, boardData) {
    boardElement.innerHTML = '';
    for (let i = 0; i < boardData.length; i++) {       // i is the row (y-axis)
        for (let j = 0; j < boardData[i].length; j++) { // j is the column (x-axis)
            const cell = document.createElement('div');
            
            cell.classList.add('cell');
            cell.dataset.x = j; // x is the column
            cell.dataset.y = i; // y is the row

            if (boardData[i][j]) {
                cell.classList.add('ship');
            }
            
            boardElement.appendChild(cell);
        }
    }
}

function updateBoards(playerBoardData, computerBoardData) {
    const playerBoardElement = document.getElementById("player-board");
    const computerBoardElement = document.getElementById("computer-board");
    renderBoard(playerBoardElement, playerBoardData);
    renderBoard(computerBoardElement, computerBoardData);
}

function updateBoard(playerBoardData) {
    const playerBoardElement = document.getElementById("player-board");
    renderBoard(playerBoardElement, playerBoardData);
}


function updateGameStatus(message) {
    const statusElement = document.getElementById("game-status");
    statusElement.textContent = message;
}

function handleCellClick(event, gameController) {
    const cell = event.target;
    if (cell.classList.contains('cell')) {
        const x = parseInt(cell.dataset.x, 10);
        const y = parseInt(cell.dataset.y, 10);
        const result = gameController.playTurn([x, y]);
        if (result.hit) {
            cell.classList.add('hit');
        } else {
            cell.classList.add('miss');
        }
        
        return result;
    }
    return null;
}

function updateShipInfoDisplay(ship) {
    const shipInfoElement = document.getElementById("ship-info");
    shipInfoElement.textContent = `Selected Ship: ${ship.getName()} (Length: ${ship.getLength()})`;
}






export {
    renderBoard,
    updateBoards,
    updateGameStatus,
    handleCellClick,
    updateShipInfoDisplay,
};
