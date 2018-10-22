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
    if (setFrameCount)
    {
        var frameRate = 50 / 1000; // Just a guess in refresh/millisecond.
        setFrameCount = false;
        // First calculate the number of frames necessary to have a time accurate animation.
        var tmp = 0;
        for (var i = 0, len = timestamps.length; i < len; i += 2)
            tmp += timestamps[i + 1] - timestamps[i];
        tmp *= 1000;
        frameCount = Math.round(tmp * frameRate);
        // If there are n partGroups, there will be n + 1 groups of motion.
        framePerPartGroup = Math.round(frameCount / iterateArray.length);
        // Make the ratio between framePerPartGroup and frameCount exact.
        frameCount = framePerPartGroup * iterateArray.length;
        wg.offset = wg.offset.map(function(i) {return (i / (framePerPartGroup * 2))});
    }
    if (wg.fireDraw)
    {
        wg.fireDraw = false;
        setFrameCount = true;
        beginningTime = event.time * 1000;
        particuleGroup = 0;
        lastPartN = wg.pos.length / 2;
        iterateArray = wg[type];

        if (wg.ext)
        {
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
    }
    if (frameCount)
    {
        frameCount--;
        if (frameCount % framePerPartGroup == 0)
            particuleGroup++;
        if (particuleGroup != 0)
            wg.mapParticuleGroup(wg.letters, wg.addOffset, particuleGroup - 1);
        if (particuleGroup < (iterateArray.length - 1))
            wg.mapParticuleGroup(wg.letters, wg.addOffset, particuleGroup);
        updateVisual();
    }
    // if (wg.recording)
    // {
    //     fft.push();
    // }
};

function updateVisual()
{
    radius = wg.radius * wg.scaleFactor;
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
            {
                circles[i].bounds.width = radius * 2;
                circles[i].bounds.height = radius * 2;
            }
        }
        else
        {
            // Add missing circles.
            var n = (wg.pos.length - posLen) / 2;
            for (var i = 0; i < n; i++)
                circles.push(new Path.Circle([0, 0], radius));
            // Update the radius of the circles that were kept.
            for (var i = 0; i < (circles.length - n); i++)
            {
                circles[i].bounds.width = radius * 2;
                circles[i].bounds.height = radius * 2;
            }
        }
    }
    // Confirm that number of particules is now correct.
    posLen = wg.pos.length;
    // Position and color all circles.
    for (var i in circles)
    {
        circles[i].bounds.width = radius * 2;
        circles[i].bounds.height = radius * 2;
        circles[i].position = [wg.pos[i * 2], wg.pos[i * 2 + 1]];
        circles[i].fillColor = "white";
    }
}