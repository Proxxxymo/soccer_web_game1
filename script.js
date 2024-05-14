const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const screenWidth = 1000;  // Обновлено для большей сетки
const screenHeight = 500;
const rows = 3;
const cols = 7;
const cellWidth = screenWidth / cols;
const cellHeight = screenHeight / rows;

canvas.width = screenWidth;
canvas.height = screenHeight;

// Colors
const green = '#008000';
const white = '#FFFFFF';
const black = '#000000';
const red = '#FF0000';
const blue = '#0000FF';
const winningColor = '#00FF00';
const bgColor = '#d3d3d3'; // Light gray

// Load images
const playerImg = new Image();
playerImg.src = 'images/player.png';
const goalkeeperImg = new Image();
goalkeeperImg.src = 'images/goalkeeper.png';
const ballImg = new Image();
ballImg.src = 'images/ball.png';

let playerPos = { x: 0, y: Math.floor(rows / 2) };
let ballPos = { ...playerPos };
let goalkeeperPos = { x: cols - 1, y: Math.floor(Math.random() * rows) };
let mines = [];

// Populate mines with random positions, excluding the player's initial position and the last cell
for (let i = 0; i < 3; i++) {
    let minePos;
    do {
        minePos = { x: Math.floor(Math.random() * (cols - 2)) + 1, y: Math.floor(Math.random() * rows) };
    } while ((minePos.x === ballPos.x && minePos.y === ballPos.y) || (minePos.x === goalkeeperPos.x && minePos.y === goalkeeperPos.y) || mines.some(mine => mine.x === minePos.x && mine.y === minePos.y));
    mines.push(minePos);
}

// Draw grid
function drawGrid() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = green;
            ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            ctx.strokeStyle = white;
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }
}

// Draw goals
function drawGoals() {
    for (let row = 0; row < rows; row++) {
        ctx.strokeStyle = blue;
        ctx.strokeRect(0, row * cellHeight, cellWidth, cellHeight);
        ctx.strokeStyle = red;
        ctx.strokeRect((cols - 1) * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }
}

// Draw elements on the field
function drawElements() {
    drawGrid();
    drawGoals();
    ctx.drawImage(playerImg, playerPos.x * cellWidth, playerPos.y * cellHeight, cellWidth, cellHeight);
    ctx.drawImage(ballImg, ballPos.x * cellWidth + (cellWidth - ballImg.width * 0.5) / 2, ballPos.y * cellHeight + (cellHeight - ballImg.height * 0.5) / 2, ballImg.width * 0.5, ballImg.height * 0.5);
    ctx.drawImage(goalkeeperImg, goalkeeperPos.x * cellWidth, goalkeeperPos.y * cellHeight, cellWidth, cellHeight);
}

drawElements();

// Handle mouse click
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / cellWidth);
    const row = Math.floor(mouseY / cellHeight);

    if (col === ballPos.x + 1 && Math.abs(row - ballPos.y) <= 1) {
        ballPos = { x: col, y: row };

        if (mines.some(mine => mine.x === ballPos.x && mine.y === ballPos.y)) {
            goalkeeperAnimation(() => {
                alert('Вы проиграли!');
                resetGame();
            });
        } else if (col === cols - 1) {
            alert('Вы выиграли!');
            resetGame();
        } else {
            drawElements();
        }
    }
});

function goalkeeperAnimation(callback) {
    const interval = setInterval(() => {
        if (goalkeeperPos.x < ballPos.x) {
            goalkeeperPos.x++;
        } else if (goalkeeperPos.x > ballPos.x) {
            goalkeeperPos.x--;
        }
        if (goalkeeperPos.y < ballPos.y) {
            goalkeeperPos.y++;
        } else if (goalkeeperPos.y > ballPos.y) {
            goalkeeperPos.y--;
        }
        drawElements();
        if (goalkeeperPos.x === ballPos.x && goalkeeperPos.y === ballPos.y) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

function resetGame() {
    playerPos = { x: 0, y: Math.floor(rows / 2) };
    ballPos = { ...playerPos };
    goalkeeperPos = { x: cols - 1, y: Math.floor(Math.random() * rows) };
    mines = [];

    for (let i = 0; i < 3; i++) {
        let minePos;
        do {
            minePos = { x: Math.floor(Math.random() * (cols - 2)) + 1, y: Math.floor(Math.random() * rows) };
        } while ((minePos.x === ballPos.x && minePos.y === ballPos.y) || (minePos.x === goalkeeperPos.x && minePos.y === goalkeeperPos.y) || mines.some(mine => mine.x === minePos.x && mine.y === minePos.y));
        mines.push(minePos);
    }

    drawElements();
}
