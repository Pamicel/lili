var diamond;

window.onload = function()
{
    const R = 200;
    const PADDING = 20;
    // var container = document.getElementById("container")
    container.style.padding = PADDING;
    var canvas = document.getElementById('canvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    diamond = { 
        points  : [],
        paths   : []
    };
    // Create 7 coord 'equally spaced' on a circle.
    var pointsCoord =  [    0    , - 1     ,            // PI / 2
                            0.782, - 0.626 ,            // PI / 2 - 2 * PI / 7
                            0.975,   0.223 ,            // PI / 2 - 4 * PI / 7
                            0.434,   0.901 ,            // PI / 2 - 6 * PI / 7
                          - 0.434,   0.901 ,            // PI / 2 + 6 * PI / 7
                          - 0.975,   0.223 ,            // PI / 2 + 4 * PI / 7
                          - 0.782, - 0.626      ];      // PI / 2 + 2 * PI / 7
    // Put them around the circle of radius R.
    var pointsCoord = pointsCoord.map((e) => {return (e * R)});
    // Translate coord to the center of the canvas and create the Point objects.
    var translateX = canvas.width / 2;
    var translateY = canvas.height / 2;
    var centerPoint = new paper.Point(translateX, translateY);
    for (let i = 0; i < pointsCoord.length; i += 2)
    {
        pointsCoord[i]      += translateX;
        pointsCoord[i + 1]  += translateY;
        diamond.points.push(new paper.Point(pointsCoord[i], pointsCoord[i + 1]));
    }
    // Create the shapes.
    for (let i = 0; i < diamond.points.length; i++)
    {
        let n1 = i;
        let n2 = (i + 1) % diamond.points.length;
        var p = new paper.Path();
        p.add(diamond.points[n1]);
        p.add(diamond.points[n2]);
        p.add(centerPoint);
        p.strokeColor = "white";
        p.closed = true;
        diamond.paths.push(p);
    }
    // Draw the view now:
    paper.view.draw();
}