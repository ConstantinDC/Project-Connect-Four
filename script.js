const board = document.querySelector('.board');
const boardRows = Array.from(document.querySelectorAll('.board-row'));
const cells = Array.from(document.querySelectorAll('.cell'));
const turnIndicator = document.querySelector('.turn-indicator');
const gameOverMessage = document.querySelector('.game-over-message');
const title = document.querySelector('h1');

let currentPlayer = 1;
let gameOver = false;

let gameBoard = [];
for (let row = 0; row < 6; row++) {
    gameBoard[row] = [];
    for (let col = 0; col < 7; col++) {
        gameBoard[row][col] = cells[row * 7 + col];
    }
}

function getCellColor(cell) {
    const color = window.getComputedStyle(cell).backgroundColor;
    return color === 'rgb(255, 255, 255)' || color === 'white' ? null : color;
}

function countDirection(row, col, dr, dc, color) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < 6 && c >= 0 && c < 7) {
        const cell = gameBoard[r][c];
        if (getCellColor(cell) === color) {
            count++;
            r += dr;
            c += dc;
        } else {
            break;
        }
    }
    return count;
}

function checkWin(row, col) {
    const cell = gameBoard[row][col];
    const color = getCellColor(cell);
    const directions = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 }
    ];

    return directions.some(({ dr, dc }) => {
        const count = 1 + countDirection(row, col, dr, dc, color) + countDirection(row, col, -dr, -dc, color);
        return count >= 4;
    });
}

function resetGame() {
    currentPlayer = 1;
    gameOver = false;
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
    });
    turnIndicator.textContent = `Current turn: Player ${currentPlayer}`;
    gameOverMessage.textContent = '';
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (gameOver) {
            gameOverMessage.textContent = `Click to play again. Player 1 starts!`;
            setTimeout(() => {
                resetGame();
            }, 1000);
            return;
        }

        const col = index % 7;
        for (let row = 5; row >= 0; row--) {
            const targetCell = gameBoard[row][col];
            if (!getCellColor(targetCell)) {
                const placedColor = currentPlayer === 1 ? 'red' : 'yellow';
                const placedPlayer = currentPlayer;
                targetCell.style.backgroundColor = placedColor;

                if (checkWin(row, col)) {
                    turnIndicator.textContent = ``;
                    gameOverMessage.textContent = `Player ${placedPlayer} wins! Click to play again.`;
                    gameOver = true;
                } else {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    turnIndicator.textContent = `Current turn: Player ${currentPlayer}`;
                }
                break;
            }
        }
    });
});
