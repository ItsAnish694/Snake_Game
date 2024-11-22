// const gameBoard = document.getElementById("gameBoard");
// const Snake = [{ x: 32, y: 18 }];
// const foodPos = { x: foodPosition(64), y: foodPosition(36) };
// let direction = "";
// let count = 0;

// addEventListener("keydown", (pressedKey) => {
//   if (
//     (pressedKey.key === "w" && direction != "s") ||
//     (pressedKey.key === "s" && direction != "w") ||
//     (pressedKey.key === "a" && direction != "d") ||
//     (pressedKey.key === "d" && direction != "a") ||
//     pressedKey.key === " "
//   )
//     direction = pressedKey.key;
// });

// function drawBoard() {
//   gameBoard.innerHTML = "";
//   drawSnake();
//   drawFood();
// }

// function foodPosition(size) {
//   return Math.floor(Math.random() * size) + 1;
// }

// function drawSnake() {
//   Snake.forEach((position) => {
//     let segment = document.createElement("div");
//     segment.className = "snake";
//     segment.style.gridColumn = position.x;
//     segment.style.gridRow = position.y;
//     gameBoard.append(segment);
//   });
// }

// function drawFood() {
//   let food = document.createElement("div");
//   food.className = "food";
//   food.style.gridColumn = foodPos.x;
//   food.style.gridRow = foodPos.y;
//   gameBoard.append(food);
// }

// setInterval(() => {
//   const head = { ...Snake[0] };
//   switch (direction) {
//     case "w":
//       head.y--;
//       if (head.y < 1) head.y = 36;
//       break;
//     case "s":
//       head.y++;
//       if (head.y > 36) head.y = 1;
//       break;
//     case "a":
//       head.x--;
//       if (head.x < 1) head.x = 64;
//       break;
//     case "d":
//       head.x++;
//       if (head.x > 64) head.x = 1;
//       break;
//     case " ":
//       direction = "";
//       break;
//   }
//   Snake.unshift(head);
//   if (head.x === foodPos.x && head.y === foodPos.y) {
//     foodPos.x = foodPosition(64);
//     foodPos.y = foodPosition(36);
//   } else {
//     Snake.pop();
//   }
//   drawBoard();
// }, 150);
