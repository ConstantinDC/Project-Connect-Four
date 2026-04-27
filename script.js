const board = document.querySelector('.board');
const turnIndicator = document.querySelector('.turn-indicator');
const gameOverMessage = document.querySelector('.game-over-message');
const title = document.querySelector('h1');

const ROWS = 6;
const COLS = 7;

let currentPlayer = 1;
let gameOver = false;

let gameBoard = [];

function createBoard() {
    for (let row = 0; row < ROWS; row++) {
        gameBoard[row] = [];
    }

    for (let row = 0; row < ROWS; row++) {
        const boardRow = document.createElement('div');
        boardRow.className = 'board-row';
        
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            boardRow.appendChild(cell);            
            gameBoard[row][col] = cell;
        }
        
        board.appendChild(boardRow);
    }
}

createBoard();

const cells = Array.from(document.querySelectorAll('.cell'));

function getCellColor(cell) {
    const color = window.getComputedStyle(cell).backgroundColor;
    return color === 'rgb(255, 255, 255)' || color === 'white' ? null : color;
}

function countDirection(row, col, dr, dc, color) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
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

        const col = index % COLS;
        for (let row = ROWS - 1; row >= 0; row--) {
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
