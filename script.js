const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const cellWidth = canvas.width / 7;
const cellHeight = canvas.height / 3;

const playerImg = new Image();
const goalkeeperImg = new Image();
const ballImg = new Image();

playerImg.src = 'images/player.png';
goalkeeperImg.src = 'images/goalkeeper.png';
ballImg.src = 'images/ball.png';

let playerPos = { x: 0, y: 1 };
let ballPos = { ...playerPos };
let goalkeeperPos = { x: 6, y: Math.floor(Math.random() * 3) };
let mines = [];
let gameOver = false;

// Подождем, пока все изображения загрузятся
Promise.all([
    new Promise((resolve) => playerImg.onload = resolve),
    new Promise((resolve) => goalkeeperImg.onload = resolve),
    new Promise((resolve) => ballImg.onload = resolve)
]).then(() => {
    // Отрисуем игровое поле после загрузки всех изображений
    draw();
});

for (let i = 0; i < 3; i++) {
    let minePos;
    do {
        minePos = { x: Math.floor(Math.random() * 5) + 1, y: Math.floor(Math.random() * 3) };
    } while ((minePos.x === playerPos.x && minePos.y === playerPos.y) || 
             (minePos.x === goalkeeperPos.x && minePos.y === goalkeeperPos.y) || 
             mines.some(m => m.x === minePos.x && m.y === minePos.y));
    mines.push(minePos);
}

canvas.addEventListener('click', (event) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (ballPos.x === playerPos.x) {
        // Ограничиваем движение только вперед и наискосок, когда на начальной позиции
        if (col === ballPos.x + 1 && Math.abs(row - ballPos.y) <= 1) {
            ballPos = { x: col, y: row };
        }
    } else {
        // Ограничиваем движение только вперед, наискосок и прямо
        if (col === ballPos.x + 1 && Math.abs(row - ballPos.y) <= 1) {
            ballPos = { x: col, y: row };
        }
    }

    if (ballPos.x === goalkeeperPos.x && ballPos.y === goalkeeperPos.y || mines.some(m => m.x === ballPos.x && m.y === ballPos.y)) {
        gameOver = true;
        setTimeout(() => {
            alert('Вы проиграли!');
            location.reload();
        }, 500);
    } else if (ballPos.x === 6) {
        gameOver = true;
        setTimeout(() => {
            alert('Вы выиграли!');
            location.reload();
        }, 500);
    }

    draw();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawGoals();
    ctx.drawImage(playerImg, playerPos.x * cellWidth, playerPos.y * cellHeight, cellWidth, cellHeight);
    const ballSize = cellWidth * 0.6;  // Размер мяча составляет 60% от ширины ячейки
    ctx.drawImage(ballImg, ballPos.x * cellWidth + (cellWidth - ballSize) / 2, ballPos.y * cellHeight + (cellHeight - ballSize) / 2, ballSize, ballSize);
    ctx.drawImage(goalkeeperImg, goalkeeperPos.x * cellWidth, goalkeeperPos.y * cellHeight, cellWidth, cellHeight);
}

function drawGrid() {
    ctx.strokeStyle = 'white';
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }
}

function drawGoals() {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    for (let row = 0; row < 3; row++) {
        ctx.strokeRect(0, row * cellHeight, cellWidth, cellHeight);
    }
    ctx.strokeStyle = 'red';
    for (let row = 0; row < 3; row++) {
        ctx.strokeRect(6 * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }
    ctx.lineWidth = 1;
}
