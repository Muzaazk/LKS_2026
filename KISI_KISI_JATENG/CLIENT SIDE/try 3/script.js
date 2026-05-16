const mapSvg = document.getElementById("map");
const addPintpoint = document.querySelector(".add-pinpoint");
const inputLocation = document.getElementById("inputLocation");
const closeBtnAddPinpoint = document.querySelector(".close-btn-add-pinpoint");
const content = document.querySelector(".wrap-content");
const connectPopup = document.querySelector(".wrap-connect-popup");
const closeBtnConnectPopup = document.querySelector(".close-btn-connect-popup");
const btnSubmit = document.getElementById("btnSubmit");
const inputDistance = document.getElementById("distance");
const inputMode = document.getElementById("mode");

const selectMode = [
  {
    label: "Train",
    speed: 120,
    cost: 500,
    lineColor: "#33E339",
  },
  {
    label: "Bus",
    speed: 80,
    cost: 100,
    lineColor: "#A83BE8",
  },
  {
    label: "Airplane",
    speed: 800,
    cost: 1000,
    lineColor: "#000000",
  },
];

let info = {
  location: "",
  x: 0,
  y: 0,
  svgX: 0,
  svgY: 0,
};

let distance = 0;
let mode = null;
let pin1 = null;
let pin2 = null;
let pinData = [];

btnSubmit.disabled = true;
btnSubmit.style.cursor = "not-allowed";
renderPins();
renderLines();

mapSvg.addEventListener("dblclick", (e) => {
  addPintpoint.style.display = "block";
  const x = e.clientX - addPintpoint.clientWidth / 2;
  const y = e.clientY - addPintpoint.clientHeight;
  addPintpoint.style.left = x + "px";
  addPintpoint.style.top = y + "px";
  info.x = e.clientX;
  info.y = e.clientY;

  const svgPt = screenToSVG(e.clientX, e.clientY);
  info.svgX = svgPt.x;
  info.svgY = svgPt.y;
});

function screenToSVG(screenX, screenY) {
  const svgPoint = mapSvg.createSVGPoint();
  svgPoint.x = screenX;
  svgPoint.y = screenY;
  const matrix = mapSvg.getScreenCTM();
  if (matrix) {
    return { x: 0, y: 0 };
  }
  return svgPoint.matrixTransform(matrix.inverse());
}

// function screenToSVG(screenX, screenY) {
//   const svgPoint = mapSvg.createSVGPoint();
//   svgPoint.x = screenX;
//   svgPoint.y = screenY;
//   const matrix = mapSvg.getScreenCTM();
//   if (!matrix) {
//     return { x: 0, y: 0 };
//   }
//   return svgPoint.matrixTransform(matrix.inverse());
// }

inputLocation.addEventListener("input", (e) => {
  info.location = e.target.value;
});

closeBtnAddPinpoint.addEventListener("click", () => {
  addPintpoint.style.display = "none";
});

inputLocation.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && info.location != "") {
    const dataNew = {
      id: Date.now() + Math.random(999),
      location: info.location,
      x: info.x,
      y: info.y,
      svgX: info.svgX,
      svgY: info.svgY,
    };
    const data = JSON.parse(localStorage.getItem("pinpoints")) || [];
    data.push(dataNew);
    localStorage.setItem("pinpoints", JSON.stringify(data));
    addPintpoint.style.display = "none";
    info.location = "";
    inputLocation.value = "";
    renderPins();
  }
});

function renderPins() {
  const el = document.querySelectorAll(".wrap-pin") || [];
  el.forEach((item) => {
    content.removeChild(item);
  });
  const pinpoints = JSON.parse(localStorage.getItem("pinpoints")) || [];
  pinpoints.map((pin) => {
    const div = document.createElement("div");
    div.setAttribute("class", "wrap-pin");

    const header = document.createElement("div");
    header.setAttribute("class", "header-pin");

    const location = document.createElement("p");
    location.textContent = pin.location;
    location.setAttribute("class", "location-pin");

    const connectBtn = document.createElement("p");
    connectBtn.textContent = "⇄";
    connectBtn.setAttribute("class", "connectBtn-pin");
    connectBtn.addEventListener("click", () => {
      if (!pin1) {
        pin1 = pin;
        header.style.boxShadow = "0px 0px 10px blue";
      } else if (pin1) {
        pin2 = pin;
        connectPopup.style.display = "grid";
      }
    });

    const deleteBtn = document.createElement("p");
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("class", "deleteBtn-pin");
    deleteBtn.addEventListener("click", () => {
      const data = pinpoints.filter((item) => item.id != pin.id);
      localStorage.setItem("pinpoints", JSON.stringify(data));
      removeConnectionsByPin(pin.id);
      renderPins();
      renderLines();
    });

    const pinIcon = document.createElement("p");
    pinIcon.textContent = "▼";

    header.appendChild(location);
    header.appendChild(connectBtn);
    header.appendChild(deleteBtn);
    div.appendChild(header);
    div.appendChild(pinIcon);
    content.appendChild(div);

    const xNew = pin.x - div.clientWidth / 2;
    const yNew = pin.y - div.clientHeight;

    div.style.left = xNew + "px";
    div.style.top = yNew + "px";
  });
}

closeBtnConnectPopup.addEventListener("click", () => {
  connectPopup.style.display = "none";
  pin1 = null;
  pin2 = null;
  renderPins();
});

inputDistance.addEventListener("input", (e) => {
  distance = e.target.value;
  checkSubmitBtn();
});

inputMode.addEventListener("input", (e) => {
  mode = selectMode[e.target.value];
  checkSubmitBtn();
});

function checkSubmitBtn() {
  if (distance && mode) {
    btnSubmit.disabled = false;
    btnSubmit.style.cursor = "pointer";
  }
}

btnSubmit.addEventListener("click", () => {
  const newData = {
    id: Date.now() + Math.random(999),
    fromId: pin1.id,
    toId: pin2.id,
    mode: mode,
    distance: distance,
  };

  const data = JSON.parse(localStorage.getItem("connections")) || [];
  data.push(newData);

  localStorage.setItem("connections", JSON.stringify(data));
  connectPopup.style.display = "none";
  pin1 = null;
  pin2 = null;
  inputDistance.value = "";
  renderPins();
  renderLines();
});

function renderLines() {
  const oldLine = document.querySelectorAll(".line") || [];
  oldLine.forEach((item) => {
    mapSvg.removeChild(item);
  });
  const pinpoints = JSON.parse(localStorage.getItem("pinpoints")) || [];
  const connections = JSON.parse(localStorage.getItem("connections")) || [];
  const pinMap = Object.fromEntries(pinpoints.map((item) => [item.id, item]));

  if (connections.length == 0) return;
  connections.forEach((item) => {
    const a = pinMap[item.fromId];
    const b = pinMap[item.toId];
    if (!a || !b) return;

    const pa =
      a.svgX !== undefined ? { x: a.svgX, y: a.svgY } : screenToSVG(a.x, a.y);
    const pb =
      b.svgX !== undefined ? { x: b.svgX, y: b.svgY } : screenToSVG(b.x, b.y);

    const x1 = pa.x;
    const y1 = pa.y;
    const x2 = pb.x;
    const y2 = pb.y;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", midX);
    text.setAttribute("y", midY - 5);
    text.setAttribute("fill", item.mode.lineColor);
    text.setAttribute("font-size", "10");
    text.setAttribute("text-anchor", "midle");
    text.setAttribute("class", "textLine");
    text.textContent = item.distance + "km";
    text.setAttribute("transform", `rotate(${angle}, ${midX}, ${midY})`);
    mapSvg.appendChild(text);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", item.mode.lineColor);
    line.setAttribute("stroke-width", "1");
    mapSvg.appendChild(line);
  });
}

function removeConnectionsByPin(pinId) {
  const connections = JSON.parse(localStorage.getItem("connections")) || [];
  const filtered = connections.filter(
    (conn) => conn.fromId !== pinId && conn.toId !== pinId,
  );
  localStorage.setItem("connections", JSON.stringify(filtered));
}
