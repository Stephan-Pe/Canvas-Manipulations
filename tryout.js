const canvas = document.getElementById('canvas1');
// https://developer.mozilla.org/de/docs/Web/Guide/HTML/Canvas_Tutorial/Grundlagen
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];


// handle mouse

const mouse = {
    x: null,
    y: null,
    radius: 150
}
// declaring coordinates and pass them to event gives more detailed information about action
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x, mouse.y);
})

ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
// ctx.strokeStyle = 'white';
// ctx.strokeRect(0, 0, 100, 100);
// attributes letter, x coords, y coords, max-width
ctx.fillText('A', 0, 40);
// The CanvasRenderingContext2D method getImageData() of the Canvas 2D API returns an 
// ImageData object representing the underlying pixel data for a specified portion of the canvas.
// (x, y, width, height)
const data = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;

    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        // good old Pythagorean theorem
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 300) {
            this.size = 30;
        } else {
            this.size = 3;
        }
    }
}

function init() {
    particleArray = [];
    for (let i = 0; i < 1000; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x, y));
    }
    // particleArray.push(new Particle(200, 200));
    // particleArray.push(new Particle(300, 300));
}
init();

console.log(particleArray);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    requestAnimationFrame(animate);
}
animate();