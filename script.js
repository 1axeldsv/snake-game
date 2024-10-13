const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10},
];
let food = getRandomFoodPosition();
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;

const elvireImg = new Image();
elvireImg.src = './elvire.png';

const votreImg = new Image();
votreImg.src = './vous.png';

let currentFoodImage = elvireImg;

let touchStartX = 0;
let touchStartY = 0;

function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFoodPosition();
        currentFoodImage = currentFoodImage === elvireImg ? votreImg : elvireImg;
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'darkgreen' : 'green';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.drawImage(currentFoodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    clearInterval(gameLoop);
    alert('Game Over! Votre score: ' + score);
}

function updateScore() {
    scoreElement.textContent = 'Score: ' + score;
}

document.addEventListener('keydown', changeDirection);
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function handleTouchStart(evt) {
    touchStartX = evt.touches[0].clientX;
    touchStartY = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = evt.touches[0].clientX;
    let touchEndY = evt.touches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && !goingLeft) {
            changeDirection({keyCode: 39}); // Droite
        } else if (dx < 0 && !goingRight) {
            changeDirection({keyCode: 37}); // Gauche
        }
    } else {
        if (dy > 0 && !goingUp) {
            changeDirection({keyCode: 40}); // Bas
        } else if (dy < 0 && !goingDown) {
            changeDirection({keyCode: 38}); // Haut
        }
    }

    touchStartX = 0;
    touchStartY = 0;
    evt.preventDefault();
}

gameLoop = setInterval(drawGame, 100);
