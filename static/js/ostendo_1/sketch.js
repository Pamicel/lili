tool.minDistance = 20;
tool.maxDistance = 100;
var baseRadius = (view.size.width < view.size.height ? view.size.width : view.size.height) / 2 - 100;
var thickness = baseRadius / 20;
var circlesStyle = {
	strokeColor : '#000000',
	strokeWidth : thickness / 5
}

var path;
var innerCircle = new Shape.Circle(view.center, baseRadius * 4 / 5);
innerCircle.style = circlesStyle;
var outerCircle = new Shape.Circle(view.center, baseRadius);
outerCircle.style = circlesStyle;

function onMouseDown(event) {
	path = new Path();
	path.fillColor = '#000000';

	path.add(event.point);
}

function onMouseDrag(event) {
	var step = event.delta;
	step.angle += 90;
	step.length = thickness;

	var top = event.middlePoint + step;
	var bottom = event.middlePoint - step;
	
	var line = new Path();
	line.strokeColor = '#000000';
	line.add(top);
	line.add(bottom);

	path.add(top);
	path.insert(0, bottom);
	path.smooth();
}

function onMouseUp(event) {
	path.add(event.point);
	path.closed = true;
	path.smooth();
}