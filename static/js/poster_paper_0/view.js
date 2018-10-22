paper.view.viewSize.width = window.innerWidth;
paper.view.viewSize.height = window.innerHeight;
paper.view.autoUpdate = true;

// Create a circle shaped path with its center at the center
// of the view and a radius of 30:
var path = new Path.Circle({
	center: view.center,
	radius: 30,
	strokeColor: 'white'
});

function onResize(event) {
	// Whenever the window is resized, recenter the path:
	path.position = view.center;
    paper.view.viewSize.width = window.innerWidth;
    paper.view.viewSize.height = window.innerHeight;
}
