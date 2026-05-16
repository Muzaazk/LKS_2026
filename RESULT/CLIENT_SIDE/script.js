const cel = document.querySelectorAll(".cel");
const container = document.querySelector(".container");
const currentTurn = document.querySelector("h4");
const body = document.querySelector("body");

let turn = "X";
let gameOver = false;
let out = false;
const gameState = ["", "", "","", "","", "", "","", "","", "", "","", "","", "", "","", "","", "", "","", "",];
const winnerCondition = [
    [0,1,2,3,4],
    [5,6,7,8,9],
    [10,11,12,13,14],
    [15,16,17,18,19],
    [20,21,22,23,24],

    [0,5,10,15,20],
    [1,6,11,16,21],
    [2,7,12,17,22],
    [3,8,13,18,23],
    [4,9,14,19,24],

    [0,6,12,18,24],
    [4,8,12,16,20]
]

function onClick(index) {
    if (!gameOver && gameState[index] === "") {
        cel[index].textContent = turn;
        gameState[index] = turn;
        turn = turn === "X" ? "O" : "X";
        currentTurn.textContent = `Current turn : ${turn}`;
        checkWinner(index);
        if (checkDraw() && !out) {
            restartPopup();
            const popup = document.querySelector(".popup");
            const draw = document.createElement("h2");
            draw.setAttribute("class", "draw");
            draw.textContent =   "Game draw!"
            popup.appendChild(draw);
            gameOver = true;
            out = true;
        }
    }
}

function checkWinner(current) {
    for (let i = 0;i < winnerCondition.length; i++) {
        let [a,b,c,d,e] = winnerCondition[i];
        if (gameState[a] === gameState[current] &&
            gameState[b] === gameState[current] &&
            gameState[c] === gameState[current] &&
            gameState[d] === gameState[current] &&
            gameState[e] === gameState[current] &&
            !out
        ) {
            restartPopup();
            const popup = document.querySelector(".popup");
            const winner = document.createElement("h2");
            winner.setAttribute("class", "winner");
            winner.textContent =   `Player ${gameState[current]} Wins!`
            popup.appendChild(winner);
            gameOver = true;
            out = true;
        }
    }
}

function checkDraw() {
    const isDraw = gameState.every((item) => item !== "");
    return isDraw;
}

function restartPopup() {
    const popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    body.appendChild(popup);
    
    const h3 = document.createElement("h3");
    h3.setAttribute('class', 'h3');
    h3.textContent = "click restart button to restart the game";
    popup.appendChild(h3);

    const restartButton = document.createElement("button");
    restartButton.setAttribute("class", "restart-button");
    restartButton.textContent = "restart";
    popup.appendChild(restartButton);

    restartButton.addEventListener("click", restart);
}

function restart() {
    window.location = 'index.html';
}