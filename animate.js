const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext('2d');
let mouseActive = false;

const colorArray = [
    '#2a2a2a',
    '#6b7783',
    '#511c16',
    '#0c3c60',
    '#ff703f'
]

class Vector2 {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    add (v){
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    subtract (v){
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    normalize (){
        const hyp = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        return new Vector2(this.x / hyp, this.y / hyp);
    }
    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
}
const mouse = new Vector2(0,0);

canvas.addEventListener('mousemove', e => {
    mouseActive = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    console.log(mouse)
});
canvas.addEventListener('mouseout', e => {
    mouseActive = false;
});


class Circle {
    constructor(x, y, radius, initialSpeed){
        this.oscillateFactor = .1;
        this.radius = radius || 20;
        this.initRadius = this.radius;
        this.maxRadius = 150;
        this.color = colorArray[Math.ceil(Math.random() * colorArray.length)];
        this.initialSpeed = initialSpeed || 10;
        this.triggerDistance = 200;

        this.vel = new Vector2(
            x || Math.random() * (this.initialSpeed * 2) - this.initialSpeed,
            y || Math.random() * (this.initialSpeed * 2) - this.initialSpeed
        )

        this.pos = new Vector2(
            canvas.width / 2,
            canvas.height / 2
        )
    }

    draw() {
        //Outer Circle
        c.beginPath();
        c.arc(this.pos.x , this.pos.y, this.radius, 0, 2 * Math.PI, false);
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.stroke();
        c.fill();

    }

    checkCollision () {
        if(this.pos.x >= (canvas.width - this.radius) ||
        this.pos.x <= 0) this.vel.x = -(this.vel.x);
        if(this.pos.y >= (canvas.height - this.radius) ||
            this.pos.y <= 0) this.vel.y = -(this.vel.y);
    }

    animate(frameCount) {
        //Check if the circle hit something and update velocity
        this.checkCollision();
        //Add velocity vector to get new postion
        this.pos = this.pos.add(this.vel);

        //Increase Size if close to Mouse
        if(mouseActive && 
            Math.abs(mouse.subtract(this.pos).x) <  this.triggerDistance &&  
            Math.abs(mouse.subtract(this.pos).y) < this.triggerDistance )
        {
            if(this.radius <= this.maxRadius){
                this.radius += 5;
            }
                
        }else if (this.radius >= this.initRadius){
            this.radius -= 5;
        }
        //draw circle to screen
        this.draw();
    }
}

//Generate circles with random starting velocities
const circles = [];
for(let i = 0; i < 500; i++) {
    circles.push(new Circle());
}

let frameCount = 0;
const update = () => {
    c.clearRect(0, 0, innerWidth, innerHeight)
    circles.forEach((circle, i) => {
        circle.animate(frameCount);
    })
    frameCount++;
    requestAnimationFrame(update);
} 
const circ = new Circle()
update();