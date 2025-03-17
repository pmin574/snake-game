const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.createElement("button");
const restartButton = document.createElement("button");
const menu = document.createElement("div");

document.body.appendChild(menu);
menu.appendChild(startButton);
menu.appendChild(restartButton);
menu.style.position = "absolute";
menu.style.top = "50%";
menu.style.left = "50%";
menu.style.transform = "translate(-50%, -50%)";
menu.style.textAlign = "center";
menu.style.background = "rgba(0, 0, 0, 0.8)";
menu.style.padding = "20px";
menu.style.borderRadius = "10px";
startButton.textContent = "Start Game";
restartButton.textContent = "Restart Game";
restartButton.style.display = "none";

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};
let score = 0;
let gameInterval;
let gameSpeed = 200; // Slower speed (was 100ms)

startButton.addEventListener("click", () => {
  menu.style.display = "none";
  gameInterval = setInterval(drawGame, gameSpeed);
});

restartButton.addEventListener("click", () => {
  document.location.reload();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (event.key === "ArrowLeft" && direction !== "RIGHT")
    direction = "LEFT";
  else if (event.key === "ArrowRight" && direction !== "LEFT")
    direction = "RIGHT";
});

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let newHead = { ...snake[0] };
  if (direction === "UP") newHead.y -= box;
  if (direction === "DOWN") newHead.y += box;
  if (direction === "LEFT") newHead.x -= box;
  if (direction === "RIGHT") newHead.x += box;

  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    snake.pop();
  }

  if (
    newHead.x < 0 ||
    newHead.x >= canvas.width ||
    newHead.y < 0 ||
    newHead.y >= canvas.height ||
    snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
  ) {
    clearInterval(gameInterval);
    menu.style.display = "block";
    startButton.style.display = "none";
    restartButton.style.display = "block";
  }

  snake.unshift(newHead);

  ctx.fillStyle = "green";
  snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, box, box));

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}
