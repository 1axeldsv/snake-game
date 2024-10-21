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
let gameStarted = false;

const elvireImg = new Image();
elvireImg.src = './elvire.png';
const votreImg = new Image();
votreImg.src = './vous.png';
const bruneImg = new Image();
bruneImg.src = './brune.png';
const img113 = new Image();
img113.src = './113.png';

let currentFoodImage = elvireImg;

// Meilleurs scores
let bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];

function getFoodImage(score) {
  if (score === 10) return bruneImg;
  if (score === 30) return img113;
  
  // Pour tous les autres scores, on alterne entre Elvire et Votre photo
  return currentFoodImage === elvireImg ? votreImg : elvireImg;
}

function getRandomFoodPosition() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function drawGame() {
  clearCanvas();
  if (gameStarted) {
    moveSnake();
  }
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
    currentFoodImage = getFoodImage(score);
  } else {
    snake.pop();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#ff69b4' : '#ffb6c1';
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
  updateBestScores();
  alert(`Game Over! Votre score: ${score}\n\nMeilleurs scores:\n${getBestScoresText()}`);
  resetGame();
}

function updateBestScores() {
  bestScores.push(score);
  bestScores.sort((a, b) => b - a);
  bestScores = bestScores.slice(0, 5);
  localStorage.setItem('bestScores', JSON.stringify(bestScores));
}

function getBestScoresText() {
  return bestScores.map((score, index) => `${index + 1}. ${score}`).join('\n');
}

function resetGame() {
  snake = [{x: 10, y: 10}];
  food = getRandomFoodPosition();
  dx = 0;
  dy = 0;
  score = 0;
  gameStarted = false;
  currentFoodImage = elvireImg;
  clearInterval(gameLoop);
  drawGame();
}

function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  const keyPressed = event.keyCode;
  if ([LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY].includes(keyPressed)) {
    event.preventDefault();
  }
  if (!gameStarted) {
    startGame();
  }
  changeDirectionByCode(keyPressed);
}

function changeDirectionByCode(keyCode) {
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;
  if (keyCode === 37 && !goingRight) {
    dx = -1;
    dy = 0;
  }
  if (keyCode === 38 && !goingDown) {
    dx = 0;
    dy = -1;
  }
  if (keyCode === 39 && !goingLeft) {
    dx = 1;
    dy = 0;
  }
  if (keyCode === 40 && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameLoop = setInterval(drawGame, 100);
  }
}

// Mobile controls
const mobileButtons = ['up', 'down', 'left', 'right'];
mobileButtons.forEach(direction => {
  document.getElementById(direction).addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!gameStarted) {
      startGame();
    }
    changeDirectionByCode({up: 38, down: 40, left: 37, right: 39}[direction]);
  });
});

// Prevent scrolling with arrow keys
window.addEventListener("keydown", function(e) {
  if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

// Initial draw
drawGame();
