var values = {
    minPoints:  5,
    maxPoints:  10,
    minRadius:  150,
    maxRadius:  200
};

var couleursCapsule = [ {hue: 196, saturation:  .79, brightness: 1.00 },
                        {hue: 304, saturation: 1.00, brightness:  .49 },
                        {hue:   2, saturation:  .89, brightness: 1.00 }  ];

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

function download()
{
    var svg = project.exportSVG({asString:true});
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(svg);

    var link = document.createElement("a");
    link.download = "yourlogo";
    link.href = url;
    link.click();

    var json = project.exportJSON();
    var url = "data:application/json;utf8," + encodeURIComponent(json);

    var link = document.createElement("a");
    link.download = "yourlogo";
    link.href = url;
    link.click();
}

downloadButton = new Shape.Circle({
    center: [20, 20],
    radius: 10,
    fillColor: couleursCapsule[0],
    // shadowColor: 'grey',
    // shadowBlur: 20,
    // shadowOffset: new Point(10, 10)
});

circle = new Shape.Circle({
    center: [view.size.width / 2, view.size.height / 2],
    radius: values.maxRadius * 6 / 5,
    fillColor: 'white',
    strokeColor: couleursCapsule[0],
    strokeWidth: 20
});

blendModes = ['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten', 'difference', 'exclusion', 'hue', 'saturation', 'luminosity', 'color', 'add', 'subtract', 'average', 'pin-light', 'negation', 'source- over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darker', 'copy', 'xor']

var layer2 = new Layer();
createPaths();

function createPaths() {
    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    for (var i = 0; i < 2; i++) {
        var radius = values.minRadius + Math.random() * radiusDelta;
        var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
        var path = createBlob(circle.position, radius, points, i == 0);
        path.fillColor = couleursCapsule[Math.floor(Math.random() * 3)];
        path.blendMode = 'multiply';
    };
}

function createBlob(center, maxRadius, points, smooth) {
    var path = new Path();
    path.closed = true;
    for (var i = 0; i < points; i++) {
        var delta = new Point({
            length: (maxRadius * 0.5) + (Math.random() * maxRadius * 0.5),
            angle: (360 / points) * i
        });
        path.add(center + delta);
    }
    if (smooth)
        path.smooth();
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
        if (hitResult.item == circle)
            return ;
        if (hitResult.item == downloadButton)
            download();
        path = hitResult.item;
        if (hitResult.type == 'segment') {
            segment = hitResult.segment;
        } else if (hitResult.type == 'stroke') {
            var location = hitResult.location;
            segment = path.insert(location.index + 1, event.point);
            if (pathOptions.smooth)
                path.smooth();
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
        if (pathOptions.smooth)
            path.smooth();
    } else if (path) {
        path.position += event.delta;
    }
}