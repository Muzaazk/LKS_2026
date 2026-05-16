const data = {
  title: "Data Covid Jakarta Oktober",
  data: [
    { tanggal: 1, jumlah: 12 },
    { tanggal: 2, jumlah: 18 },
    { tanggal: 3, jumlah: 70 },
    { tanggal: 4, jumlah: 40 },
    { tanggal: 5, jumlah: 58 },
    { tanggal: 6, jumlah: 20 },
    { tanggal: 7, jumlah: 48 },
    { tanggal: 8, jumlah: 28 },
  ],
};

const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const padding = 40;
const canvasHeight = canvas.height - padding * 2;
const canvasWidth = canvas.width - padding * 2;
const jumlahArr = data.data.map((item) => item.jumlah);
const tanggalArr = data.data.map((item) => item.tanggal);
const jumlahMax = Math.max(...jumlahArr);
const jumlahMin = Math.min(...jumlahArr);

ctx.beginPath();
ctx.moveTo(padding, padding);
ctx.lineTo(padding, padding + canvasHeight);
ctx.lineTo(canvasWidth + padding, canvasHeight + padding);
ctx.stroke();

let jumlahScalling = [];
for (let i = 0; i < data.data.length; i++) {
  const x = jumlahArr[i];
  const xNew = (x - jumlahMin) / (jumlahMax - jumlahMin);
  jumlahScalling.push(xNew);
}

ctx.beginPath();
ctx.fillText("jumlah", padding / 2, padding / 2);
ctx.fillText("tanggal", canvasWidth + padding, canvasHeight + padding + 3);
ctx.closePath();

let cx = [];
let cy = [];

for (let i = 0; i < data.data.length; i++) {
  const range = (canvasHeight - 40) * jumlahScalling[i];
  const y = canvasHeight - range;
  ctx.beginPath();
  ctx.moveTo(padding, y);
  ctx.lineTo(padding - 10, y);
  ctx.stroke();
  ctx.fillText(jumlahArr[i], padding - 25, canvasHeight - range + 3);
  cy.push(y);
}

for (let i = 1; i <= data.data.length; i++) {
  const range = (canvasWidth - 40) / tanggalArr.length;
  const x = range * i;
  ctx.beginPath();
  ctx.moveTo(x, canvasHeight + padding);
  ctx.lineTo(x, canvasHeight + padding + 10);
  ctx.stroke();
  ctx.fillText(tanggalArr[i - 1], range * i - 3, canvasHeight + padding + 20);
  cx.push(x);
}

const cxNew = cx.reverse();
const cyNew = cy.reverse();

for (let i = 0; i <= data.data.length; i++) {
  const x = cxNew[i];
  const y = cyNew[i];
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(cxNew[i + 1], cyNew[i + 1]);
  ctx.strokeStyle = "red";
  ctx.stroke();
}
