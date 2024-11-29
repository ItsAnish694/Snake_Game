//Used Variables and Constants
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
const initialSnake = [{ x: 32, y: 18 }]; //Initial Snake Position
const initialFood = { x: ranPos(64), y: ranPos(36) };
const duration = { hard: 50, medium: 100, easy: 150 };
const foodEatAudio = new Audio("audio/foodEat.mp3");
const collisionSelf = new Audio("audio/finished.mp3");
let isTooFast = false; //Checks For Rapid Input
let previousDirection = null; //Stores Previous Direction Input
let currScore = 0;
let hiScore = getLocalHighScore();
let food = null;
let collisionPosition = new Set(); //For Self And Food Collision Detection Stores Snake Co-Ordinates
let resume = null;
let restart = null;
let exit = null;
let head = null;
let snake = null;
let currentDirection = "d";

function getLocalHighScore() {
  if (localStorage.length === 0) {
    localStorage.setItem("High Score", "0");
    return Number(localStorage.getItem("High Score"));
  }
  return Number(localStorage.getItem("High Score"));
}

//To Start The Game
startButton.addEventListener("click", () => {
  document.documentElement.requestFullscreen();
  highScore.innerHTML = `High Score: ${hiScore}`;
  document.body.style.cursor = "none";
  startButton.classList.add("hidden");
  gameContainer.classList.remove("blur");

  //For Directions And Require KeyBoard Inputs
  addEventListener("keyup", async (e) => {
    if (!isTooFast) {
      if (currentDirection === " ") return;
      if (
        (e.key === "d" && currentDirection !== "a") ||
        (e.key === "a" && currentDirection !== "d") ||
        (e.key === "w" && currentDirection !== "s") ||
        (e.key === "s" && currentDirection !== "w") ||
        e.key === " "
      ) {
        previousDirection = currentDirection;
        currentDirection = e.key;
      }
      isTooFast = true;
    }
    await delayFunction(140);
    isTooFast = false;
  });
  startGame();
});

// Pause The Game When Exiting FullScreen
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    //Stops Current Direction From Updating When Game Is Paused And Exiting From FullScreen
    if (currentDirection !== " ") {
      previousDirection = currentDirection;
    }
    currentDirection = " ";
  }
});

async function startGame() {
  snake = [...initialSnake];
  food = updateFoodPosition(food);

  //GameLoop
  while (true) {
    head = { ...snake[0] }; //Creates New Head To Update
    if (currentDirection !== " ") {
      head = updateHead(head, currentDirection); //Updates Head Position With Current Direction
    } else {
      // Pause The Game When Space Key Is Pressed
      head = updateHead(head, previousDirection); //Updates Head Position With Previous Direction
      await paused(); //Waits For Resuming Or Restarting
      document.body.style.cursor = "none";
      if (resume) {
        // Reset Resume
        resumeButton.removeEventListener("click", resume);
        resume = null;
      }
      if (restart) {
        restartButton.removeEventListener("click", restart);
        restart = null;
      }
    }
    if (head.x !== food.x || head.y !== food.y) {
      //Updates Snake's Position For Movement
      collisionPosition.delete(
        `${snake[snake.length - 1].x},${snake[snake.length - 1].y}`
      );
      snake.pop();
      if (inSnake(head, collisionPosition)) {
        // When Snake Collides With Itself
        collisionSelf.play();
        await delayFunction(250);
        await gameOverMenu();
        if (restart) {
          restartButton.removeEventListener("click", restart);
          restart = null;
          snake.pop();
        }
      }
    } else {
      // When Snake Eats Food
      foodEatAudio.play();
      await delayFunction(50);
      updateScore(++currScore);
      if (currScore === 999) {
        pausedMenu.firstElementChild.innerHTML = "YOU WON!!!";
        await gameOverMenu();
        if (restart) {
          restartButton.removeEventListener("click", restart);
          restart = null;
          snake.pop();
        }
      }
      food = updateFoodPosition(food);

      while (inSnake(food, collisionPosition)) {
        // Checks If Food Generates Inside Snake Body
        food = updateFoodPosition(food);
      }
    }
    collisionPosition.add(`${head.x},${head.y}`);
    snake.unshift(head);
    gameBoardUpdate(snake, food); //Updates The GameBoard
    await delayFunction(duration.easy);
  }
}

function updateFoodPosition(food) {
  food = { x: ranPos(64), y: ranPos(36) };
  return food;
}

// Function To Return The Updated Head Position
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

// To Update The GameBoard
function gameBoardUpdate(snake, food) {
  gameBoard.innerHTML = "";
  drawSnake(snake);
  drawFood(food);
}

// For Drawing Snake
function drawSnake(snake) {
  for (let i = 0; i < snake.length; i++) {
    let segment = document.createElement("div");
    segment.className = "snake";
    segment.style.gridColumn = snake[i].x;
    segment.style.gridRow = snake[i].y;
    gameBoard.append(segment);
  }
}

// For Drawing Food
function drawFood(foodPos) {
  let food = document.createElement("div");
  food.className = "food";
  food.style.gridColumn = foodPos.x;
  food.style.gridRow = foodPos.y;
  gameBoard.append(food);
}

//To Update The Score And HighScore
function updateScore(score) {
  if (currScore > hiScore) {
    hiScore = currScore;
    localStorage.setItem("High Score", `${hiScore}`);
  }
  currentScore.innerHTML = `Current Score: ${score}`;
  highScore.innerHTML = `High Score: ${hiScore}`;
}

// For Adding Delay In Game When Needed
function delayFunction(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

//To Pause The Game When Snake Collides With Itself
async function gameOverMenu() {
  resumeButton.classList.add("hidden");
  gameOver.classList.remove("hidden");
  await paused();
}

//Function To Pause The Game
function paused() {
  return new Promise((resolve) => {
    document.body.style.cursor = "pointer";
    pausedMenu.classList.remove("hidden");
    gameContainer.classList.add("blur");

    restart = () => {
      // Resets Everything Required When Restarting
      if (!document.fullscreenElement)
        document.documentElement.requestFullscreen();
      currScore = 0;
      food = updateFoodPosition(food);
      currentScore.innerHTML = `Current Score: 0`;
      currentDirection = "d";
      gameContainer.classList.remove("blur");
      resumeButton.removeEventListener("click", resume);
      resume = null;
      snake = [...initialSnake];
      head = { ...snake[0] }; //Reset Head
      pausedMenu.classList.add("hidden");
      resumeButton.classList.remove("hidden");
      gameOver.classList.add("hidden");
      gameBoard.innerHTML = "";
      collisionPosition.clear();
      resolve();
    };

    resume = () => {
      // Update Everything Required When Resuming
      if (!document.fullscreenElement)
        document.documentElement.requestFullscreen();
      gameContainer.classList.remove("blur");
      restartButton.removeEventListener("click", restart);
      restart = null;
      pausedMenu.classList.add("hidden");
      currentDirection = previousDirection;
      resolve();
    };

    exit = () => {
      window.close(); //To Exit The Game
    };
    //Adding EventListener TO Buttons
    restartButton.addEventListener("click", restart);
    resumeButton.addEventListener("click", resume);
    exitButton.addEventListener("click", exit);
  });
}

// Returns Random Position From 1 to Given Size
function ranPos(ranSize) {
  return Math.floor(Math.random() * ranSize) + 1;
}

// Checks If The Object Is Inside Snake Or Not
function inSnake(object, collisionPosition) {
  if (collisionPosition.has(`${object.x},${object.y}`)) {
    return true;
  }
  return false;
}
