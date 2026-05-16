const input_name = document.getElementById("inputname");
const play_button = document.getElementById("playBtn");
const splashscreen = document.getElementById("splashscreen");
const background = document.getElementById("background");
const main_game_box = document.getElementById("main_game");

const HEIGHT = 800;
const WIDTH = 900;

background.height = HEIGHT;
background.width = WIDTH;

play_button.addEventListener("click", () => {
  console.log(input_name.value);
  splashscreen.classList.toggle("hidden");
  splashscreen.classList.toggle("flex");

  main_game_box.classList.toggle("hidden")
  main_game_box.classList.toggle("flex")
});
  
const base_path = "./assets";
const character_motion = ["char_down", "char_left", "char_right", "char_up"];
const dog_motion = ["dog_down", "dog_left", "dog_right", "dog_up"];

let grid_game_stone = [];

for (let column = 0; column < 7; column++) {
  grid_game_stone.push([]);
  for (let row = 0; row < 9; row++) {
    if (column == 1 && row == 1) {
      grid_game_stone[column][row] = false;
      continue;
    }
    grid_game_stone[column][row] = true;
  }
}

const stone = [
  [1, 1],
  [1, 3],
  [1, 5],
  [1, 7],
];

let character_x_pos = 0;
let character_y_pos = 0;

function detectCollisionStone(x_pos, y_pos) {
  const cannot = stone
    .map((item) => {
      console.log(x_pos > WIDTH / 11);
    })
    .flat();
  return;
}

function init() {
  const character = document.createElement("img");
  character.src = "./assets/char_down.png";
  character.classList.add("character");
  character.id = "character";

  character_x_pos = WIDTH / 11 + 10;
  character_y_pos = HEIGHT / 11 + 30;

  character.style.translate = `${character_x_pos}px ${character_y_pos}px `;
  main_game_box.append(character);
}

function move_character(code) {
  if (code == "KeyW") {
    character.src = `./assets/${character_motion[3]}.png`;
    character_y_pos -= 10;

    if (detectCollisionStone(character_x_pos, character_y_pos)) {
      character_y_pos += 10;
    }
  } else if (code == "KeyA") {
    character_x_pos -= 10;

    if (detectCollisionStone(character_x_pos, character_y_pos)) {
      character_x_pos -= 10;
    }
    character.src = `./assets/${character_motion[1]}.png`;
  } else if (code == "KeyS") {
    character_y_pos += 10;

    if (detectCollisionStone(character_x_pos, character_y_pos)) {
      character_y_pos -= 10;
    }

    character.src = `./assets/${character_motion[0]}.png`;
  } else if (code == "KeyD") {
    character_x_pos += 10;

    if (detectCollisionStone(character_x_pos, character_y_pos)) {
      character_x_pos -= 10;
    }
    character.src = `./assets/${character_motion[2]}.png`;
  }

  character.style.translate = `${character_x_pos}px ${character_y_pos}px`;
}
function start() {}

background.addEventListener("mousemove", (e) => {});

window.addEventListener("keypress", (e) => {
  console.log(e.code);

  move_character(e.code);
  if (e.code == "Space") {
    const bomb = document.createElement("img");
    bomb.src = "./assets/bomb.png";
    bomb.classList.add("bom");

    bomb.style.translate = `${character_x_pos}px ${character_y_pos}px`;
    main_game_box.append(bomb);
  }
});

background.addEventListener("mousemove", (e) => {});
init();
