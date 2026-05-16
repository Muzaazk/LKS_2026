const container = document.querySelector(".container");

const winnerCondition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const gameState = ["", "", "", "", "", "", "", "", ""];
const cel = document.querySelectorAll(".cel");
const currentTurn = document.getElementById("currentTurn");
let turn = "X";
let gameOver = false;
let out = false;

function onClick(index) {
  if (!gameOver && gameState[index] === "") {
    cel[index].textContent = turn;
    gameState[index] = turn;
    checkWinner(index);
    turn = turn === "X" ? "O" : "X";
    currentTurn.textContent = `current turn : ${turn}`;
    let color = turn === "X" ? "blue" : "red";
    cel[index].style.color = color;
    if (checkDraw()) {
      gameOver = true;
      const h3 = document.createElement("h3");
      h3.setAttribute("class", "winner");
      h3.textContent = "DRAW";
      container.appendChild(h3);
    }
  }
}

function checkWinner(current) {
  for (let i = 0; i < winnerCondition.length; i++) {
    const [a, b, c] = winnerCondition[i];

    if (
      gameState[a] === gameState[current] &&
      gameState[b] === gameState[current] &&
      gameState[c] === gameState[current] &&
      !out
    ) {
      const win = gameState[current];
      const h3 = document.createElement("h3");
      h3.setAttribute("class", "winner");
      h3.textContent = `${win} Menang`;
      container.appendChild(h3);

      gameOver = true;
      out = true;
    }
  }
}

function checkDraw() {
  if (!out) {
    let isDraw = gameState.every((item) => item !== "");
    return isDraw;
  }
}
