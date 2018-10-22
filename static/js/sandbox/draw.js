/*                                                                            */
/*                                                 ▄▄▄▄ ▄▄▄                   */
/*                                              ▄▀▀   ▀█   █                  */
/*                                            ▄▀  ▄██████▄ █                  */
/*                                           ▄█▄█▀  ▄ ▄ █▀▀▄                  */
/*                                          ▄▀ ██▄  ▀ ▀ ▀▄ █                  */
/*       pamicel@student.42.fr              ▀▄  ▀ ▄█▄▄  ▄█▄▀                  */
/*       june 2017                            ▀█▄▄  ▀▀▀█▀ █                   */
/*                                           ▄▀   ▀██▀▀█▄▀                    */
/*                                          █  ▄▀▀▀▄█▄  ▀█                    */
/*                                          ▀▄█     █▀▀▄▄▀█                   */
/*                                           ▄▀▀▄▄▄██▄▄█▀  █                  */
/*                                          █▀ █████████   █                  */
/*                                          █  ██▀▀▀   ▀▄▄█▀                  */
/*                                           ▀▀                               */
/*                                                                            */

var wg = window.globals;
var circles = [];
var posLen = 0;
var radius;
var beginningTime;
var particuleGroup;
var type = 'letters';
var iterateArray;
var timeSlice;
var setFrameCount;
var frameCount = 0;
var loadingA = [];


// Download handler.
document.getElementById("exportSVG").onclick = function()
{
    var svg = project.exportSVG({asString:true});
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(svg);

    var link = document.createElement("a");
    link.download = "sypograph";
    link.href = url;
    link.click();

    // var json = project.exportJSON();
    // var url = "data:application/json;utf8," + encodeURIComponent(json);

    // var link = document.createElement("a");
    // link.download = "sypograph";
    // link.href = url;
    // link.click();
};

view.onFrame = function(event)
{
    if (wg.fireDraw)
    {
        wg.fireDraw = false;
        beginningTime = event.time * 1000;
        lastPartN = wg.pos.length / 2;
        iterateArray = wg[type];

        if (wg.ext)
        {
            console.log('coucou');
            for (var i = 0, len = iterateArray.length; i < len; i++)
                wg.extend(iterateArray, wg.extensionArray, i);
        }
        if (wg.extX)
            wg.extendX(iterateArray);
        if (wg.extY)
        {
            for (var i = 0, len = iterateArray.length; i < len; i++)
                wg.extendY(iterateArray, wg.extensionY, i);
        }
        if (wg.traXY)
            wg.translateXY(iterateArray);
        timeSlice = wg.recordTime / (iterateArray.length + 1);
        wg.addOffset(0, lastPartN);
        updateVisual();
    }
    if (wg.animate)
    {
        wg.animation(100);
        updateVisual();
    }
    else if (wg.animateEnd)
    {
        wg.animationToEnd(40);
        updateVisual();
    }
};

function initCircle(n)
{
    radius = wg.radius;
    var rad = wg.radii[n] * wg.scaleFactor;
    circles[n].bounds.width = radius * rad * 2;
    circles[n].bounds.height = radius * rad * 2;
    circles[n].fillColor = {hue: wg.colors[n], saturation: 0.5, brightness: 1};
    circles[n].opacity = wg.opValue;
}

function updateVisual()
{
    radius = wg.radius;
    // Check for change in number of particules.
    if (posLen != wg.pos.length)
    {
        if (wg.pos.length < posLen)
        {
            // Remove extra circles.
            var extra = (posLen - wg.pos.length) / 2;
            for(var i = 0; i < extra; i++)
                circles[circles.length - i - 1].remove();
            circles.splice(circles.length - extra, extra);
            // Update the radius of the remaining circles.
            for (var i = 0; i < circles.length; i++)
                initCircle(i);
        }
        else
        {
            // Add missing circles.
            var n = (wg.pos.length - posLen) / 2;
            for (var i = 0; i < n; i++)
                circles.push(new Path.Circle([0, 0], 1));
            // Update the radius of the circles that were kept.
            for (var i = 0; i < (circles.length - n); i++)
                initCircle(i);
        }
    }
    // Confirm that number of particules is now correct.
    posLen = wg.pos.length;
    // Position and color all circles.
    for (var i in circles)
    {
        initCircle(i);
        circles[i].position = [wg.pos[i * 2], wg.pos[i * 2 + 1]];
    }
}

function onMouseDrag(event) {
    if (project.layers.length == 0)
        return ;
    for(i in project.layers[0].children)
        project.layers[0].children[i].position += event.delta;
    wg.offsetPos.x += event.delta.x;
    wg.offsetPos.y += event.delta.y;
}