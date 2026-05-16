const chart = [
    { "month": "Jan", "sales": 190 },
    { "month": "Feb", "sales": 175 },
    { "month": "Mar", "sales": 250 },
    { "month": "Apr", "sales": 200 },
    { "month": "May", "sales": 300 }];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const padding = 40;
const lineHeight = canvas.height - padding * 2;
const lineWidth = canvas.width - padding * 2;
const month = chart.map((item) => item.month);
const sales = chart.map((item) => item.sales);
const scaleSales = [];
const maxSales = Math.max(...sales);
const minSales = Math.min(...sales);
const scaleMonth = lineWidth / month.length;
const cx = [];
const cy = [];

sales.sort();
sales.reverse();
console.log(sales);

ctx.beginPath();
ctx.moveTo(padding, padding);
ctx.lineTo(padding, lineHeight + padding);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(padding, lineHeight + padding);
ctx.lineTo(lineWidth + padding, lineHeight + padding);
ctx.stroke();

ctx.beginPath();
ctx.fillText("Sales", 20, 20);
ctx.fillText("Month", lineWidth / 2 + padding, lineHeight + (padding * 2));

ctx.beginPath();
ctx.fillText("Monthly Sales Chart", lineWidth / 2, 20);
ctx.fillText("Month", lineWidth / 2 + padding, lineHeight + (padding * 2));


for (let i = 0; i < sales.length; i++) {
    let x = (sales[i] - minSales) / (maxSales - minSales);
    scaleSales.push(x);
}

scaleSales.reverse();

for (let i = 0; i < sales.length; i++) {
    const y = (lineHeight - padding) * scaleSales[i];
    const newCy = y + padding;
    ctx.beginPath();
    ctx.moveTo(lineWidth + padding, newCy);
    ctx.lineTo(padding - 10, newCy);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    cy.push(newCy);

    ctx.beginPath();
    ctx.fillText(sales[i], 10, y + padding + 3);
}


for (let i = 1; i <= month.length; i++) {
    const newCx = scaleMonth * i;
    ctx.beginPath();
    ctx.moveTo(newCx, lineHeight + padding + 10);
    ctx.lineTo(newCx, padding);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    cx.push(newCx);

    ctx.beginPath();
    ctx.fillText(month[i - 1], scaleMonth * i - 6, lineHeight + padding + 20);
}

cx.reverse();

for (let i = 0; i < cx.length; i++) {
    ctx.beginPath();
    ctx.moveTo(cx[i], cy[i]);
    ctx.lineTo(cx[i +1 ], cy[i + 1]);
    ctx.strokeStyle = "red";
    ctx.stroke();
}