// ===== Data =====
var MAJOR_CITIES = [
  {
    id: "jakarta",
    name: "Jakarta",
    x: 340,
    y: 345,
    description: "Ibukota Indonesia, pusat pemerintahan dan bisnis",
    province: "Jawa",
  },
  {
    id: "surabaya",
    name: "Surabaya",
    x: 500,
    y: 340,
    description: "Kota terbesar kedua di Indonesia, pusat industri Jawa Timur",
    province: "Jawa",
  },
  {
    id: "medan",
    name: "Medan",
    x: 155,
    y: 105,
    description: "Kota terbesar di Sumatera, gerbang ke Danau Toba",
    province: "Sumatera",
  },
  {
    id: "makassar",
    name: "Makassar",
    x: 610,
    y: 265,
    description: "Kota terbesar di Sulawesi, pusat perdagangan Indonesia Timur",
    province: "Sulawesi",
  },
  {
    id: "denpasar",
    name: "Denpasar",
    x: 584,
    y: 350,
    description: "Ibukota Bali, pusat pariwisata dunia",
    province: "Bali",
  },
  {
    id: "balikpapan",
    name: "Balikpapan",
    x: 490,
    y: 230,
    description: "Kota industri minyak di Kalimantan Timur",
    province: "Kalimantan",
  },
  {
    id: "jayapura",
    name: "Jayapura",
    x: 1010,
    y: 175,
    description: "Ibukota Provinsi Papua, kota perbatasan",
    province: "Papua",
  },
  {
    id: "ambon",
    name: "Ambon",
    x: 750,
    y: 215,
    description: "Ibukota Maluku, kota rempah-rempah bersejarah",
    province: "Maluku",
  },
  {
    id: "padang",
    name: "Padang",
    x: 165,
    y: 235,
    description: "Ibukota Sumatera Barat, terkenal dengan kuliner Padang",
    province: "Sumatera",
  },
  {
    id: "pontianak",
    name: "Pontianak",
    x: 400,
    y: 170,
    description: "Kota di khatulistiwa, ibukota Kalimantan Barat",
    province: "Kalimantan",
  },
  {
    id: "manado",
    name: "Manado",
    x: 660,
    y: 130,
    description:
      "Kota di ujung utara Sulawesi, terkenal dengan taman laut Bunaken",
    province: "Sulawesi",
  },
  {
    id: "kupang",
    name: "Kupang",
    x: 700,
    y: 368,
    description: "Ibukota Nusa Tenggara Timur",
    province: "Nusa Tenggara",
  },
];

var PROVINCE_CENTERS = [
  { name: "Sumatera", x: 185, y: 220 },
  { name: "Jawa", x: 435, y: 345 },
  { name: "Kalimantan", x: 462, y: 185 },
  { name: "Sulawesi", x: 630, y: 195 },
  { name: "Bali", x: 584, y: 350 },
  { name: "Nusa Tenggara", x: 668, y: 358 },
  { name: "Maluku", x: 750, y: 200 },
  { name: "Papua", x: 935, y: 195 },
];

// ===== State =====
var locations = [];
var routes = [];
var mode = "normal";
var connectStart = null;
var selectedLocation = null;
var showLabels = true;
var nextId = 100;
var tempAddPos = null;

// Pan & Zoom state
var viewBox = { x: -20, y: -20, w: 1240, h: 640 };
var isPanning = false;
var wasPanning = false;
var panStart = { x: 0, y: 0 };
var panViewBoxStart = { x: 0, y: 0 };
var zoomLevel = 1;
var minZoom = 0.3;
var maxZoom = 5;
var lastTouchDist = 0;

// ===== Category Config =====
var CATEGORIES = {
  city: { icon: "fas fa-city", label: "Kota", color: "#3b82f6" },
  tourism: { icon: "fas fa-umbrella-beach", label: "Wisata", color: "#f59e0b" },
  nature: { icon: "fas fa-tree", label: "Alam", color: "#10b981" },
  historical: { icon: "fas fa-landmark", label: "Sejarah", color: "#a855f7" },
  custom: { icon: "fas fa-map-marker-alt", label: "Lainnya", color: "#94a3b8" },
};

// ===== DOM =====
var svg, mapContainer, sidebar, statusBar, statusText;
var locationList, routeList, routeStart, routeEnd, searchInput, coordsText;
var routesGroup, markersGroup, labelsGroup, seaLabelsGroup;
var miniViewport, toastContainer;

document.addEventListener("DOMContentLoaded", function () {
  svg = document.getElementById("map-svg");
  mapContainer = document.getElementById("map-container");
  sidebar = document.getElementById("sidebar");
  statusBar = document.getElementById("status-bar");
  statusText = document.getElementById("status-text");
  locationList = document.getElementById("location-list");
  routeList = document.getElementById("route-list");
  routeStart = document.getElementById("route-start");
  routeEnd = document.getElementById("route-end");
  searchInput = document.getElementById("search-location");
  coordsText = document.getElementById("coords-text");
  routesGroup = document.getElementById("routes-group");
  markersGroup = document.getElementById("markers-group");
  labelsGroup = document.getElementById("labels-group");
  seaLabelsGroup = document.getElementById("sea-labels-group");
  miniViewport = document.getElementById("mini-viewport");
  toastContainer = document.getElementById("toast-container");

  // Init cities
  MAJOR_CITIES.forEach(function (city) {
    locations.push({
      id: city.id,
      name: city.name,
      x: city.x,
      y: city.y,
      description: city.description,
      province: city.province,
      category: "city",
      isDefault: true,
    });
  });

  renderMarkers();
  updateLocationList();
  updateRouteSelects();
  updateViewBox();
  bindEvents();

  showToast(
    "Selamat datang! Peta Interaktif Indonesia siap digunakan.",
    "success",
  );
});

// ===== Events =====
function bindEvents() {
  document
    .getElementById("btn-toggle-sidebar")
    .addEventListener("click", function () {
      sidebar.classList.toggle("closed");
      sidebar.classList.toggle("open");
    });

  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      document.querySelectorAll(".tab-content").forEach(function (c) {
        c.classList.remove("active");
      });
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    });
  });

  document
    .getElementById("btn-reset-view")
    .addEventListener("click", resetView);

  document
    .getElementById("btn-toggle-labels")
    .addEventListener("click", function (e) {
      showLabels = !showLabels;
      e.currentTarget.classList.toggle("active", showLabels);
      labelsGroup.style.display = showLabels ? "" : "none";
      seaLabelsGroup.style.display = showLabels ? "" : "none";
    });

  document
    .getElementById("btn-add-mode")
    .addEventListener("click", function () {
      setMode("add");
    });
  document
    .getElementById("btn-connect-mode")
    .addEventListener("click", function () {
      setMode("connect");
    });
  document
    .getElementById("btn-cancel-mode")
    .addEventListener("click", function () {
      setMode("normal");
    });
  document
    .getElementById("btn-find-route")
    .addEventListener("click", findRoute);

  document
    .getElementById("btn-clear-routes")
    .addEventListener("click", function () {
      routes = [];
      renderRoutes();
      updateRouteList();
      showToast("Semua rute telah dihapus", "info");
    });

  searchInput.addEventListener("input", function () {
    updateLocationList(searchInput.value);
  });

  document.getElementById("btn-zoom-in").addEventListener("click", function () {
    zoomMap(0.8);
  });
  document
    .getElementById("btn-zoom-out")
    .addEventListener("click", function () {
      zoomMap(1.25);
    });

  // Map mouse events
  mapContainer.addEventListener("wheel", handleWheel, { passive: false });
  mapContainer.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  mapContainer.addEventListener("click", handleMapClick);
  mapContainer.addEventListener("mousemove", handleMapHover);

  // Touch
  mapContainer.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  mapContainer.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  mapContainer.addEventListener("touchend", function () {
    isPanning = false;
  });

  // Modals
  document.querySelectorAll(".modal-close").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.closest(".modal").classList.add("hidden");
    });
  });
  document.querySelectorAll(".modal-overlay").forEach(function (ov) {
    ov.addEventListener("click", function () {
      ov.closest(".modal").classList.add("hidden");
    });
  });

  document
    .getElementById("btn-save-location")
    .addEventListener("click", saveNewLocation);

  document
    .getElementById("btn-edit-location")
    .addEventListener("click", function () {
      if (!selectedLocation) return;
      var loc = locations.find(function (l) {
        return l.id === selectedLocation;
      });
      if (!loc) return;
      document.getElementById("edit-name").value = loc.name;
      document.getElementById("edit-desc").value = loc.description || "";
      document.getElementById("edit-category").value = loc.category || "custom";
      document.getElementById("modal-detail").classList.add("hidden");
      document.getElementById("modal-edit").classList.remove("hidden");
    });

  document
    .getElementById("btn-update-location")
    .addEventListener("click", updateLocationFn);
  document
    .getElementById("btn-delete-location")
    .addEventListener("click", deleteLocation);
}

// ===== Mode =====
function setMode(m) {
  mode = m;
  connectStart = null;
  mapContainer.classList.remove("add-mode", "connect-mode");
  statusBar.classList.add("hidden");

  if (m === "add") {
    mapContainer.classList.add("add-mode");
    statusBar.classList.remove("hidden");
    statusText.textContent = "📍 Klik pada peta untuk menambah lokasi baru";
    showToast("Mode tambah lokasi aktif", "info");
  } else if (m === "connect") {
    mapContainer.classList.add("connect-mode");
    statusBar.classList.remove("hidden");
    statusText.textContent = "🔗 Klik lokasi pertama untuk memulai koneksi";
    showToast("Mode hubungkan aktif - klik dua lokasi", "info");
  }
}

// ===== Pan & Zoom =====
function updateViewBox() {
  svg.setAttribute(
    "viewBox",
    viewBox.x + " " + viewBox.y + " " + viewBox.w + " " + viewBox.h,
  );
  miniViewport.setAttribute("x", Math.max(-20, viewBox.x));
  miniViewport.setAttribute("y", Math.max(-20, viewBox.y));
  miniViewport.setAttribute("width", viewBox.w);
  miniViewport.setAttribute("height", viewBox.h);
}

function zoomMap(factor, cx, cy) {
  var newW = viewBox.w * factor;
  var newH = viewBox.h * factor;
  var nz = 1240 / newW;
  if (nz < minZoom || nz > maxZoom) return;

  if (cx === undefined) {
    cx = viewBox.x + viewBox.w / 2;
    cy = viewBox.y + viewBox.h / 2;
  }

  viewBox.x += (cx - viewBox.x) * (1 - factor);
  viewBox.y += (cy - viewBox.y) * (1 - factor);
  viewBox.w = newW;
  viewBox.h = newH;
  zoomLevel = nz;
  updateViewBox();
}

function resetView() {
  viewBox = { x: -20, y: -20, w: 1240, h: 640 };
  zoomLevel = 1;
  updateViewBox();
  showToast("Tampilan peta direset", "info");
}

function getSvgPoint(clientX, clientY) {
  var rect = mapContainer.getBoundingClientRect();
  var sx = ((clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
  var sy = ((clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;
  return { x: sx, y: sy };
}

function handleWheel(e) {
  e.preventDefault();
  var pt = getSvgPoint(e.clientX, e.clientY);
  zoomMap(e.deltaY > 0 ? 1.1 : 0.9, pt.x, pt.y);
}

function handleMouseDown(e) {
  if (e.button !== 0) return;
  if (e.target.closest(".marker-group")) return;
  isPanning = true;
  wasPanning = false;
  panStart = { x: e.clientX, y: e.clientY };
  panViewBoxStart = { x: viewBox.x, y: viewBox.y };
  e.preventDefault();
}

function handleMouseMove(e) {
  if (!isPanning) return;
  var rect = mapContainer.getBoundingClientRect();
  var sx = viewBox.w / rect.width;
  var sy = viewBox.h / rect.height;
  var dx = (e.clientX - panStart.x) * sx;
  var dy = (e.clientY - panStart.y) * sy;
  if (
    Math.abs(e.clientX - panStart.x) > 3 ||
    Math.abs(e.clientY - panStart.y) > 3
  ) {
    wasPanning = true;
  }
  viewBox.x = panViewBoxStart.x - dx;
  viewBox.y = panViewBoxStart.y - dy;
  updateViewBox();
}

function handleMouseUp() {
  isPanning = false;
}

function handleTouchStart(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    lastTouchDist = Math.sqrt(dx * dx + dy * dy);
  } else if (e.touches.length === 1) {
    isPanning = true;
    wasPanning = false;
    panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    panViewBoxStart = { x: viewBox.x, y: viewBox.y };
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    var pt = getSvgPoint(cx, cy);
    zoomMap(lastTouchDist / dist, pt.x, pt.y);
    lastTouchDist = dist;
  } else if (e.touches.length === 1 && isPanning) {
    var rect = mapContainer.getBoundingClientRect();
    var sx = viewBox.w / rect.width;
    var sy = viewBox.h / rect.height;
    var ddx = (e.touches[0].clientX - panStart.x) * sx;
    var ddy = (e.touches[0].clientY - panStart.y) * sy;
    if (
      Math.abs(e.touches[0].clientX - panStart.x) > 3 ||
      Math.abs(e.touches[0].clientY - panStart.y) > 3
    ) {
      wasPanning = true;
    }
    viewBox.x = panViewBoxStart.x - ddx;
    viewBox.y = panViewBoxStart.y - ddy;
    updateViewBox();
  }
}

// ===== Map Click =====
function handleMapClick(e) {
  if (wasPanning) {
    wasPanning = false;
    return;
  }

  var mg = e.target.closest(".marker-group");

  if (mode === "add" && !mg) {
    var pt = getSvgPoint(e.clientX, e.clientY);
    tempAddPos = pt;
    document.getElementById("loc-name").value = "";
    document.getElementById("loc-desc").value = "";
    document.getElementById("loc-category").value = "custom";
    document.getElementById("modal-add").classList.remove("hidden");
    return;
  }

  if (mg) {
    var locId = mg.getAttribute("data-id");
    if (mode === "connect") {
      handleConnectClick(locId);
      return;
    }
    showLocationDetail(locId);
  }
}

function handleMapHover(e) {
  if (isPanning) return;
  var pt = getSvgPoint(e.clientX, e.clientY);
  coordsText.textContent = "X: " + pt.x.toFixed(0) + ", Y: " + pt.y.toFixed(0);
}

// ===== Connect =====
function handleConnectClick(locId) {
  if (!connectStart) {
    connectStart = locId;
    var loc = locations.find(function (l) {
      return l.id === locId;
    });
    statusText.textContent =
      "🔗 Awal: " + (loc ? loc.name : locId) + " — Klik lokasi kedua";
    highlightMarker(locId, true);
  } else {
    if (connectStart === locId) {
      showToast("Tidak bisa menghubungkan ke lokasi yang sama", "warning");
      return;
    }
    var exists = routes.some(function (r) {
      return (
        (r.from === connectStart && r.to === locId) ||
        (r.from === locId && r.to === connectStart)
      );
    });
    if (exists) {
      showToast("Rute ini sudah ada", "warning");
      highlightMarker(connectStart, false);
      connectStart = null;
      statusText.textContent = "🔗 Klik lokasi pertama untuk memulai koneksi";
      return;
    }
    addRoute(connectStart, locId);
    highlightMarker(connectStart, false);
    connectStart = null;
    statusText.textContent = "🔗 Klik lokasi pertama untuk memulai koneksi";
  }
}

// ===== Location CRUD =====
function saveNewLocation() {
  var name = document.getElementById("loc-name").value.trim();
  var desc = document.getElementById("loc-desc").value.trim();
  var category = document.getElementById("loc-category").value;
  if (!name) {
    showToast("Nama lokasi harus diisi", "error");
    return;
  }
  if (!tempAddPos) return;

  var loc = {
    id: "loc_" + nextId++,
    name: name,
    description: desc,
    category: category,
    x: tempAddPos.x,
    y: tempAddPos.y,
    province: getProvinceAtPoint(tempAddPos.x, tempAddPos.y),
    isDefault: false,
  };

  locations.push(loc);
  renderMarkers();
  updateLocationList();
  updateRouteSelects();
  document.getElementById("modal-add").classList.add("hidden");
  showToast('Lokasi "' + name + '" berhasil ditambahkan', "success");
  setMode("normal");
}

function updateLocationFn() {
  var loc = locations.find(function (l) {
    return l.id === selectedLocation;
  });
  if (!loc) return;
  var name = document.getElementById("edit-name").value.trim();
  var desc = document.getElementById("edit-desc").value.trim();
  var category = document.getElementById("edit-category").value;
  if (!name) {
    showToast("Nama lokasi harus diisi", "error");
    return;
  }

  loc.name = name;
  loc.description = desc;
  loc.category = category;
  renderMarkers();
  updateLocationList();
  updateRouteSelects();
  renderRoutes();
  updateRouteList();
  document.getElementById("modal-edit").classList.add("hidden");
  showToast('Lokasi "' + name + '" berhasil diperbarui', "success");
}

function deleteLocation() {
  var loc = locations.find(function (l) {
    return l.id === selectedLocation;
  });
  if (!loc) return;
  routes = routes.filter(function (r) {
    return r.from !== loc.id && r.to !== loc.id;
  });
  locations = locations.filter(function (l) {
    return l.id !== loc.id;
  });
  selectedLocation = null;
  renderMarkers();
  renderRoutes();
  updateLocationList();
  updateRouteSelects();
  updateRouteList();
  document.getElementById("modal-detail").classList.add("hidden");
  showToast('Lokasi "' + loc.name + '" berhasil dihapus', "success");
}

function showLocationDetail(locId) {
  var loc = locations.find(function (l) {
    return l.id === locId;
  });
  if (!loc) return;
  selectedLocation = locId;
  var cat = CATEGORIES[loc.category] || CATEGORIES.custom;

  document.getElementById("detail-title").innerHTML =
    '<i class="' + cat.icon + '"></i> ' + loc.name;
  document.getElementById("detail-body").innerHTML =
    '<div class="detail-field"><span class="label">Kategori</span>' +
    '<span class="detail-category-badge badge-' +
    loc.category +
    '"><i class="' +
    cat.icon +
    '"></i> ' +
    cat.label +
    "</span></div>" +
    '<div class="detail-field"><span class="label">Deskripsi</span><span class="value">' +
    (loc.description || "Tidak ada deskripsi") +
    "</span></div>" +
    '<div class="detail-field"><span class="label">Provinsi / Wilayah</span><span class="value">' +
    (loc.province || "Tidak diketahui") +
    "</span></div>" +
    '<div class="detail-field"><span class="label">Koordinat</span><span class="value" style="font-family:monospace;font-size:12px;">X: ' +
    loc.x.toFixed(1) +
    ", Y: " +
    loc.y.toFixed(1) +
    "</span></div>";

  document.getElementById("modal-detail").classList.remove("hidden");
  centerOnLocation(loc);
}

function centerOnLocation(loc) {
  var tw = Math.min(viewBox.w, 400);
  var th = tw / 2;
  viewBox.x = loc.x - tw / 2;
  viewBox.y = loc.y - th / 2;
  viewBox.w = tw;
  viewBox.h = th;
  zoomLevel = 1240 / tw;
  updateViewBox();
}

// ===== Routes =====
function addRoute(fromId, toId) {
  var fl = locations.find(function (l) {
    return l.id === fromId;
  });
  var tl = locations.find(function (l) {
    return l.id === toId;
  });
  if (!fl || !tl) return;
  var dist = Math.sqrt(
    Math.pow(fl.x - tl.x, 2) + Math.pow(fl.y - tl.y, 2),
  ).toFixed(0);
  routes.push({
    id: "route_" + nextId++,
    from: fromId,
    to: toId,
    distance: dist,
    highlight: false,
  });
  renderRoutes();
  updateRouteList();
  showToast("Rute " + fl.name + " → " + tl.name + " ditambahkan", "success");
}

function findRoute() {
  var sid = routeStart.value;
  var eid = routeEnd.value;
  if (!sid || !eid) {
    showToast("Pilih titik awal dan akhir", "warning");
    return;
  }
  if (sid === eid) {
    showToast("Titik awal dan akhir tidak boleh sama", "warning");
    return;
  }

  var path = bfsPath(sid, eid);
  if (!path) {
    var exists = routes.some(function (r) {
      return (
        (r.from === sid && r.to === eid) || (r.from === eid && r.to === sid)
      );
    });
    if (!exists) addRoute(sid, eid);
    routes.forEach(function (r) {
      r.highlight =
        (r.from === sid && r.to === eid) || (r.from === eid && r.to === sid);
    });
    renderRoutes();
    showToast("Rute langsung dibuat dan ditampilkan", "info");
    return;
  }

  routes.forEach(function (r) {
    r.highlight = false;
  });
  for (var i = 0; i < path.length - 1; i++) {
    var a = path[i],
      b = path[i + 1];
    routes.forEach(function (r) {
      if ((r.from === a && r.to === b) || (r.from === b && r.to === a))
        r.highlight = true;
    });
  }
  renderRoutes();
  var sn = locations.find(function (l) {
    return l.id === sid;
  });
  var en = locations.find(function (l) {
    return l.id === eid;
  });
  showToast(
    "Rute ditemukan: " +
      (sn ? sn.name : "") +
      " → " +
      (en ? en.name : "") +
      " (" +
      (path.length - 1) +
      " langkah)",
    "success",
  );
}

function bfsPath(startId, endId) {
  var adj = {};
  locations.forEach(function (l) {
    adj[l.id] = [];
  });
  routes.forEach(function (r) {
    if (adj[r.from]) adj[r.from].push(r.to);
    if (adj[r.to]) adj[r.to].push(r.from);
  });
  var visited = {};
  var queue = [[startId]];
  visited[startId] = true;
  while (queue.length > 0) {
    var cp = queue.shift();
    var cur = cp[cp.length - 1];
    if (cur === endId) return cp;
    var nb = adj[cur] || [];
    for (var i = 0; i < nb.length; i++) {
      if (!visited[nb[i]]) {
        visited[nb[i]] = true;
        var np = cp.slice();
        np.push(nb[i]);
        queue.push(np);
      }
    }
  }
  return null;
}

// ===== Rendering =====
function renderMarkers() {
  markersGroup.innerHTML = "";
  locations.forEach(function (loc) {
    var cat = CATEGORIES[loc.category] || CATEGORIES.custom;
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "marker-group");
    g.setAttribute("data-id", loc.id);
    g.setAttribute("transform", "translate(" + loc.x + "," + loc.y + ")");

    // Pulse
    var pulse = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    pulse.setAttribute("cx", "0");
    pulse.setAttribute("cy", "0");
    pulse.setAttribute("r", "8");
    pulse.setAttribute("fill", cat.color);
    pulse.setAttribute("class", "marker-pulse");
    pulse.setAttribute("opacity", "0.4");
    g.appendChild(pulse);

    // Pin
    var pin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pin.setAttribute("cx", "0");
    pin.setAttribute("cy", "0");
    pin.setAttribute("r", "5");
    pin.setAttribute("fill", cat.color);
    pin.setAttribute("stroke", "#fff");
    pin.setAttribute("stroke-width", "1.5");
    pin.setAttribute("class", "marker-pin");
    pin.setAttribute("filter", "url(#drop-shadow)");
    g.appendChild(pin);

    // Dot
    var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", "0");
    dot.setAttribute("cy", "0");
    dot.setAttribute("r", "2");
    dot.setAttribute("fill", "#fff");
    g.appendChild(dot);

    // Label bg
    var tw = loc.name.length * 5.5 + 10;
    var lbg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    lbg.setAttribute("x", String(-tw / 2));
    lbg.setAttribute("y", "-22");
    lbg.setAttribute("width", String(tw));
    lbg.setAttribute("height", "14");
    lbg.setAttribute("class", "marker-label-bg");
    g.appendChild(lbg);

    // Label
    var lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    lbl.setAttribute("x", "0");
    lbl.setAttribute("y", "-12");
    lbl.setAttribute("class", "marker-label");
    lbl.textContent = loc.name;
    g.appendChild(lbl);

    markersGroup.appendChild(g);
  });
}

function renderRoutes() {
  routesGroup.innerHTML = "";
  routes.forEach(function (route) {
    var fl = locations.find(function (l) {
      return l.id === route.from;
    });
    var tl = locations.find(function (l) {
      return l.id === route.to;
    });
    if (!fl || !tl) return;

    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(fl.x));
    line.setAttribute("y1", String(fl.y));
    line.setAttribute("x2", String(tl.x));
    line.setAttribute("y2", String(tl.y));
    line.setAttribute(
      "class",
      "route-line" + (route.highlight ? " highlight" : ""),
    );
    line.setAttribute(
      "marker-end",
      route.highlight ? "url(#route-arrow-highlight)" : "url(#route-arrow)",
    );
    line.setAttribute("data-route-id", route.id);

    (function (rid) {
      line.addEventListener("click", function (e) {
        e.stopPropagation();
        routes = routes.filter(function (r) {
          return r.id !== rid;
        });
        renderRoutes();
        updateRouteList();
        showToast("Rute dihapus", "info");
      });
    })(route.id);

    routesGroup.appendChild(line);

    // Distance label
    var mx = (fl.x + tl.x) / 2,
      my = (fl.y + tl.y) / 2;
    var dt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    dt.setAttribute("x", String(mx));
    dt.setAttribute("y", String(my - 6));
    dt.setAttribute("text-anchor", "middle");
    dt.setAttribute("font-size", "8");
    dt.setAttribute("fill", route.highlight ? "#22d3ee" : "#f59e0b");
    dt.setAttribute("font-weight", "600");
    dt.setAttribute("pointer-events", "none");
    dt.textContent = route.distance + " km";
    routesGroup.appendChild(dt);
  });
}

function highlightMarker(locId, hl) {
  var mg = markersGroup.querySelector('[data-id="' + locId + '"]');
  if (!mg) return;
  var pin = mg.querySelector(".marker-pin");
  if (hl) {
    pin.setAttribute("r", "7");
    pin.setAttribute("stroke", "#22d3ee");
    pin.setAttribute("stroke-width", "2.5");
    pin.setAttribute("filter", "url(#glow)");
  } else {
    pin.setAttribute("r", "5");
    pin.setAttribute("stroke", "#fff");
    pin.setAttribute("stroke-width", "1.5");
    pin.setAttribute("filter", "url(#drop-shadow)");
  }
}

// ===== UI Updates =====
function updateLocationList(filter) {
  filter = filter || "";
  var filtered = locations.filter(function (l) {
    return l.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  });

  if (filtered.length === 0) {
    locationList.innerHTML =
      '<div class="empty-state"><i class="fas fa-map-marked-alt"></i><p>' +
      (filter ? "Tidak ada lokasi ditemukan" : "Belum ada lokasi.") +
      "</p></div>";
    return;
  }

  var html = "";
  filtered.forEach(function (loc) {
    var cat = CATEGORIES[loc.category] || CATEGORIES.custom;
    html +=
      '<div class="location-item" data-id="' +
      loc.id +
      '">' +
      '<div class="loc-icon ' +
      loc.category +
      '"><i class="' +
      cat.icon +
      '"></i></div>' +
      '<div class="loc-info"><div class="loc-name">' +
      loc.name +
      "</div>" +
      '<div class="loc-province">' +
      (loc.province || cat.label) +
      "</div></div>" +
      '<div class="loc-actions">' +
      '<button class="btn btn-icon btn-loc-view" title="Lihat"><i class="fas fa-eye"></i></button>' +
      '<button class="btn btn-icon btn-loc-delete" title="Hapus"><i class="fas fa-trash"></i></button>' +
      "</div></div>";
  });
  locationList.innerHTML = html;

  locationList.querySelectorAll(".location-item").forEach(function (item) {
    var lid = item.getAttribute("data-id");
    item.addEventListener("click", function (e) {
      if (
        e.target.closest(".btn-loc-delete") ||
        e.target.closest(".btn-loc-view")
      )
        return;
      var loc = locations.find(function (l) {
        return l.id === lid;
      });
      if (loc) centerOnLocation(loc);
    });
    var vb = item.querySelector(".btn-loc-view");
    if (vb)
      (function (id) {
        vb.addEventListener("click", function () {
          showLocationDetail(id);
        });
      })(lid);
    var db = item.querySelector(".btn-loc-delete");
    if (db)
      (function (id) {
        db.addEventListener("click", function () {
          selectedLocation = id;
          deleteLocation();
        });
      })(lid);
  });
}

function updateRouteSelects() {
  var opts = "";
  locations.forEach(function (l) {
    opts += '<option value="' + l.id + '">' + l.name + "</option>";
  });
  routeStart.innerHTML =
    '<option value="">Pilih lokasi awal...</option>' + opts;
  routeEnd.innerHTML =
    '<option value="">Pilih lokasi tujuan...</option>' + opts;
}

function updateRouteList() {
  var items = "";
  routes.forEach(function (r) {
    var fl = locations.find(function (l) {
      return l.id === r.from;
    });
    var tl = locations.find(function (l) {
      return l.id === r.to;
    });
    if (!fl || !tl) return;
    items +=
      '<div class="route-item" data-route-id="' +
      r.id +
      '">' +
      '<div class="route-info"><i class="fas fa-route"></i>' +
      '<span class="route-names">' +
      fl.name +
      " → " +
      tl.name +
      "</span></div>" +
      '<span class="route-distance">' +
      r.distance +
      " km</span>" +
      '<button class="btn btn-icon btn-sm btn-route-delete" title="Hapus"><i class="fas fa-times"></i></button></div>';
  });
  routeList.innerHTML =
    "<h4>Rute Aktif (" +
    routes.length +
    ")</h4>" +
    (routes.length === 0
      ? '<div class="empty-state"><i class="fas fa-route"></i><p>Belum ada rute</p></div>'
      : items);

  routeList.querySelectorAll(".btn-route-delete").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var rid = btn.closest(".route-item").getAttribute("data-route-id");
      routes = routes.filter(function (r) {
        return r.id !== rid;
      });
      renderRoutes();
      updateRouteList();
      showToast("Rute dihapus", "info");
    });
  });
}

// ===== Helpers =====
function getProvinceAtPoint(x, y) {
  var closest = null,
    minD = Infinity;
  PROVINCE_CENTERS.forEach(function (p) {
    var d = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
    if (d < minD) {
      minD = d;
      closest = p.name;
    }
  });
  return closest;
}

function showToast(msg, type) {
  type = type || "info";
  var icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };
  var t = document.createElement("div");
  t.className = "toast " + type;
  t.innerHTML = '<i class="' + icons[type] + '"></i><span>' + msg + "</span>";
  toastContainer.appendChild(t);
  setTimeout(function () {
    t.style.animation = "toastOut 0.3s ease forwards";
    setTimeout(function () {
      t.remove();
    }, 300);
  }, 3000);
}
