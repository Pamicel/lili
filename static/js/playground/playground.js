function setup() {
    createCanvas(640, 480);
    noFill();
    strokeWeight(1);
    ellipseMode(CENTER)
}

function el_(x, y) {
    ellipse(x, y, 100, 100);
}

function draw() {
    background('black');
    push();
    stroke("blue");
    for (let i = 0; i < height; i += 10)
        line(0, i, width, i);
    pop();
    fill("green");
    el_(width / 3, height / 2);
    el_(2 * width / 3, height / 2);
    fill("lightblue");
    push();
    translate(0, 20);
    scale(.3);
    el_(width / 3, height / 2);
    pop();
    push();
    scale(.3);
    translate(0, 20);
    el_(2 * width / 3, height / 2);
    pop();
}
