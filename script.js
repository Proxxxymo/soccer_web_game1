const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Размеры сетки
const rows = 3;
const cols = 7;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

// Загрузка изображений
const playerImg = new Image();
const goalkeeperImg = new Image();
const ballImg = new Image();
playerImg.src = "images/player.png";
goalkeeperImg.src = "images/goalkeeper.png";
ballImg.src = "images/ball.png";

const playerPos = { x: 0, y: Math.floor(rows / 2) };
let ballPos = { ...playerPos };
const goalkeeperPos = { x: cols - 1, y: Math.floor(Math.random() * rows) };
const mines = [];

// Заполнение минами случайных позиций, кроме начальной позиции игрока и последней клетки
for (let i = 0; i < 3; i++) {
    const minePos = { x: Math.floor(Math.random() * (cols - 2)) + 1, y: Math.floor(Math.random() * rows) };
    if (minePos.x !== playerPos.x && minePos.y !== playerPos.y && minePos.x !== goalkeeperPos.x && minePos.y !== goalkeeperPos.y) {
        mines.push(minePos);
    }
}

function draw() {
    // Заливка фона белым цветом
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем сетку зеленым цветом
    ctx.fillStyle = "green";
    ctx.fillRect(cellWidth, 0, canvas.width - 2 * cellWidth, canvas.height);

    // Рисуем сетку
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.strokeStyle = "white";
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }

    // Рисуем ворота
    for (let row = 0; row < rows; row++) {
        ctx.strokeStyle = "blue";
        ctx.strokeRect(0, row * cellHeight, cellWidth, cellHeight);
        ctx.strokeStyle = "red";
        ctx.strokeRect((cols - 1) * cellWidth, row * cellHeight, cellWidth, cellHeight);
    }

    // Рисуем элементы
    ctx.drawImage(playerImg, playerPos.x * cellWidth, playerPos.y * cellHeight, cellWidth, cellHeight);
    ctx.drawImage(ballImg, ballPos.x * cellWidth + (cellWidth - ballImg.width) / 2, ballPos.y * cellHeight + (cellHeight - ballImg.height) / 2, ballImg.width, ballImg.height);
    ctx.drawImage(goalkeeperImg, goalkeeperPos.x * cellWidth, goalkeeperPos.y * cellHeight, cellWidth, cellHeight);

    // Рисуем мины
    mines.forEach(mine => {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(mine.x * cellWidth + cellWidth / 2, mine.y * cellHeight + cellHeight / 2, cellWidth / 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const col = Math.floor(mouseX / cellWidth);
    const row = Math.floor(mouseY / cellHeight);

    if (ballPos.x === playerPos.x && ballPos.y === playerPos.y) {
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

    if (ballPos.x === goalkeeperPos.x && ballPos.y === goalkeeperPos.y) {
        goalkeeperAnimation(ballPos, goalkeeperPos, () => {
            alert('Вы проиграли!');
            location.reload();
        });
    } else if (mines.some(mine => mine.x === ballPos.x && mine.y === ballPos.y)) {
        goalkeeperAnimation(ballPos, goalkeeperPos, () => {
            alert('Вы проиграли!');
            location.reload();
        });
    } else if (col === cols - 1) {
        alert('Вы выиграли!');
        location.reload();
    }

    draw();
});

function goalkeeperAnimation(ballPos, goalkeeperPos, onComplete) {
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
            const catchChance = Math.random();
            if (catchChance < 0.4) { // 40% шанс что вратарь поймает мяч
                setTimeout(onComplete, 500);
            } else {
                setTimeout(() => {
                    alert('Вратарь промахнулся! У вас еще один шанс.');
                    draw();
                }, 500);
            }
        }
    }, 200);
}

draw();
