const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");
const HightScoreElement = document.querySelector("#high-score");
const ScoreElement = document.querySelector("#score");
const TimeElement = document.querySelector("#time");

const blockHeight = 50;
const blockWidth = 50;
let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = "00-00";
HightScoreElement.textContent = highScore;
ScoreElement.textContent = score;
TimeElement.textContent = time;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalID = null;
let timerIntervalId = null;
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};
const blocks = [];
let snake = [{ x: 1, y: 3 } /* Snake Head */];
let direction = "right";
// for (let i = 0; i < rows * cols; i++) {
//   const block = document.createElement("div");
//   block.classList.add("block");
//   board.appendChild(block);
// }
// Create board grid
for (row = 0; row < rows; row++) {
  for (col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row}-${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

function renderSnake() {
  // Show food
  blocks[`${food.x}-${food.y}`].classList.add("food");
  // Calculate next head
  let head = null;
  if (direction == "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction == "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction == "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
  // Wall collision
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalID);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }
  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    (food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    }),
      blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);

    score += 10;
    ScoreElement.innerText = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
  }
  // Clear old snake blocks
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    // console.log(blocks[`${segment.x}-${segment.y}`]);
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}
// intervalID = setInterval(() => {
//   renderSnake();
// }, 400);
startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalID = setInterval(() => {
    renderSnake();
  }, 300);
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    TimeElement.textContent = time;
  }, 1000);
});
restartButton.addEventListener("click", restartGame);

function restartGame() {
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  direction = "down";
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  score = 0;
  time = `00-00`;
  ScoreElement.textContent = score;
  TimeElement.textContent = time;
  modal.style.display = "none";
  snake = [{ x: 1, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  intervalID = setInterval(() => {
    renderSnake();
  }, 300);
}
addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    direction = "up";
  } else if (event.key === "ArrowRight") {
    direction = "right";
  } else if (event.key === "ArrowLeft") {
    direction = "left";
  } else if (event.key === "ArrowDown") {
    direction = "down";
  }
});
