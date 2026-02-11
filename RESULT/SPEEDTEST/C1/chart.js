const chart = [
    { "month": "Jan", "sales": 190 },
    { "month": "Feb", "sales": 175 },
    { "month": "Mar", "sales": 250 },
    { "month": "Apr", "sales": 200 },
    { "month": "May", "sales": 300 }]

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const padding = 40;
const lineHeight = canvas.height - padding * 2;
const lineWidth = canvas.width - padding * 2;
const month = chart.map((item) => item.month);
const sales = chart.map((item) => item.sales)
const scaleSales = [];
const maxSales = Math.max(...sales);
const minSales = Math.min(...sales);


ctx.beginPath();
ctx.moveTo(padding, padding);
ctx.lineTo(padding, lineHeight + padding);
ctx.stroke();


ctx.beginPath();
ctx.moveTo(padding, lineHeight + padding);
ctx.lineTo(lineWidth + padding, lineHeight + padding);
ctx.stroke();

for (let i = 0; i < sales.length; i++) {
    let x = (sales[i] - minSales) / (maxSales - minSales);
    scaleSales.push(x);
}

console.log(scaleSales);
for (let i = 0; i < sales.length; i++) {
    ctx.beginPath();
    ctx.moveTo(padding, lineHeight);
    ctx.lineTo(padding - 20, lineHeight);
    ctx.stroke();
}