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

Promise.all([
    new Promise((resolve) => playerImg.onload = resolve),
    new Promise((resolve) => goalkeeperImg.onload = resolve),
    new Promise((resolve) => ballImg.onload = resolve)
]).then(() => {
    console.log('Все изображения загружены');
    initializeMines();
    draw();
}).catch(error => {
    console.error('Ошибка при загрузке изображений:', error);
});

function initializeMines() {
    for (let i = 0; i < 3; i++) {
        let minePos;
        do {
            minePos = { x: Math.floor(Math.random() * 5) + 1, y: Math.floor(Math.random() * 3) };
        } while ((minePos.x === playerPos.x && minePos.y === playerPos.y) || 
                 (minePos.x === goalkeeperPos.x && minePos.y === goalkeeperPos.y) || 
                 mines.some(m => m.x === minePos.x && m.y === minePos.y));
        mines.push(minePos);
    }
    console.log('Мины:', mines);
}

canvas.addEventListener('click', (event) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (ballPos.x === playerPos.x) {
        if (col === ballPos.x + 1 && Math.abs(row - ballPos.y) <= 1) {
            ballPos = { x: col, y: row };
        }
    } else {
        if (col === ballPos.x + 1 && Math.abs(row - ballPos.y) <= 1) {
            ballPos = { x: col, y: row };
        }
    }

    if (ballPos.x === goalkeeperPos.x && ballPos.y === goalkeeperPos.y || mines.some(m => m.x === ballPos.x && m.y === ballPos.y)) {
        gameOver = true;
        goalkeeperAnimation(ballPos, goalkeeperPos);
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
    drawBackground();
    drawGameField();
    drawGrid();
    drawGoals();
    ctx.drawImage(playerImg, playerPos.x * cellWidth, playerPos.y * cellHeight, cellWidth, cellHeight);
    const ballSize = cellWidth * 0.6;
    ctx.drawImage(ballImg, ballPos.x * cellWidth + (cellWidth - ballSize) / 2, ballPos.y * cellHeight + (cellHeight - ballSize) / 2, ballSize, ballSize);
    ctx.drawImage(goalkeeperImg, goalkeeperPos.x * cellWidth, goalkeeperPos.y * cellHeight, cellWidth, cellHeight);
}

function drawBackground() {
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGameField() {
    ctx.fillStyle = 'green';
    ctx.fillRect(cellWidth, 0, canvas.width - 2 * cellWidth, canvas.height);
}

function drawGrid() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            ctx.strokeStyle = 'white';
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

function goalkeeperAnimation(ballPos, goalkeeperPos) {
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

        draw();

        if (goalkeeperPos.x === ballPos.x && goalkeeperPos.y === ballPos.y) {
            clearInterval(interval);
            setTimeout(() => {
                alert('Вы проиграли!');
                location.reload();
            }, 500);
        }
    }, 200);
}
