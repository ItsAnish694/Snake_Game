const startButton = document.querySelector(".start");
const resumeButton = document.querySelector(".resume");
const restartButton = document.querySelector(".restart");
const exitButton = document.querySelector(".exit");
const gameBoard = document.querySelector("#gameBoard");
const pausedMenu = document.querySelector("#pausedMenu");
const gameContainer = document.querySelector(".gameContainer");
const gameOver = document.querySelector("#pausedMenu h1");
const currentScore = document.querySelector(".currentScore h1");
const highScore = document.querySelector(".highScore h1");
const initialSnake = [{ x: 32, y: 18 }];
const duration = { hard: 50, medium: 100, easy: 150 };
let isToFast = false;
let currentDir = null;
let currScore = 0;
let hiScore = -Infinity;
let mySet = new Set(`${initialSnake[0].x},${initialSnake[0].y}`);
let resume = null;
let restart = null;
let exit = null;
let direction = "d";

startButton.addEventListener("click", () => {
  document.documentElement.requestFullscreen();
  document.body.style.cursor = "none";
  startButton.classList.add("hidden");
  gameContainer.classList.remove("blur");

  addEventListener("keyup", async (e) => {
    if (!isToFast) {
      if (direction === " ") return;
      if (
        (e.key === "d" && direction !== "a") ||
        (e.key === "a" && direction !== "d") ||
        (e.key === "w" && direction !== "s") ||
        (e.key === "s" && direction !== "w") ||
        (e.key === " " && resume === null)
      ) {
        currentDir = direction;
        direction = e.key;
      }
      isToFast = true;
    }
    await delayFunction(140);
    isToFast = false;
  });

  Game();
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    currentDir = direction;
    direction = " ";
  }
});

async function Game() {
  const snake = [...initialSnake];
  const foodPos = { x: ranPos(64), y: ranPos(36) };

  while (true) {
    let head = { ...snake[0] };
    if (direction === " ") {
      head = updateHead(head, currentDir);
      await paused();
      document.body.style.cursor = "none";
      if (resume) {
        resumeButton.removeEventListener("click", resume);
        resume = null;
      }
    } else {
      head = updateHead(head, direction);
    }

    if (head.x !== foodPos.x || head.y !== foodPos.y) {
      mySet.delete(`${snake[snake.length - 1].x},${snake[snake.length - 1].y}`);
      snake.pop();
      if (inSnake(head, mySet)) {
        await gameOverMenu();
      }
    } else {
      updateScore(++currScore);
      foodPos.x = ranPos(64);
      foodPos.y = ranPos(36);
      while (inSnake(foodPos, mySet)) {
        foodPos.x = ranPos(64);
        foodPos.y = ranPos(36);
      }
    }
    mySet.add(`${head.x},${head.y}`);
    snake.unshift(head);
    startGame(snake, foodPos);
    await delayFunction(duration.easy);
  }
}

function updateHead(head, direction) {
  switch (direction) {
    case "w":
      head.y--;
      if (head.y < 1) head.y = 36;
      break;
    case "s":
      head.y++;
      if (head.y > 36) head.y = 1;
      break;
    case "a":
      head.x--;
      if (head.x < 1) head.x = 64;
      break;
    case "d":
      head.x++;
      if (head.x > 64) head.x = 1;
      break;
  }
  return head;
}

function updateScore(score) {
  if (currScore > hiScore) hiScore = currScore;
  currentScore.innerHTML = `Current Score:${score}`;
  highScore.innerHTML = `High Score:${hiScore}`;
}

function delayFunction(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

async function gameOverMenu() {
  resumeButton.classList.add("hidden");
  gameOver.classList.remove("hidden");
  document.body.style.cursor = "pointer";
  await paused();
}

function paused() {
  return new Promise((resolve) => {
    document.body.style.cursor = "pointer";
    pausedMenu.classList.remove("hidden");
    gameContainer.classList.add("blur");

    restart = () => {
      location.reload();
    };

    resume = () => {
      if (!document.fullscreenElement)
        document.documentElement.requestFullscreen();
      gameContainer.classList.remove("blur");
      direction = currentDir;
      pausedMenu.classList.add("hidden");
      resolve();
    };

    exit = () => {
      window.close();
    };

    restartButton.addEventListener("click", restart);
    resumeButton.addEventListener("click", resume);
    exitButton.addEventListener("click", exit);
  });
}

function ranPos(ranSize) {
  return Math.floor(Math.random() * ranSize) + 1;
}

function startGame(snake, foodPos) {
  gameBoard.innerHTML = "";
  drawSnake(snake);
  drawFood(foodPos);
}

function drawSnake(snake) {
  for (let i = 0; i < snake.length; i++) {
    let segment = document.createElement("div");
    segment.className = "snake";
    segment.style.gridColumn = snake[i].x;
    segment.style.gridRow = snake[i].y;
    gameBoard.append(segment);
  }
}

function drawFood(foodPos) {
  let food = document.createElement("div");
  food.className = "food";
  food.style.gridColumn = foodPos.x;
  food.style.gridRow = foodPos.y;
  gameBoard.append(food);
}

function inSnake(object, mySet) {
  if (mySet.has(`${object.x},${object.y}`)) {
    return true;
  }
  return false;
}
