<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soccer Game</title>
    <style>
        body {
            background-color: #C0C0C0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        canvas {
            border: 1px solid #000;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Размеры поля
        const cols = 7;
        const rows = 3;
        const cellSize = 100;
        const fieldWidth = cols * cellSize;
        const fieldHeight = rows * cellSize;
        canvas.width = fieldWidth + 2 * cellSize;
        canvas.height = fieldHeight;

        // Цвета
        const green = '#008000';
        const white = '#FFFFFF';
        const blue = '#0000FF';
        const red = '#FF0000';

        // Позиции
        let playerPos = { x: 0, y: 1 };
        let ballPos = { x: 1, y: 1 };
        let goalkeeperPos = { x: 6, y: 1 };
        let mines = generateMines();

        function generateMines() {
            const mines = [];
            for (let i = 0; i < 2; i++) {
                let minePos;
                do {
                    minePos = { x: Math.floor(Math.random() * (cols - 2)) + 1, y: Math.floor(Math.random() * rows) };
                } while ((minePos.x === playerPos.x && minePos.y === playerPos.y) || (minePos.x === goalkeeperPos.x && minePos.y === goalkeeperPos.y));
                mines.push(minePos);
            }
            return mines;
        }

        function drawField() {
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    ctx.fillStyle = green;
                    ctx.fillRect((col + 1) * cellSize, row * cellSize, cellSize, cellSize);
                    ctx.strokeStyle = white;
                    ctx.strokeRect((col + 1) * cellSize, row * cellSize, cellSize, cellSize);
                }
            }

            drawGoals();
        }

        function drawGoals() {
            for (let row = 0; row < rows; row++) {
                ctx.fillStyle = blue;
                ctx.fillRect(0, row * cellSize, cellSize, cellSize);
                ctx.strokeStyle = white;
                ctx.strokeRect(0, row * cellSize, cellSize, cellSize);

                ctx.fillStyle = red;
                ctx.fillRect((cols + 1) * cellSize, row * cellSize, cellSize, cellSize);
                ctx.strokeStyle = white;
                ctx.strokeRect((cols + 1) * cellSize, row * cellSize, cellSize, cellSize);
            }
        }

        function drawElements() {
            drawField();
            ctx.drawImage(playerImg, playerPos.x * cellSize, playerPos.y * cellSize, cellSize, cellSize);
            ctx.drawImage(ballImg, ballPos.x * cellSize + cellSize * 0.2, ballPos.y * cellSize + cellSize * 0.2, cellSize * 0.6, cellSize * 0.6);
            ctx.drawImage(goalkeeperImg, goalkeeperPos.x * cellSize, goalkeeperPos.y * cellSize, cellSize, cellSize);
        }

        const playerImg = new Image();
        const ballImg = new Image();
        const goalkeeperImg = new Image();

        playerImg.src = 'images/player.png';
        ballImg.src = 'images/ball.png';
        goalkeeperImg.src = 'images/goalkeeper.png';

        playerImg.onload = () => {
            ballImg.onload = () => {
                goalkeeperImg.onload = () => {
                    drawElements();
                };
            };
        };

        document.addEventListener('keydown', handleKeyPress);

        function handleKeyPress(e) {
            switch (e.key) {
                case 'ArrowLeft':
                    if (playerPos.x > 0) playerPos.x--;
                    break;
                case 'ArrowRight':
                    if (playerPos.x < cols - 1) playerPos.x++;
                    break;
                case 'ArrowUp':
                    if (playerPos.y > 0) playerPos.y--;
                    break;
                case 'ArrowDown':
                    if (playerPos.y < rows - 1) playerPos.y++;
                    break;
            }

            if (isColliding(playerPos, ballPos)) {
                ballPos.x = playerPos.x;
                ballPos.y = playerPos.y;
            }

            drawElements();
        }

        function isColliding(pos1, pos2) {
            return pos1.x === pos2.x && pos1.y === pos2.y;
        }

        function checkForMines() {
            for (let mine of mines) {
                if (isColliding(ballPos, mine)) {
                    alert("Вы проиграли!");
                    // Анимация движения вратаря
                    moveGoalkeeperTo(ballPos);
                    return true;
                }
            }
            return false;
        }

        function moveGoalkeeperTo(targetPos) {
            const interval = setInterval(() => {
                if (goalkeeperPos.x < targetPos.x) goalkeeperPos.x++;
                else if (goalkeeperPos.x > targetPos.x) goalkeeperPos.x--;
                if (goalkeeperPos.y < targetPos.y) goalkeeperPos.y++;
                else if (goalkeeperPos.y > targetPos.y) goalkeeperPos.y--;

                drawElements();

                if (goalkeeperPos.x === targetPos.x && goalkeeperPos.y === targetPos.y) clearInterval(interval);
            }, 100);
        }
    </script>
</body>
</html>
