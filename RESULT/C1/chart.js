class Chart {

}


let chart = new Chart({
    title: "Montlhy Sales Chart",
    data: [
    { "month": "Jan", "sales": 190 },
    { "month": "Feb", "sales": 175 },
    { "month": "Mar", "sales": 250 },
    { "month": "Apr", "sales": 200 },
    { "month": "May", "sales": 300 }
]
})

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const padding = 40;
const lineHeight = canvas.height - padding * 2;
const lineWidth = canvas.width - padding * 2;
const month = chart;
console.log(chart);

ctx.beginPath();
ctx.moveTo(padding, padding);
ctx.lineTo(padding, lineHeight + padding);
ctx.stroke();


ctx.beginPath();
ctx.moveTo(padding, lineHeight + padding);
ctx.lineTo(lineWidth + padding, lineHeight + padding);
ctx.stroke();

