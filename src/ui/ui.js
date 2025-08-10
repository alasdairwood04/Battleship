function renderBoard(boardElement, boardData) {
    boardElement.innerHTML = '';
    for (let i = 0; i < boardData.length; i++) {
        for (let j = 0; j < boardData[i].length; j++) {
            // 'cell' is DECLARED here
            const cell = document.createElement('div');
            
            // 'cell' is USED here
            cell.classList.add('cell');
            cell.dataset.x = i;
            cell.dataset.y = j;
            if (boardData[i][j]) {
                cell.classList.add('ship');
            }
            
            // 'cell' is USED again here
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
    }
    if (gameController.getIsOver()) {
        updateGameStatus(`Game Over! ${gameController.winner.getName()} wins!`);
        resetButton.style.display = 'block';

    }
}

export {
    renderBoard,
    updateBoards,
    updateGameStatus,
    handleCellClick
};
