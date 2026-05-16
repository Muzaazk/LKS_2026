const map = document.querySelector(".wrap-content");
const inputPin = document.querySelector(".wrap-pin");
const mapSvg = document.getElementById("map");
const inputLocation = document.getElementById("inputLocation");
const btnClose = document.querySelector(
  ".wrap-pin .wrap-pin-box .wrap-pin-header h5",
);
const popupConnect = document.querySelector(".wrap-connect");
const closePopupConnect = document.getElementById("closePopupConnect");
const inputDistance = document.getElementById("number");
const inputMode = document.getElementById("mode");
const btnSubmit = document.getElementById("submit");
const lineSvg = document.getElementById("lines");
const container = document.querySelector(".container");

btnSubmit.disabled = true;
btnSubmit.style.cursor = "not-allowed";
const selectMode = [
  {
    lable: "Train",
    color: "#33E339",
    speed: 120,
    cost: 500,
  },
  {
    lable: "Bus",
    color: "#A83BE8 ",
    speed: 80,
    cost: 100,
  },
  {
    lable: "Airplane",
    color: "#000000 ",
    speed: 800,
    cost: 1000,
  },
];

let info = {
  location: "",
  x: 0,
  y: 0,
};
let pin1 = null;
let pin2 = null;
let isConnect = false;
let distance = 0;
let mode = null;

function renderLines() {
  const oldLine = document.querySelectorAll("line");
  oldLine.forEach((item) => {
    lineSvg.removeChild(item);
  });
  let pinpoints = JSON.parse(localStorage.getItem("pinpoints")) || [];
  let connections = JSON.parse(localStorage.getItem("connections")) || [];
  let pinMap = Object.fromEntries(pinpoints.map((item) => [item.id, item]));

  connections.forEach((item) => {
    const a = pinMap[item.fromId];
    const b = pinMap[item.toId];
    console.log(a, b);
    const x1 = (a.x / container.clientWidth) * 792.54596;
    const y1 = (a.y / container.clientHeight) * 316.66394;
    const x2 = (b.x / container.clientWidth) * 792.54596;
    const y2 = (b.y / container.clientHeight) * 316.66394;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "1");

    lineSvg.appendChild(line);
  });
}

renderLines();
renderPins();

map.addEventListener("dblclick", function (e) {
  inputPin.style.display = "block";
  const rect = inputPin.getBoundingClientRect();
  info.x = e.clientX;
  info.y = e.clientY;
  const x = e.clientX - rect.width / 2;
  const y = e.clientY - rect.height;
  inputPin.style.top = y + "px";
  inputPin.style.left = x + "px";
});

inputLocation.addEventListener("input", (e) => {
  info.location = e.target.value;
});

inputPin.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    inputPin.style.display = "none";
    const dataNew = {
      id: Date.now() + Math.random(999),
      location: info.location,
      x: info.x,
      y: info.y,
    };
    const data = JSON.parse(localStorage.getItem("pinpoints")) || [];
    data.push(dataNew);

    localStorage.setItem("pinpoints", JSON.stringify(data));
    renderPins();
  }
});

btnClose.addEventListener("click", function () {
  inputPin.style.display = "none";
});

function renderPins() {
  const el = document.querySelectorAll(".wrap-pin2");
  el.forEach((element) => {
    element.remove();
  });
  const data = JSON.parse(localStorage.getItem("pinpoints"));
  if (!data) return;
  data.forEach((item, index) => {
    const div = document.createElement("div");
    div.setAttribute("class", "wrap-pin2");
    div.style.cursor = "pointer";

    const pinBox = document.createElement("div");
    pinBox.setAttribute("class", "pin-box");

    const pinBoxName = document.createElement("p");
    pinBoxName.setAttribute("class", "pin-box-name");
    pinBoxName.textContent = item.location;

    const pinBoxConnect = document.createElement("div");
    pinBoxConnect.setAttribute("class", "pin-box-connect");
    pinBoxConnect.textContent = "⇄";
    pinBoxConnect.addEventListener("click", () => {
      if (!pin1) {
        pin1 = item.id;
        pinBox.style.border = "1px solid blue";
        pinBox.style.boxShadow = "0px 0px 10px blue";
      } else if (pin1 !== item.id) {
        pin2 = item.id;
        isConnect = true;
        popupConnect.style.display = "grid";
      }
    });

    const pinBoxDelete = document.createElement("div");
    pinBoxDelete.setAttribute("class", "pin-box-delete");
    pinBoxDelete.textContent = "x";
    pinBoxDelete.style.color = "red";

    const pin = document.createElement("p");
    pin.setAttribute("class", "pin");
    pin.textContent = "▼";

    pinBox.appendChild(pinBoxName);
    pinBox.appendChild(pinBoxConnect);
    pinBox.appendChild(pinBoxDelete);
    div.appendChild(pinBox);
    div.appendChild(pin);
    map.appendChild(div);

    const rect = div.getBoundingClientRect();
    const x = item.x - rect.width / 2;
    const y = item.y - rect.height;
    div.style.left = x + "px";
    div.style.top = y + "px";

    pinBoxDelete.addEventListener("click", () => {
      const dataNew = data.filter((item, indexNew) => indexNew !== index);
      localStorage.setItem("pinpoints", JSON.stringify(dataNew));
      renderPins();
    });
  });
}

closePopupConnect.addEventListener("click", () => {
  popupConnect.style.display = "none";
  pin1 = null;
  pin2 = null;
  renderPins();
});

inputDistance.addEventListener("input", (e) => {
  distance = e.target.value;
  submit();
});

inputMode.addEventListener("input", (e) => {
  mode = selectMode[e.target.value];
  submit();
});

btnSubmit.addEventListener("click", () => {
  let data = {
    id: Date.now() + Math.random(999),
    fromId: pin1,
    toId: pin2,
    distance: distance,
    mode: mode,
  };

  let newData = JSON.parse(localStorage.getItem("connections")) || [];
  newData.push(data);
  localStorage.setItem("connections", JSON.stringify(newData));
  connections = newData;
  popupConnect.style.display = "none";
  renderLines();
  renderPins();
});

function submit() {
  if (distance && mode) {
    btnSubmit.disabled = false;
    btnSubmit.style.cursor = "pointer";
  }
}
