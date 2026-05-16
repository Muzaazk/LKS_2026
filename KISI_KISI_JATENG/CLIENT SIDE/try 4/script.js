const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;
const rect = canvas.getBoundingClientRect();

canvas.width = dpr * rect.width;
canvas.height = dpr * rect.height;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

const canvasWidth = rect.width;
const canvasHeight = rect.height;
const gap = 20;
const gapHeight = canvasHeight / gap;
const gapWidth = canvasWidth / gap;

for (let i = 1; i < gapHeight; i++) {
  ctx.beginPath();
  ctx.moveTo(0, i * gap);
  ctx.lineTo(canvasWidth, i * gap);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.3;
  ctx.stroke();
}

for (let i = 1; i < gapWidth; i++) {
  ctx.beginPath();
  ctx.moveTo(i * gap, 0);
  ctx.lineTo(i * gap, canvasHeight);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.3;
  ctx.stroke();
}
