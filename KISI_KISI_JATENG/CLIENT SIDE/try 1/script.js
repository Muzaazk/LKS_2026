const MODES = {
  train: { color: "#17861a", speed: 120, costPerKm: 500, label: "Train" },
  bus: { color: "#A83BE8", speed: 80, costPerKm: 100, label: "Bus" },
  airplane: {
    color: "#000000",
    speed: 800,
    costPerKm: 1000,
    label: "Airplane",
  },
};

/** Same as map SVG user space (must match #lines viewBox). */
const VB_W = 792.54596;
const VB_H = 316.66394;

const STORAGE_PINS = "pinpoints";
const STORAGE_CONN = "mapConnections";

const container = document.getElementById("map-container");
const wrapper = document.getElementById("map-wrapper");
const mapSvg = document.getElementById("map");
const linesSvg = document.getElementById("lines");
const pinsContainer = document.getElementById("pins");
const pinPopup = document.getElementById("pin-popup");
const pinNameInput = document.getElementById("pin-name");
const addPinBtn = document.getElementById("add-pin-btn");

const routeFrom = document.getElementById("route-from");
const routeTo = document.getElementById("route-to");
const routeSort = document.getElementById("route-sort");
const routeSearch = document.getElementById("route-search");
const routeResults = document.getElementById("route-results");

const connectModal = document.getElementById("connect-modal");
const connectDistance = document.getElementById("connect-distance");
const connectMode = document.getElementById("connect-mode");
const connectSubmit = document.getElementById("connect-submit");
const connectCancel = document.getElementById("connect-cancel");

let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

let pinpoints = [];
let connections = [];
let pendingPinCoords = { x: 0, y: 0 };
let connectSourceId = null;
let connectTargetId = null;

let selectedConnectionId = null;
let lastMouseClient = { x: 0, y: 0 };

function loadState() {
  try {
    pinpoints = JSON.parse(localStorage.getItem(STORAGE_PINS)) || [];
  } catch {
    pinpoints = [];
  }
  try {
    connections = JSON.parse(localStorage.getItem(STORAGE_CONN)) || [];
  } catch {
    connections = [];
  }
}

function savePins() {
  localStorage.setItem(STORAGE_PINS, JSON.stringify(pinpoints));
}

function saveConnections() {
  localStorage.setItem(STORAGE_CONN, JSON.stringify(connections));
}

/** xMidYMid slice: valid for #map and #lines (same client size). */
function getSliceParams(el) {
  const vbw = el.viewBox.baseVal.width || VB_W;
  const vbh = el.viewBox.baseVal.height || VB_H;
  const ew = el.clientWidth || 1;
  const eh = el.clientHeight || 1;
  const s = Math.max(ew / vbw, eh / vbh);
  const tx = (ew - vbw * s) / 2;
  const ty = (eh - vbh * s) / 2;
  return { s, tx, ty, vbw, vbh, ew, eh };
}

/** SVG user (map) coords → local px inside element (0…clientWidth), for overlay pins. */
function userToOverlayPx(ux, uy) {
  const { s, tx, ty } = getSliceParams(mapSvg);
  return { x: tx + ux * s, y: ty + uy * s };
}

/** Inverse: local px inside SVG viewport → user coords. */
function overlayPxToUser(mx, my) {
  const { s, tx, ty } = getSliceParams(mapSvg);
  return { x: (mx - tx) / s, y: (my - ty) / s };
}

/**
 * Screen click → map user coords.
 * Uses bbox ratio so it stays correct with CSS transform on #map-wrapper.
 */
function clientToMapCoords(clientX, clientY) {
  const r = mapSvg.getBoundingClientRect();
  if (!r.width || !r.height) return { x: 0, y: 0 };
  const mx = (clientX - r.left) * (mapSvg.clientWidth / r.width);
  const my = (clientY - r.top) * (mapSvg.clientHeight / r.height);
  return overlayPxToUser(mx, my);
}

function updateTransform() {
  wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function applyZoomAt(delta, clientX, clientY) {
  const zoomIntensity = 0.1;
  const cr = container.getBoundingClientRect();
  const originX = clientX - cr.left;
  const originY = clientY - cr.top;

  const factor = delta > 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
  let newScale = scale * factor;
  if (newScale < 0.25) newScale = 0.25;
  if (newScale > 8) newScale = 8;

  const scaleRatio = newScale / scale;
  translateX = originX - (originX - translateX) * scaleRatio;
  translateY = originY - (originY - translateY) * scaleRatio;
  scale = newScale;
  updateTransform();
}

mapSvg.setAttribute("viewBox", `0 0 ${VB_W} ${VB_H}`);
mapSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");
linesSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");

container.addEventListener(
  "wheel",
  (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    applyZoomAt(e.deltaY < 0 ? 1 : -1, e.clientX, e.clientY);
  },
  { passive: false },
);

document.addEventListener("keydown", (e) => {
  if (!e.ctrlKey) return;
  if (e.key === "+" || e.key === "=") {
    e.preventDefault();
    applyZoomAt(1, lastMouseClient.x, lastMouseClient.y);
  } else if (e.key === "-" || e.key === "_") {
    e.preventDefault();
    applyZoomAt(-1, lastMouseClient.x, lastMouseClient.y);
  }
});

function shouldIgnoreDragStart(el) {
  if (!el || el === container) return false;
  if (el.closest("#pin-popup")) return true;
  if (el.closest(".pin-marker")) return true;
  if (el.closest(".modal")) return true;
  if (el.closest("#find-route-panel")) return true;
  if (el.closest("#lines")) return true;
  if (
    el.tagName === "BUTTON" ||
    el.tagName === "INPUT" ||
    el.tagName === "SELECT"
  )
    return true;
  return false;
}

container.addEventListener("mousedown", (e) => {
  if (shouldIgnoreDragStart(e.target)) return;
  if (e.button !== 0) return;
  isDragging = true;
  container.style.cursor = "grabbing";
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

container.addEventListener("mousemove", (e) => {
  lastMouseClient.x = e.clientX;
  lastMouseClient.y = e.clientY;
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateTransform();
});

function closeConnectModal() {
  connectModal.style.display = "none";
  connectSourceId = null;
  connectTargetId = null;
  document.querySelectorAll(".pin-marker.connecting").forEach((el) => {
    el.classList.remove("connecting");
  });
}

function endDrag() {
  isDragging = false;
  container.style.cursor = "";
}

document.addEventListener("mouseup", endDrag);

let touchDragId = null;

container.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    if (shouldIgnoreDragStart(e.target)) return;
    touchDragId = t.identifier;
    isDragging = true;
    startX = t.clientX - translateX;
    startY = t.clientY - translateY;
  },
  { passive: true },
);

container.addEventListener(
  "touchmove",
  (e) => {
    if (!isDragging || touchDragId === null) return;
    const t = [...e.touches].find((x) => x.identifier === touchDragId);
    if (!t) return;
    e.preventDefault();
    translateX = t.clientX - startX;
    translateY = t.clientY - startY;
    updateTransform();
  },
  { passive: false },
);

function endTouchDrag(e) {
  if (touchDragId === null) return;
  const still = [...e.touches].some((x) => x.identifier === touchDragId);
  if (!still || e.touches.length === 0) {
    touchDragId = null;
    endDrag();
  }
}

container.addEventListener("touchend", endTouchDrag);
container.addEventListener("touchcancel", endTouchDrag);

wrapper.addEventListener("dblclick", (e) => {
  if (e.target.closest(".pin-marker") || e.target.closest("#pin-popup")) return;
  const { x, y } = clientToMapCoords(e.clientX, e.clientY);
  pendingPinCoords = { x, y };
  pinPopup.style.left = e.clientX + "px";
  pinPopup.style.top = e.clientY + "px";
  pinPopup.style.display = "block";
  pinNameInput.value = "";
  pinNameInput.focus();
});

function addPinFromForm() {
  const name = pinNameInput.value.trim();
  if (!name) return;
  if (pinpoints.some((p) => p.name === name)) {
    alert("Nama lokasi sudah dipakai. Gunakan nama unik.");
    return;
  }
  const id = Date.now() + Math.random().toString(36).slice(2);
  pinpoints.push({
    id,
    name,
    x: pendingPinCoords.x,
    y: pendingPinCoords.y,
  });
  savePins();
  renderPins();
  pinPopup.style.display = "none";
  validateRouteInputs();
}

addPinBtn.addEventListener("click", addPinFromForm);
pinNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addPinFromForm();
  }
});

function deletePin(id) {
  pinpoints = pinpoints.filter((p) => p.id !== id);
  connections = connections.filter((c) => c.fromId !== id && c.toId !== id);
  savePins();
  saveConnections();
  renderPins();
  renderLines();
  validateRouteInputs();
  if (
    selectedConnectionId &&
    !connections.find((c) => c.id === selectedConnectionId)
  ) {
    selectedConnectionId = null;
  }
}

function startConnectFrom(id) {
  if (connectSourceId === id) {
    connectSourceId = null;
    document
      .querySelectorAll(".pin-marker.connecting")
      .forEach((el) => el.classList.remove("connecting"));
    return;
  }
  connectSourceId = id;
  connectTargetId = null;
  document
    .querySelectorAll(".pin-marker.connecting")
    .forEach((el) => el.classList.remove("connecting"));
  const el = pinsContainer.querySelector(`[data-pin-id="${id}"]`);
  if (el) el.classList.add("connecting");
}

function openConnectModal(fromId, toId) {
  connectSourceId = fromId;
  connectTargetId = toId;
  document
    .querySelectorAll(".pin-marker.connecting")
    .forEach((el) => el.classList.remove("connecting"));
  connectDistance.value = "";
  connectMode.value = "train";
  connectModal.style.display = "flex";
  connectDistance.focus();
}

wrapper.addEventListener("click", (e) => {
  const marker = e.target.closest(".pin-marker");
  if (!marker || !connectSourceId) return;
  const targetId = marker.dataset.pinId;
  if (targetId === connectSourceId) return;
  openConnectModal(connectSourceId, targetId);
});

connectCancel.addEventListener("click", closeConnectModal);
connectModal
  .querySelector(".modal__backdrop")
  .addEventListener("click", closeConnectModal);

connectSubmit.addEventListener("click", () => {
  const km = parseFloat(connectDistance.value, 10);
  if (!(km > 0) || !connectSourceId || !connectTargetId) return;
  const mode = connectMode.value;
  const id = "c" + Date.now() + Math.random().toString(36).slice(2);
  connections.push({
    id,
    fromId: connectSourceId,
    toId: connectTargetId,
    mode,
    distanceKm: km,
  });
  saveConnections();
  renderLines();
  closeConnectModal();
});

function offsetForConnection(conn) {
  const same = connections.filter(
    (c) =>
      (c.fromId === conn.fromId && c.toId === conn.toId) ||
      (c.fromId === conn.toId && c.toId === conn.fromId),
  );
  same.sort((x, y) => x.id.localeCompare(y.id));
  const idx = same.findIndex((c) => c.id === conn.id);
  const n = same.length;
  const mid = (n - 1) / 2;
  return (idx - mid) * 14;
}

function renderLines() {
  linesSvg.innerHTML = "";
  const pinMap = Object.fromEntries(pinpoints.map((p) => [p.id, p]));

  connections.forEach((c) => {
    const a = pinMap[c.fromId];
    const b = pinMap[c.toId];
    if (!a || !b) return;
    const spec = MODES[c.mode] || MODES.train;

    let x1 = a.x;
    let y1 = a.y;
    let x2 = b.x;
    let y2 = b.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ox = (-dy / len) * offsetForConnection(c);
    const oy = (dx / len) * offsetForConnection(c);
    x1 += ox;
    y1 += oy;
    x2 += ox;
    y2 += oy;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", spec.color);
    line.setAttribute("stroke-width", selectedConnectionId === c.id ? 3 : 2);
    line.setAttribute("data-conn-id", c.id);
    line.style.cursor = "pointer";
    line.style.pointerEvents = "stroke";

    line.addEventListener("click", (ev) => {
      ev.stopPropagation();
      selectedConnectionId = c.id;
      renderLines();
    });

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    const adx = x2 - x1;
    const ady = y2 - y1;
    let angle = Math.atan2(ady, adx) * (180 / Math.PI);
    if (angle > 90 || angle < -90) {
      angle += 180;
    }
    console.log(angle);

    text.setAttribute("x", mx);
    text.setAttribute("y", my - 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", spec.color);
    text.setAttribute("font-size", "11");
    text.setAttribute("font-weight", "600");
    text.setAttribute("pointer-events", "none");
    text.textContent = `${c.distanceKm} km`;
    text.setAttribute("transform", `rotate(${angle}, ${mx}, ${my})`);

    linesSvg.appendChild(line);
    linesSvg.appendChild(text);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Delete" && e.key !== "Backspace") return;
  const t = e.target;
  if (
    t &&
    (t.tagName === "INPUT" ||
      t.tagName === "TEXTAREA" ||
      t.tagName === "SELECT")
  )
    return;
  if (!selectedConnectionId) return;
  e.preventDefault();
  connections = connections.filter((c) => c.id !== selectedConnectionId);
  selectedConnectionId = null;
  saveConnections();
  renderLines();
});

function renderPins() {
  pinsContainer.querySelectorAll(".pin-marker").forEach((n) => n.remove());

  pinpoints.forEach((pin) => {
    const wrap = document.createElement("div");
    wrap.className = "pin-marker";
    wrap.dataset.pinId = pin.id;
    const pos = userToOverlayPx(pin.x, pin.y);
    wrap.style.left = `${pos.x}px`;
    wrap.style.top = `${pos.y}px`;

    const icon = document.createElement("span");
    icon.className = "pin-icon";
    icon.textContent = "▼";
    icon.style.color = "red";
    icon.setAttribute("aria-hidden", "true");
    // 📍↧⇓⇩▼⋁
    const label = document.createElement("div");
    label.className = "pin-label";
    const nameEl = document.createElement("span");
    nameEl.className = "pin-label__name";
    nameEl.textContent = pin.name;

    const actions = document.createElement("div");
    actions.className = "pin-actions";

    const btnConnect = document.createElement("button");
    btnConnect.type = "button";
    btnConnect.className = "pin-btn pin-btn-connect";
    btnConnect.title = "Connect";
    btnConnect.innerHTML = "⎘";
    btnConnect.addEventListener("click", (ev) => {
      ev.stopPropagation();
      startConnectFrom(pin.id);
    });

    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "pin-btn pin-btn-delete";
    btnDel.title = "Delete";
    btnDel.textContent = "🗑";
    btnDel.addEventListener("click", (ev) => {
      ev.stopPropagation();
      deletePin(pin.id);
    });

    actions.append(btnConnect, btnDel);
    label.append(nameEl, actions);
    wrap.append(label, icon);

    wrap.addEventListener("mousedown", (ev) => ev.stopPropagation());

    pinsContainer.appendChild(wrap);
  });

  pinsContainer.appendChild(pinPopup);
}

function pinByName(name) {
  return pinpoints.find((p) => p.name === name);
}

function validateRouteInputs() {
  const from = routeFrom.value.trim();
  const to = routeTo.value.trim();
  const ok = from && to && pinByName(from) && pinByName(to) && from !== to;
  routeSearch.disabled = !ok;
}

routeFrom.addEventListener("input", validateRouteInputs);
routeTo.addEventListener("input", validateRouteInputs);

function edgeDurationHours(c) {
  const spec = MODES[c.mode];
  return c.distanceKm / spec.speed;
}

function edgeCost(c) {
  const spec = MODES[c.mode];
  return c.distanceKm * spec.costPerKm;
}

function buildAdjacency() {
  const adj = {};
  pinpoints.forEach((p) => {
    adj[p.id] = [];
  });
  connections.forEach((c) => {
    if (!adj[c.fromId] || !adj[c.toId]) return;
    adj[c.fromId].push(c);
    adj[c.toId].push(c);
  });
  return adj;
}

function findRoutes(fromName, toName, sortBy) {
  const fromP = pinByName(fromName);
  const toP = pinByName(toName);
  if (!fromP || !toP) return [];

  const adj = buildAdjacency();
  const results = [];

  function dfs(nodeId, targetId, visited, pathEdges) {
    if (results.length >= 200) return;
    if (pathEdges.length > 30) return;
    if (nodeId === targetId) {
      results.push({ edges: pathEdges.slice() });
      return;
    }
    for (const edge of adj[nodeId] || []) {
      const next = edge.fromId === nodeId ? edge.toId : edge.fromId;
      if (visited.has(next)) continue;
      visited.add(next);
      pathEdges.push(edge);
      dfs(next, targetId, visited, pathEdges);
      pathEdges.pop();
      visited.delete(next);
    }
  }

  dfs(fromP.id, toP.id, new Set([fromP.id]), []);

  const scored = results.map((r) => {
    const duration = r.edges.reduce((s, e) => s + edgeDurationHours(e), 0);
    const cost = r.edges.reduce((s, e) => s + edgeCost(e), 0);
    const names = [fromP.name];
    let cur = fromP.id;
    for (const e of r.edges) {
      const nxt = e.fromId === cur ? e.toId : e.fromId;
      const np = pinpoints.find((p) => p.id === nxt);
      if (np) names.push(np.name);
      cur = nxt;
    }
    const steps = r.edges.map((e) => {
      const spec = MODES[e.mode];
      const a = pinpoints.find((p) => p.id === e.fromId);
      const b = pinpoints.find((p) => p.id === e.toId);
      return `${spec.label} ${e.distanceKm} km (${a.name} ↔ ${b.name})`;
    });
    return {
      title: names.join(" → "),
      steps,
      duration,
      cost,
      durationLabel: formatDuration(duration),
      costLabel: formatRupiah(cost),
    };
  });

  scored.sort((a, b) => {
    if (sortBy === "cost") return a.cost - b.cost || a.duration - b.duration;
    return a.duration - b.duration || a.cost - b.cost;
  });

  return scored.slice(0, 10);
}

function formatDuration(hours) {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h} h ${m} min`;
}

function formatRupiah(n) {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

routeSearch.addEventListener("click", () => {
  const sortBy = routeSort.value;
  const routes = findRoutes(
    routeFrom.value.trim(),
    routeTo.value.trim(),
    sortBy,
  );
  routeResults.innerHTML = "";
  if (!routes.length) {
    routeResults.innerHTML = '<p class="route-empty">No route found.</p>';
    return;
  }
  routes.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "route-card";
    card.innerHTML = `
      <h4>Route ${i + 1}</h4>
      <p class="route-card__name">${escapeHtml(r.title)}</p>
      <ul>${r.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      <p><strong>Duration:</strong> ${escapeHtml(r.durationLabel)}</p>
      <p><strong>Total cost:</strong> ${escapeHtml(r.costLabel)}</p>
    `;
    routeResults.appendChild(card);
  });
});

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

loadState();
renderPins();
renderLines();
validateRouteInputs();

window.addEventListener("resize", () => {
  renderPins();
});

const pulau = document.querySelectorAll("path");
pulau.forEach((item) => {
  item.addEventListener("mouseenter", function () {
    item.setAttribute("class", "pulau-hover");
  });

  item.addEventListener("mouseleave", function () {
    item.removeAttribute("class");
  });
});
