(() => {
  "use strict";

  const STORAGE_KEY = "bombskuy_history_v1";

  const CANVAS_W = 1000;
  const CANVAS_H = 600;
  const COLS = 20;
  const ROWS = 12;
  const TILE = 50;

  const BASE = "./assets";
  const ASSETS = {
    bg: `${BASE}/background.jpg`,
    wall: `${BASE}/wall.png`,
    wallCrack: `${BASE}/wall_crack.png`,
    bomb: `${BASE}/bomb.png`,
    heart: `${BASE}/heart.png`,
    heartIndicator: `${BASE}/heart_indicator.png`,
    tnt: `${BASE}/tnt.png`,
    ice: `${BASE}/ice.png`,
    playerUp: `${BASE}/char_up.png`,
    playerDown: `${BASE}/char_down.png`,
    playerLeft: `${BASE}/char_left.png`,
    playerRight: `${BASE}/char_right.png`,
    dogUp: `${BASE}/dog_up.png`,
    dogDown: `${BASE}/dog_down.png`,
    dogLeft: `${BASE}/dog_left.png`,
    dogRight: `${BASE}/dog_right.png`,
    explosion: `${BASE}/duar.jpg`,
  };

  const ui = {
    canvas: document.getElementById("gameCanvas"),
    ctx: null,

    inputName: document.getElementById("inputName"),
    btnGoLevel: document.getElementById("btnGoLevel"),
    btnInstruction: document.getElementById("btnInstruction"),
    btnInstruction2: document.getElementById("btnInstruction2"),
    btnCloseInstruction: document.getElementById("btnCloseInstruction"),
    btnBackWelcome: document.getElementById("btnBackWelcome"),
    overlayWelcome: document.getElementById("overlayWelcome"),
    overlayLevel: document.getElementById("overlayLevel"),
    overlayCountdown: document.getElementById("overlayCountdown"),
    overlayPause: document.getElementById("overlayPause"),
    overlayGameOver: document.getElementById("overlayGameOver"),
    overlayLeaderboard: document.getElementById("overlayLeaderboard"),
    overlayInstruction: document.getElementById("overlayInstruction"),
    countdownText: document.getElementById("countdownText"),

    btnContinue: document.getElementById("btnContinue"),
    btnQuit: document.getElementById("btnQuit"),
    btnSaveScore: document.getElementById("btnSaveScore"),
    btnLeaderboards: document.getElementById("btnLeaderboards"),
    btnRestart: document.getElementById("btnRestart"),
    btnCloseLeaderboard: document.getElementById("btnCloseLeaderboard"),
    btnBackFromLeaderboard: document.getElementById("btnBackFromLeaderboard"),

    hudPlayer: document.getElementById("hudPlayer"),
    hudLives: document.getElementById("hudLives"),
    hudTimer: document.getElementById("hudTimer"),
    hudWalls: document.getElementById("hudWalls"),
    hudItems: document.getElementById("hudItems"),
    hudTnt: document.getElementById("hudTnt"),
    hudIce: document.getElementById("hudIce"),

    goPlayer: document.getElementById("goPlayer"),
    goTime: document.getElementById("goTime"),
    goScore: document.getElementById("goScore"),
    leaderboardBody: document.getElementById("leaderboardBody"),
  };

  ui.ctx = ui.canvas.getContext("2d");

  const images = {};
  let assetsReady = false;

  const input = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  const app = {
    screen: "welcome", // welcome | level | countdown | playing | paused | gameover | leaderboard
    username: "",
    difficulty: null, // easy | medium | hard
    countdown: 3,

    lastTs: 0,
    rafId: 0,

    game: null,
    savedThisRun: false,
  };

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function randInt(min, maxInclusive) {
    return Math.floor(Math.random() * (maxInclusive - min + 1)) + min;
  }

  function keyToDir(code) {
    if (code === "KeyW" || code === "ArrowUp") return "up";
    if (code === "KeyS" || code === "ArrowDown") return "down";
    if (code === "KeyA" || code === "ArrowLeft") return "left";
    if (code === "KeyD" || code === "ArrowRight") return "right";
    return null;
  }

  function dirVec(dir) {
    if (dir === "up") return { dx: 0, dy: -1 };
    if (dir === "down") return { dx: 0, dy: 1 };
    if (dir === "left") return { dx: -1, dy: 0 };
    if (dir === "right") return { dx: 1, dy: 0 };
    return { dx: 0, dy: 0 };
  }

  function tileToPx(t) {
    return t * TILE;
  }

  function pxCenterOfTile(t) {
    return t * TILE + TILE / 2;
  }

  function formatTime(ms) {
    const sec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function scoreFromStats(stats) {
    return stats.wallsDestroyed * 10 + stats.tntCollected * 25 + stats.iceCollected * 25;
  }

  function show(el) {
    el.classList.remove("hidden");
  }
  function hide(el) {
    el.classList.add("hidden");
  }

  function setScreen(next) {
    const now = performance.now();
    const g = app.game;
    const prev = app.screen;
    app.screen = next;

    hide(ui.overlayWelcome);
    hide(ui.overlayLevel);
    hide(ui.overlayCountdown);
    hide(ui.overlayPause);
    hide(ui.overlayGameOver);
    hide(ui.overlayLeaderboard);

    if (next === "welcome") show(ui.overlayWelcome);
    if (next === "level") show(ui.overlayLevel);
    if (next === "countdown") show(ui.overlayCountdown);
    if (next === "paused") show(ui.overlayPause);
    if (next === "gameover") show(ui.overlayGameOver);
    if (next === "leaderboard") show(ui.overlayLeaderboard);

    // Pause bookkeeping so timer doesn't jump.
    if (g) {
      if (prev === "playing" && next === "paused") {
        g.pausedAt = now;
      }
      if (prev === "paused" && next === "playing") {
        if (g.pausedAt) g.startedAt += now - g.pausedAt;
        g.pausedAt = 0;
      }
    }
  }

  function openInstruction() {
    show(ui.overlayInstruction);
  }

  function closeInstruction() {
    hide(ui.overlayInstruction);
  }

  function loadAllImages() {
    const entries = Object.entries(ASSETS);
    let loaded = 0;
    return new Promise((resolve) => {
      entries.forEach(([key, src]) => {
        const img = new Image();
        img.onload = () => {
          images[key] = img;
          loaded += 1;
          if (loaded === entries.length) resolve();
        };
        img.onerror = () => {
          images[key] = img;
          loaded += 1;
          if (loaded === entries.length) resolve();
        };
        img.src = src;
      });
    });
  }

  function createEmptyGrid(fill) {
    const grid = [];
    for (let y = 0; y < ROWS; y += 1) {
      const row = [];
      for (let x = 0; x < COLS; x += 1) row.push(fill);
      grid.push(row);
    }
    return grid;
  }

  function createGame(difficulty) {
    const dogCount = difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1;

    const grid = createEmptyGrid("empty"); // empty | stone | brick
    const brickItem = createEmptyGrid(null); // null | "brokenHeart" | "tnt" | "ice"

    // Stone walls: classic bomberman pattern (every odd,odd) with safe zone near spawn.
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const isPatternStone = x % 2 === 1 && y % 2 === 1;
        const inSafeZone = (x <= 2 && y <= 2);
        if (isPatternStone && !inSafeZone) grid[y][x] = "stone";
      }
    }

    // Random brick walls, keep spawn path open.
    const safe = new Set(["0,0", "1,0", "0,1", "1,1", "2,0", "0,2"]);
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        if (grid[y][x] !== "empty") continue;
        if (safe.has(`${x},${y}`)) continue;
        if (Math.random() < 0.42) {
          grid[y][x] = "brick";
          const r = Math.random();
          if (r < 0.18) brickItem[y][x] = "brokenHeart";
          else if (r < 0.33) brickItem[y][x] = "tnt";
          else if (r < 0.48) brickItem[y][x] = "ice";
        }
      }
    }

    const player = {
      x: 0,
      y: 0,
      px: pxCenterOfTile(0),
      py: pxCenterOfTile(0),
      dir: "down",
      speed: 180, // px/s
      lives: 3,
      invulnUntil: 0,
      frozenUntil: 0,
      bombRange: 1,
      mark: null, // "tnt" | "ice" | "brokenHeart"
      walkPhase: 0,
    };

    const dogs = [];
    for (let i = 0; i < dogCount; i += 1) {
      const p = randomFreeTile(grid, [], player, 6);
      dogs.push({
        id: i + 1,
        x: p.x,
        y: p.y,
        px: pxCenterOfTile(p.x),
        py: pxCenterOfTile(p.y),
        dir: "left",
        speed: 140,
        nextThinkAt: 0,
        invulnUntil: 0,
        alive: true,
        walkPhase: 0,
      });
    }

    const game = {
      startedAt: 0,
      elapsedMs: 0,
      pausedAt: 0,

      grid,
      brickItem,
      items: [], // {x,y,type,spawnedAt}
      bombs: [], // {x,y,placedAt,explodeAt,range}
      explosions: [], // {x,y,endsAt}
      dogs,
      player,

      stats: {
        wallsDestroyed: 0,
        itemsCollected: 0,
        tntCollected: 0,
        iceCollected: 0,
      },
    };

    return game;
  }

  function randomFreeTile(grid, avoidTiles, player, minDist) {
    const avoid = new Set(avoidTiles.map((p) => `${p.x},${p.y}`));
    const tries = 5000;
    for (let t = 0; t < tries; t += 1) {
      const x = randInt(0, COLS - 1);
      const y = randInt(0, ROWS - 1);
      if (grid[y][x] !== "empty") continue;
      if (avoid.has(`${x},${y}`)) continue;
      const d = Math.abs(x - player.x) + Math.abs(y - player.y);
      if (d < minDist) continue;
      return { x, y };
    }
    return { x: COLS - 1, y: ROWS - 1 };
  }

  function isInside(x, y) {
    return x >= 0 && y >= 0 && x < COLS && y < ROWS;
  }

  function bombAt(game, x, y) {
    for (let i = 0; i < game.bombs.length; i += 1) {
      const b = game.bombs[i];
      if (b.x === x && b.y === y) return b;
    }
    return null;
  }

  function isBlocked(game, x, y) {
    if (!isInside(x, y)) return true;
    const cell = game.grid[y][x];
    if (cell === "stone" || cell === "brick") return true;
    if (bombAt(game, x, y)) return true;
    return false;
  }

  function nearestTileFromPx(px) {
    return clamp(Math.floor(px / TILE), 0, COLS - 1);
  }

  function updateHUD() {
    if (!app.game) return;
    const g = app.game;
    ui.hudPlayer.textContent = app.username || "-";
    ui.hudTimer.textContent = formatTime(g.elapsedMs);
    ui.hudWalls.textContent = String(g.stats.wallsDestroyed);
    ui.hudItems.textContent = String(g.stats.itemsCollected);
    ui.hudTnt.textContent = String(g.stats.tntCollected);
    ui.hudIce.textContent = String(g.stats.iceCollected);

    ui.hudLives.innerHTML = "";
    for (let i = 0; i < g.player.lives; i += 1) {
      const img = document.createElement("img");
      img.src = ASSETS.heart;
      img.alt = "heart";
      ui.hudLives.appendChild(img);
    }
  }

  function setGameOver() {
    const g = app.game;
    if (!g) return;
    app.savedThisRun = false;
    setScreen("gameover");

    const sc = scoreFromStats(g.stats);
    ui.goPlayer.textContent = app.username;
    ui.goTime.textContent = formatTime(g.elapsedMs);
    ui.goScore.textContent = String(sc);
    updateHUD();
  }

  function startCountdownThenPlay(level) {
    app.difficulty = level;
    app.game = createGame(level);
    app.savedThisRun = false;

    app.countdown = 3;
    ui.countdownText.textContent = String(app.countdown);
    setScreen("countdown");

    const tick = () => {
      if (app.screen !== "countdown") return;
      app.countdown -= 1;
      if (app.countdown <= 0) {
        hide(ui.overlayCountdown);
        setScreen("playing");
        app.game.startedAt = performance.now();
        return;
      }
      ui.countdownText.textContent = String(app.countdown);
      setTimeout(tick, 1000);
    };
    setTimeout(tick, 1000);
  }

  function tryPlaceBomb(now) {
    const g = app.game;
    if (!g) return;
    const p = g.player;
    if (now < p.frozenUntil) return;
    const x = p.x;
    const y = p.y;
    if (bombAt(g, x, y)) return;
    g.bombs.push({
      x,
      y,
      placedAt: now,
      explodeAt: now + 5000,
      range: p.bombRange,
    });
  }

  function spawnItem(game, x, y, type, now) {
    game.items.push({ x, y, type, spawnedAt: now });
  }

  function itemAt(game, x, y) {
    for (let i = 0; i < game.items.length; i += 1) {
      const it = game.items[i];
      if (it.x === x && it.y === y) return { it, idx: i };
    }
    return null;
  }

  function applyItem(game, type, now) {
    const p = game.player;
    game.stats.itemsCollected += 1;
    if (type === "brokenHeart") {
      p.lives = Math.max(0, p.lives - 1);
      p.invulnUntil = now + 800;
      p.mark = "brokenHeart";
    } else if (type === "tnt") {
      p.bombRange = 2;
      p.mark = "tnt";
      game.stats.tntCollected += 1;
    } else if (type === "ice") {
      p.frozenUntil = now + 5000;
      p.mark = "ice";
      game.stats.iceCollected += 1;
    }
  }

  function damagePlayer(game, now) {
    const p = game.player;
    if (now < p.invulnUntil) return;
    p.lives = Math.max(0, p.lives - 1);
    p.invulnUntil = now + 1200;
    if (p.lives <= 0) setGameOver();
  }

  function explodeBomb(game, bomb, now) {
    const hit = [];
    const pushHit = (x, y) => {
      if (!isInside(x, y)) return false;
      hit.push({ x, y });
      const cell = game.grid[y][x];
      if (cell === "stone") return true;
      if (cell === "brick") return true;
      return false;
    };

    pushHit(bomb.x, bomb.y);
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];
    for (let d = 0; d < dirs.length; d += 1) {
      const { dx, dy } = dirs[d];
      for (let r = 1; r <= bomb.range; r += 1) {
        const x = bomb.x + dx * r;
        const y = bomb.y + dy * r;
        if (!isInside(x, y)) break;
        hit.push({ x, y });
        const cell = game.grid[y][x];
        if (cell === "stone") break;
        if (cell === "brick") {
          // destroy brick and reveal item
          game.grid[y][x] = "empty";
          game.stats.wallsDestroyed += 1;
          const t = game.brickItem[y][x];
          if (t) spawnItem(game, x, y, t, now);
          game.brickItem[y][x] = null;
          break;
        }
      }
    }

    for (let i = 0; i < hit.length; i += 1) {
      const h = hit[i];
      game.explosions.push({ x: h.x, y: h.y, endsAt: now + 450 });
    }
  }

  function isExplosionAt(game, x, y, now) {
    for (let i = 0; i < game.explosions.length; i += 1) {
      const e = game.explosions[i];
      if (now > e.endsAt) continue;
      if (e.x === x && e.y === y) return true;
    }
    return false;
  }

  function bfsNextStep(game, from, to) {
    const q = [];
    const visited = createEmptyGrid(false);
    const parent = createEmptyGrid(null);

    q.push({ x: from.x, y: from.y });
    visited[from.y][from.x] = true;

    const deltas = [
      { dx: 0, dy: -1, dir: "up" },
      { dx: 0, dy: 1, dir: "down" },
      { dx: -1, dy: 0, dir: "left" },
      { dx: 1, dy: 0, dir: "right" },
    ];

    while (q.length) {
      const cur = q.shift();
      if (cur.x === to.x && cur.y === to.y) break;
      for (let i = 0; i < deltas.length; i += 1) {
        const nx = cur.x + deltas[i].dx;
        const ny = cur.y + deltas[i].dy;
        if (!isInside(nx, ny)) continue;
        if (visited[ny][nx]) continue;
        if (isBlocked(game, nx, ny)) continue;
        visited[ny][nx] = true;
        parent[ny][nx] = { x: cur.x, y: cur.y };
        q.push({ x: nx, y: ny });
      }
    }

    if (!visited[to.y][to.x]) return null;
    let cx = to.x;
    let cy = to.y;
    let prev = parent[cy][cx];
    while (prev && !(prev.x === from.x && prev.y === from.y)) {
      cx = prev.x;
      cy = prev.y;
      prev = parent[cy][cx];
    }
    const dx = cx - from.x;
    const dy = cy - from.y;
    if (dx === 1) return "right";
    if (dx === -1) return "left";
    if (dy === 1) return "down";
    if (dy === -1) return "up";
    return null;
  }

  function updatePlayer(game, dt, now) {
    const p = game.player;

    const frozen = now < p.frozenUntil;
    if (frozen) return;

    let moveDir = null;
    if (input.up) moveDir = "up";
    else if (input.down) moveDir = "down";
    else if (input.left) moveDir = "left";
    else if (input.right) moveDir = "right";

    if (!moveDir) return;
    p.dir = moveDir;

    const v = dirVec(moveDir);
    const step = p.speed * dt;
    const nextPx = p.px + v.dx * step;
    const nextPy = p.py + v.dy * step;

    // Try move with simple collision against grid.
    const tx = clamp(Math.floor((nextPx) / TILE), 0, COLS - 1);
    const ty = clamp(Math.floor((nextPy) / TILE), 0, ROWS - 1);

    // Use a small radius to avoid corner clipping.
    const r = 14;
    const corners = [
      { px: nextPx - r, py: nextPy - r },
      { px: nextPx + r, py: nextPy - r },
      { px: nextPx - r, py: nextPy + r },
      { px: nextPx + r, py: nextPy + r },
    ];
    let blocked = false;
    for (let i = 0; i < corners.length; i += 1) {
      const cx = clamp(Math.floor(corners[i].px / TILE), 0, COLS - 1);
      const cy = clamp(Math.floor(corners[i].py / TILE), 0, ROWS - 1);
      // Allow standing on your own tile even if bomb just placed (so you can move away).
      const onBomb = bombAt(game, cx, cy);
      const isOwnTile = cx === p.x && cy === p.y;
      const cell = game.grid[cy][cx];
      if (cell === "stone" || cell === "brick") blocked = true;
      if (onBomb && !isOwnTile) blocked = true;
      if (blocked) break;
    }

    if (!blocked) {
      p.px = nextPx;
      p.py = nextPy;
      p.walkPhase += dt * 10;
    }

    p.x = nearestTileFromPx(p.px);
    p.y = clamp(Math.floor(p.py / TILE), 0, ROWS - 1);
  }

  function updateDogs(game, dt, now) {
    const p = game.player;
    for (let i = 0; i < game.dogs.length; i += 1) {
      const d = game.dogs[i];
      if (!d.alive) continue;

      if (now >= d.nextThinkAt) {
        const next = bfsNextStep(game, { x: d.x, y: d.y }, { x: p.x, y: p.y });
        if (next && Math.random() < 0.88) d.dir = next;
        else d.dir = ["up", "down", "left", "right"][randInt(0, 3)];
        d.nextThinkAt = now + 260 + randInt(0, 120);
      }

      const v = dirVec(d.dir);
      const step = d.speed * dt;
      const nextPx = d.px + v.dx * step;
      const nextPy = d.py + v.dy * step;
      const tx = clamp(Math.floor(nextPx / TILE), 0, COLS - 1);
      const ty = clamp(Math.floor(nextPy / TILE), 0, ROWS - 1);

      if (!isBlocked(game, tx, ty)) {
        d.px = nextPx;
        d.py = nextPy;
        d.walkPhase += dt * 10;
        d.x = tx;
        d.y = ty;
      } else {
        d.nextThinkAt = 0;
      }

      if (d.x === p.x && d.y === p.y) damagePlayer(game, now);
    }
  }

  function updateBombs(game, now) {
    for (let i = game.bombs.length - 1; i >= 0; i -= 1) {
      const b = game.bombs[i];
      if (now >= b.explodeAt) {
        explodeBomb(game, b, now);
        game.bombs.splice(i, 1);
      }
    }
  }

  function updateExplosions(game, now) {
    for (let i = game.explosions.length - 1; i >= 0; i -= 1) {
      if (now >= game.explosions[i].endsAt) game.explosions.splice(i, 1);
    }
  }

  function resolveHits(game, now) {
    const p = game.player;

    // Player hit by explosion.
    if (isExplosionAt(game, p.x, p.y, now)) damagePlayer(game, now);

    // Dogs hit by explosions.
    for (let i = 0; i < game.dogs.length; i += 1) {
      const d = game.dogs[i];
      if (!d.alive) continue;
      if (isExplosionAt(game, d.x, d.y, now)) d.alive = false;
    }
  }

  function pickupItems(game, now) {
    const p = game.player;
    const found = itemAt(game, p.x, p.y);
    if (!found) return;
    const type = found.it.type;
    game.items.splice(found.idx, 1);
    applyItem(game, type, now);
    if (p.lives <= 0) setGameOver();
  }

  function drawImageCentered(ctx, img, cx, cy, w, h, alpha) {
    ctx.save();
    if (typeof alpha === "number") ctx.globalAlpha = alpha;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
    ctx.restore();
  }

  function draw(game, now) {
    const ctx = ui.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    if (images.bg) ctx.drawImage(images.bg, 0, 0, CANVAS_W, CANVAS_H);
    else {
      ctx.fillStyle = "#0b1020";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // Grid tiles
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const cell = game.grid[y][x];
        if (cell === "stone") {
          ctx.fillStyle = "rgba(0,0,0,0.32)";
          ctx.fillRect(tileToPx(x), tileToPx(y), TILE, TILE);
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.strokeRect(tileToPx(x) + 1, tileToPx(y) + 1, TILE - 2, TILE - 2);
        } else if (cell === "brick") {
          const img = images.wall || null;
          if (img && img.complete) {
            ctx.drawImage(img, tileToPx(x), tileToPx(y), TILE, TILE);
          } else {
            ctx.fillStyle = "rgba(160,110,60,0.9)";
            ctx.fillRect(tileToPx(x), tileToPx(y), TILE, TILE);
          }
        }
      }
    }

    // Items
    for (let i = 0; i < game.items.length; i += 1) {
      const it = game.items[i];
      const cx = pxCenterOfTile(it.x);
      const cy = pxCenterOfTile(it.y);
      let img = null;
      if (it.type === "brokenHeart") img = images.heartIndicator || images.heart;
      if (it.type === "tnt") img = images.tnt;
      if (it.type === "ice") img = images.ice;
      if (img && img.complete) drawImageCentered(ctx, img, cx, cy, 30, 30);
    }

    // Bombs
    for (let i = 0; i < game.bombs.length; i += 1) {
      const b = game.bombs[i];
      const t = (b.explodeAt - now) / 5000;
      const pulse = 1 + (1 - clamp(t, 0, 1)) * 0.25;
      const img = images.bomb;
      if (img && img.complete) drawImageCentered(ctx, img, pxCenterOfTile(b.x), pxCenterOfTile(b.y), 32 * pulse, 32 * pulse);
    }

    // Explosions
    for (let i = 0; i < game.explosions.length; i += 1) {
      const e = game.explosions[i];
      const img = images.explosion;
      if (img && img.complete) {
        drawImageCentered(ctx, img, pxCenterOfTile(e.x), pxCenterOfTile(e.y), TILE, TILE, 0.85);
      } else {
        ctx.fillStyle = "rgba(255,140,0,0.55)";
        ctx.fillRect(tileToPx(e.x), tileToPx(e.y), TILE, TILE);
      }
    }

    // Dogs
    for (let i = 0; i < game.dogs.length; i += 1) {
      const d = game.dogs[i];
      if (!d.alive) continue;
      let img = images.dogDown;
      if (d.dir === "up") img = images.dogUp;
      else if (d.dir === "left") img = images.dogLeft;
      else if (d.dir === "right") img = images.dogRight;
      else img = images.dogDown;

      const bob = Math.sin(d.walkPhase) * 2;
      const alpha = isExplosionAt(game, d.x, d.y, now) ? 0.5 : 1;
      if (img && img.complete) drawImageCentered(ctx, img, d.px, d.py + bob, 40, 40, alpha);
    }

    // Player
    const p = game.player;
    let pImg = images.playerDown;
    if (p.dir === "up") pImg = images.playerUp;
    else if (p.dir === "left") pImg = images.playerLeft;
    else if (p.dir === "right") pImg = images.playerRight;
    else pImg = images.playerDown;

    const frozen = now < p.frozenUntil;
    const blink = now < p.invulnUntil && Math.floor(now / 90) % 2 === 0;
    if (!blink) {
      const bob = Math.sin(p.walkPhase) * 2;
      const alpha = frozen ? 0.6 : 1;
      if (pImg && pImg.complete) drawImageCentered(ctx, pImg, p.px, p.py + bob, 44, 44, alpha);
    }

    // Item mark above player
    let markImg = null;
    if (p.mark === "tnt") markImg = images.tnt;
    else if (p.mark === "ice") markImg = images.ice;
    else if (p.mark === "brokenHeart") markImg = images.heartIndicator || images.heart;
    if (markImg && markImg.complete) drawImageCentered(ctx, markImg, p.px, p.py - 34, 22, 22, 0.95);

    // Frozen overlay cue
    if (frozen) {
      ctx.fillStyle = "rgba(50, 190, 255, 0.10)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
  }

  function update(now, dt) {
    const g = app.game;
    if (!g) return;

    if (app.screen === "playing") {
      g.elapsedMs = now - g.startedAt;
      updatePlayer(g, dt, now);
      updateDogs(g, dt, now);
      updateBombs(g, now);
      updateExplosions(g, now);
      resolveHits(g, now);
      pickupItems(g, now);

      if (g.player.lives <= 0) return;
    }
  }

  function loop(ts) {
    if (!app.lastTs) app.lastTs = ts;
    const dt = clamp((ts - app.lastTs) / 1000, 0, 0.05);
    app.lastTs = ts;

    if (assetsReady && app.game) {
      if (app.screen !== "paused" && app.screen !== "welcome" && app.screen !== "level" && app.screen !== "countdown" && app.screen !== "leaderboard" && app.screen !== "gameover") {
        // only playing, but keep safe
      }
      if (app.screen === "playing") update(ts, dt);
      draw(app.game, ts);
      updateHUD();
    } else {
      // simple background while loading
      ui.ctx.fillStyle = "#0b1020";
      ui.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ui.ctx.fillStyle = "rgba(232,236,255,0.75)";
      ui.ctx.font = "20px ui-sans-serif, system-ui";
      ui.ctx.fillText("Loading assets...", 24, 40);
    }

    app.rafId = requestAnimationFrame(loop);
  }

  function readHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  function writeHistory(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  function renderLeaderboard() {
    const list = readHistory();
    list.sort((a, b) => {
      if (b.wallsDestroyed !== a.wallsDestroyed) return b.wallsDestroyed - a.wallsDestroyed;
      if (b.tntCollected !== a.tntCollected) return b.tntCollected - a.tntCollected;
      if (b.iceCollected !== a.iceCollected) return b.iceCollected - a.iceCollected;
      return a.timeMs - b.timeMs;
    });

    ui.leaderboardBody.innerHTML = "";
    for (let i = 0; i < list.length; i += 1) {
      const r = list[i];
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${formatTime(r.timeMs)}</td>
        <td>${r.wallsDestroyed}</td>
        <td>${r.tntCollected}</td>
        <td>${r.iceCollected}</td>
        <td>${r.score}</td>
      `;
      ui.leaderboardBody.appendChild(tr);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => {
      if (c === "&") return "&amp;";
      if (c === "<") return "&lt;";
      if (c === ">") return "&gt;";
      if (c === '"') return "&quot;";
      return "&#039;";
    });
  }

  function bindUI() {
    ui.inputName.addEventListener("input", () => {
      const v = ui.inputName.value.trim();
      ui.btnGoLevel.disabled = v.length === 0;
    });

    ui.btnGoLevel.addEventListener("click", () => {
      const v = ui.inputName.value.trim();
      if (!v) return;
      app.username = v;
      setScreen("level");
    });

    ui.btnBackWelcome.addEventListener("click", () => {
      setScreen("welcome");
    });

    ui.btnInstruction.addEventListener("click", openInstruction);
    ui.btnInstruction2.addEventListener("click", openInstruction);
    ui.btnCloseInstruction.addEventListener("click", closeInstruction);

    ui.overlayInstruction.addEventListener("click", (e) => {
      if (e.target === ui.overlayInstruction) closeInstruction();
    });

    ui.overlayWelcome.addEventListener("click", (e) => {
      // no-op
    });

    ui.overlayLevel.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-level]");
      if (!btn) return;
      const level = btn.getAttribute("data-level");
      startCountdownThenPlay(level);
    });

    ui.btnContinue.addEventListener("click", () => {
      if (app.screen === "paused") setScreen("playing");
    });

    ui.btnQuit.addEventListener("click", () => {
      app.game = null;
      setScreen("welcome");
    });

    ui.btnRestart.addEventListener("click", () => {
      setScreen("level");
    });

    ui.btnLeaderboards.addEventListener("click", () => {
      renderLeaderboard();
      setScreen("leaderboard");
    });

    ui.btnCloseLeaderboard.addEventListener("click", () => {
      if (app.game && app.game.player.lives <= 0) setScreen("gameover");
      else if (app.game) setScreen("playing");
      else setScreen("welcome");
    });

    ui.btnBackFromLeaderboard.addEventListener("click", () => {
      if (app.game && app.game.player.lives <= 0) setScreen("gameover");
      else if (app.game) setScreen("playing");
      else setScreen("welcome");
    });

    ui.btnSaveScore.addEventListener("click", () => {
      const g = app.game;
      if (!g || app.savedThisRun) return;
      const entry = {
        name: app.username,
        timeMs: g.elapsedMs,
        wallsDestroyed: g.stats.wallsDestroyed,
        tntCollected: g.stats.tntCollected,
        iceCollected: g.stats.iceCollected,
        score: scoreFromStats(g.stats),
        createdAt: Date.now(),
      };
      const list = readHistory();
      list.push(entry);
      writeHistory(list);
      app.savedThisRun = true;
    });
  }

  function bindKeys() {
    window.addEventListener("keydown", (e) => {
      if (!assetsReady) return;

      const dir = keyToDir(e.code);
      if (dir) {
        input[dir] = true;
        e.preventDefault();
      }

      if (e.code === "Space") {
        if (app.screen === "playing") tryPlaceBomb(performance.now());
        e.preventDefault();
      }

      if (e.code === "Escape") {
        if (app.screen === "playing") setScreen("paused");
        else if (app.screen === "paused") setScreen("playing");
        e.preventDefault();
      }
    });

    window.addEventListener("keyup", (e) => {
      const dir = keyToDir(e.code);
      if (dir) input[dir] = false;
    });
  }

  function boot() {
    setScreen("welcome");
    hide(ui.overlayInstruction);

    bindUI();
    bindKeys();

    loadAllImages().then(() => {
      assetsReady = true;
    });

    app.rafId = requestAnimationFrame(loop);
  }

  boot();
})();
