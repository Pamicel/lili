var values = {
    paths: 10,
    minPoints: 5,
    maxPoints: 15,
    minRadius: 30,
    maxRadius: 90
};

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

circle = new Shape.Circle({
    center: [view.size.width / 2, view.size.height / 2],
    radius: view.size.height / 3,
    fillColor: 'white',
    shadowColor: 'grey',
    shadowBlur: 20,
    shadowOffset: new Point(10, 10)});

blendModes = ['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten', 'difference', 'exclusion', 'hue', 'saturation', 'luminosity', 'color', 'add', 'subtract', 'average', 'pin-light', 'negation', 'source- over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darker', 'copy', 'xor']

var layer2 = new Layer();
createPaths();

function createPaths() {
    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    for (var i = 0; i < values.paths; i++) {
        var radius = values.minRadius + Math.random() * radiusDelta;
        var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
        var path = createBlob(view.size * Point.random(), radius, points);
        // var lightness = (Math.random() - 0.5) * 0.4 + 0.4;
        var hue = Math.random() * 360;
        path.fillColor = { hue: hue, saturation: 255, lightness: 255};
        path.blendMode = 'subtract';
        // path.strokeColor = 'black';
    };
}

function createBlob(center, maxRadius, points) {
    var path = new Path();
    path.closed = true;
    for (var i = 0; i < points; i++) {
        var delta = new Point({
            length: (maxRadius * 0.5) + (Math.random() * maxRadius * 0.5),
            angle: (360 / points) * i
        });
        path.add(center + delta);
    }
    // path.smooth();
    return path;
}

var segment, path;
var movePath = false;
function onMouseDown(event) {
    segment = path = null;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult)
        return;

    if (event.modifiers.shift) {
        if (hitResult.type == 'segment') {
            hitResult.segment.remove();
        };
        return;
    }

    if (hitResult) {
        path = hitResult.item;
        if (hitResult.type == 'segment') {
            segment = hitResult.segment;
        } else if (hitResult.type == 'stroke') {
            var location = hitResult.location;
            segment = path.insert(location.index + 1, event.point);
            // path.smooth();
        }
    }
    movePath = hitResult.type == 'fill';
    if (movePath)
        project.activeLayer.addChild(hitResult.item);
}

function onMouseMove(event) {
    project.activeLayer.selected = false;
    if (event.item && event.item.type != "circle")
        event.item.selected = true;
}

function onMouseDrag(event) {
    if (path === circle)
        return ;
    if (segment) {
        segment.point += event.delta;
        // path.smooth();
    } else if (path) {
        path.position += event.delta;
    }
}