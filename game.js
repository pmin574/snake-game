class SnakeGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.startButton = document.getElementById("startButton");
    this.scoreElement = document.getElementById("score");
    this.highScoreElement = document.getElementById("highScore");

    // Set canvas size
    this.canvas.width = 400;
    this.canvas.height = 400;

    // Game settings
    this.gridSize = 20;
    this.tileCount = this.canvas.width / this.gridSize;

    // Game state
    this.snake = [];
    this.food = {};
    this.direction = "right";
    this.nextDirection = "right";
    this.score = 0;
    this.highScore = localStorage.getItem("snakeHighScore") || 0;
    this.gameLoop = null;
    this.isGameOver = false;

    // Initialize
    this.init();
  }

  init() {
    // Set initial snake position
    this.snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];

    // Generate first food
    this.generateFood();

    // Set up event listeners
    this.startButton.addEventListener("click", () => this.startGame());
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    // Update high score display
    this.highScoreElement.textContent = this.highScore;
  }

  startGame() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    this.isGameOver = false;
    this.score = 0;
    this.scoreElement.textContent = this.score;
    this.direction = "right";
    this.nextDirection = "right";
    this.init();
    this.gameLoop = setInterval(() => this.update(), 100);
  }

  generateFood() {
    this.food = {
      x: Math.floor(Math.random() * this.tileCount),
      y: Math.floor(Math.random() * this.tileCount),
    };

    // Make sure food doesn't spawn on snake
    for (let segment of this.snake) {
      if (segment.x === this.food.x && segment.y === this.food.y) {
        this.generateFood();
        break;
      }
    }
  }

  handleKeyPress(e) {
    const keyMap = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const newDirection = keyMap[e.key];
    if (!newDirection) return;

    const opposites = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };

    if (opposites[newDirection] !== this.direction) {
      this.nextDirection = newDirection;
    }
  }

  update() {
    // Update direction
    this.direction = this.nextDirection;

    // Calculate new head position
    const head = { ...this.snake[0] };
    switch (this.direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    // Check for collisions
    if (this.checkCollision(head)) {
      this.gameOver();
      return;
    }

    // Add new head
    this.snake.unshift(head);

    // Check if food is eaten
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.scoreElement.textContent = this.score;
      this.generateFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  checkCollision(head) {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= this.tileCount ||
      head.y < 0 ||
      head.y >= this.tileCount
    ) {
      return true;
    }

    // Self collision
    for (let segment of this.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }

    return false;
  }

  gameOver() {
    clearInterval(this.gameLoop);
    this.isGameOver = true;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("snakeHighScore", this.highScore);
    }

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Game Over!",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = "#ecf0f1";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw snake
    this.ctx.fillStyle = "#2ecc71";
    for (let segment of this.snake) {
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 2,
        this.gridSize - 2
      );
    }

    // Draw food
    this.ctx.fillStyle = "#e74c3c";
    this.ctx.fillRect(
      this.food.x * this.gridSize,
      this.food.y * this.gridSize,
      this.gridSize - 2,
      this.gridSize - 2
    );
  }
}

// Initialize game when page loads
window.onload = () => {
  new SnakeGame();
};
