var mouseDown = false;

function setup() {
  var canv = createCanvas(400, 400);
  canv.parent("container");
  noStroke();
  background(0);
  ellipseMode(CENTER);
  stroke(255);
  noFill();
  strokeWeight(2);
  ellipse(width / 2, height / 2, width - 20, height - 20);
  ellipse(width / 2, height / 2, width - 100, height - 100);
  fill(255);
}

function draw() {
  if (mouseDown)
    ellipse(mouseX, mouseY, 30, 30);
}

function mousePressed() {
  mouseDown = true;
}

function mouseReleased() {
  mouseDown = false;
}