const mapSvg = document.getElementById("map");
const addPinpoint = document.querySelector(".add-pinpoint");
const closeBtnPinpoint = document.getElementById("closeBtnPinpoint");
const inputLocation = document.getElementById("inputLocation");
const wrapContent = document.querySelector(".wrap-content");
const popupConnect = document.querySelector(".connect");
const closeBtnConnect = document.getElementById("closeBtnConnect");
const btnSubmit = document.getElementById("btnSubmit");
const inputDistance = document.getElementById("inputDistance");
const inputMode = document.getElementById("inputMode");

let info = {
  x: 0,
  y: 0,
  xSvg: 0,
  ySvg: 0,
  location: "",
};

const selectMode = [
  {
    label: "Train",
    speed: 120,
    cost: 500,
    color: "#33E339",
  },
  {
    label: "Bus",
    speed: 80,
    cost: 100,
    color: "#A83BE8",
  },
  {
    label: "Airplane",
    speed: 800,
    cost: 1000,
    color: "#000000",
  },
];

let pin1 = null;
let pin2 = null;
let mode = null;
let distance = 0;

renderPins();
renderLines();
btnSubmit.disabled = true;
btnSubmit.style.cursor = "not-allowed";

mapSvg.addEventListener("dblclick", (e) => {
  addPinpoint.style.display = "flex";
  const x = e.clientX - addPinpoint.clientWidth / 2;
  const y = e.clientY - addPinpoint.clientHeight;
  const svg = screenToSvg(e.clientX, e.clientY);

  info.x = e.clientX;
  info.y = e.clientY;
  info.xSvg = svg.x;
  info.ySvg = svg.y;

  addPinpoint.style.left = x + "px";
  addPinpoint.style.top = y + "px";
});

function screenToSvg(screenX, screenY) {
  const svgPoint = mapSvg.createSVGPoint();
  svgPoint.x = screenX;
  svgPoint.y = screenY;
  const matrix = mapSvg.getScreenCTM();
  if (!matrix) {
    return {
      x: 0,
      y: 0,
    };
  }
  return svgPoint.matrixTransform(matrix.inverse());
}

closeBtnPinpoint.addEventListener("click", () => {
  addPinpoint.style.display = "none";
  inputLocation.value = "";
});

inputLocation.addEventListener("input", (e) => {
  info.location = e.target.value;
});

inputLocation.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && info.location != "") {
    const newData = {
      id: Date.now() + Math.random(999),
      x: info.x,
      y: info.y,
      xSvg: info.xSvg,
      ySvg: info.ySvg,
      location: info.location,
    };

    const data = JSON.parse(localStorage.getItem("pinpoints")) || [];
    data.push(newData);
    localStorage.setItem("pinpoints", JSON.stringify(data));

    addPinpoint.style.display = "none";
    renderPins();
    inputLocation.value = "";
  }
});

function renderPins() {
  const oldPins = document.querySelectorAll(".wrap-pin");
  oldPins.forEach((el) => {
    wrapContent.removeChild(el);
  });
  const pinpoints = JSON.parse(localStorage.getItem("pinpoints")) || [];
  pinpoints.forEach((item) => {
    const div = document.createElement("div");
    div.setAttribute("class", "wrap-pin");

    const pinBox = document.createElement("div");
    pinBox.setAttribute("class", "pin-box");

    const pinLocation = document.createElement("p");
    pinLocation.setAttribute("class", "pin-location");
    pinLocation.textContent = item.location;

    const pinConnect = document.createElement("p");
    pinConnect.setAttribute("class", "pin-connect");
    pinConnect.textContent = "⇄";
    pinConnect.addEventListener("click", () => {
      if (!pin1) {
        pin1 = item.id;
        pinBox.style.boxShadow = "0px 0px 10px blue";
        addPinpoint.style.display = "none";
      } else if (pin1) {
        pin2 = item.id;
        popupConnect.style.display = "block";
      }
    });

    const pinDelete = document.createElement("p");
    pinDelete.setAttribute("class", "pin-delete");
    pinDelete.textContent = "X";
    pinDelete.addEventListener("click", () => {
      const newData = pinpoints.filter((el) => el.id != item.id);
      localStorage.setItem("pinpoints", JSON.stringify(newData));
      removeLine(item.id);
      renderPins();
    });

    const pinIcon = document.createElement("p");
    pinIcon.setAttribute("class", "pin-icon");
    pinIcon.textContent = "▼";

    pinBox.appendChild(pinLocation);
    pinBox.appendChild(pinConnect);
    pinBox.appendChild(pinDelete);
    div.appendChild(pinBox);
    div.appendChild(pinIcon);
    wrapContent.appendChild(div);

    const x = item.x - div.clientWidth / 2;
    const y = item.y - div.clientHeight;

    div.style.left = x + "px";
    div.style.top = y + "px";
  });
}

closeBtnConnect.addEventListener("click", () => {
  popupConnect.style.display = "none";
  resetState();
});

inputDistance.addEventListener("input", (e) => {
  distance = e.target.value;
  validateButton();
});

inputMode.addEventListener("input", (e) => {
  mode = selectMode[e.target.value];
  validateButton();
});

function validateButton() {
  if (mode && distance) {
    btnSubmit.disabled = false;
    btnSubmit.style.cursor = "pointer";
  }
}

btnSubmit.addEventListener("click", () => {
  const newData = {
    id: Date.now() + Math.random(999),
    fromId: pin1,
    toId: pin2,
    distance: distance,
    mode: mode,
  };
  const data = JSON.parse(localStorage.getItem("connections")) || [];
  data.push(newData);
  localStorage.setItem("connections", JSON.stringify(data));
  popupConnect.style.display = "none";
  resetState();
  renderLines();
});

function resetState() {
  pin1 = null;
  pin2 = null;
  inputDistance.value = "";
  inputMode.value = "";
  btnSubmit.disabled = true;
  btnSubmit.style.cursor = "not-allowed";
  renderPins();
}

function renderLines() {
  const connections = JSON.parse(localStorage.getItem("connections")) || [];
  const pinpoints = JSON.parse(localStorage.getItem("pinpoints")) || [];
  const data = Object.fromEntries(pinpoints.map((item) => [item.id, item]));
  const oldLines = document.querySelectorAll(".lines");
  const oldTexts = document.querySelectorAll(".texts");
  oldLines.forEach((item) => {
    mapSvg.removeChild(item);
  });
  oldTexts.forEach((item) => {
    mapSvg.removeChild(item);
  });

  connections.forEach((element) => {
    const a = data[element.fromId];
    const b = data[element.toId];

    const x1 = a.xSvg;
    const y1 = a.ySvg;
    const x2 = b.xSvg;
    const y2 = b.ySvg;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    console.log(angle);
    if (angle > 90) {
      angle += 180;
    }

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", element.mode.color);
    line.setAttribute("stroke-width", 1);
    line.setAttribute("class", "lines");
    mapSvg.appendChild(line);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("id", element.id);
    text.setAttribute("class", "texts");
    text.setAttribute("x", midX);
    text.setAttribute("y", midY - 5);
    text.setAttribute("fill", element.mode.color);
    text.setAttribute("font-size", "10");
    text.setAttribute("text-anchor", "midle");
    text.textContent = element.distance + "km";
    text.setAttribute("transform", `rotate(${angle}, ${midX}, ${midY})`);
    mapSvg.appendChild(text);
  });
}

function removeLine(id) {
  // const text = document.getElementById(id)
  //     if (text) {
  //         mapSvg.removeChild(text)
  //     }
  const connections = JSON.parse(localStorage.getItem("connections")) || [];
  const newData = connections.filter(
    (item) => item.fromId != id && item.toId != id,
  );
  localStorage.setItem("connections", JSON.stringify(newData));
  renderLines();
}
