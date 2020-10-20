// create fullscreen canvas
const canvas = document.getElementById('canvas1');
// https://developer.mozilla.org/de/docs/Web/Guide/HTML/Canvas_Tutorial/Grundlagen
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

// helps position the particleArray on screen
let adjustX = 6;
let adjustY = -4;


// handle mousemove

const mouse = {
    x: null,
    y: null,
    radius: 150
}
// declaring coordinates and pass them to event 
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    //console.log(mouse.x, mouse.y);
})
// fillstyle will be overwriten in Particle class
ctx.fillStyle = 'white';
ctx.font = '16px Verdana';
// ctx.strokeStyle = 'white';
// ctx.strokeRect(0, 0, 100, 100);
// attributes letter, x coords, y coords, max-width
ctx.fillText('Hello World', 0, 40);
// The CanvasRenderingContext2D method getImageData() of the Canvas 2D API returns an 
// ImageData object representing the underlying pixel data for a specified portion of the canvas.
// (x, y, width, height)

// textCoordinates have to cover text input on line 35 get them with getImageData Method
const textCoordns = ctx.getImageData(0, 0, 500, 500);

class Particle {
    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        // control spread and speed of spread
        this.density = (Math.random() * 60) + 9;

    }
    draw() {
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        // update mouse position on both axis
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        // good old Pythagorean theorem
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance * 3;
        let forceDirectionY = dy / distance * 3;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        // control distance between mouse and particle width diagonal axis
        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}
//console.log(textCoordns);
function init() {
    particleArray = [];
    // control particle coordinates
    for (let y = 0, y2 = textCoordns.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordns.width; x < x2; x++) {
            // 128 is 50% opacity of alpha value
            if (textCoordns.data[(y * 4 * textCoordns.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 15, positionY * 15));
            }
        }
    }
}
init();

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
// Array for 100 x 100 px contains 40,000 points because of the 4 color values in rgba

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    // call connect function
    connect();
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    requestAnimationFrame(animate);
}
animate();

function connect() {
    let opacityValue = 1;
    // nested loop takes only the particles wich weren't affected in first loop
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            // let dx = mouse.x - this.x;
            // let dy = mouse.y - this.y;
            // // good old Pythagorean theorem
            // let distance = Math.sqrt(dx * dx + dy * dy);
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            opacityValue = 1 - (distance / 40);
            ctx.strokeStyle = 'rgba(0, 255, 204,' + opacityValue + ')';
            if (distance < 40) {

                ctx.lineWidth = 2;
                // call methods to draw line between particles in canvas
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}





