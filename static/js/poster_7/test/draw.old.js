
var wg = window.globals;
var circles = [];
var posLen = 0;
var radius = 5;
var beginningTime;
var animate;
var particuleGroup;
var type = 'letters';
var iterateArray;
var timeSlice;
var timePassed;

view.onFrame = function(event)
{
    if (wg.fireDraw)
    {
        wg.fireDraw = false;
        beginningTime = event.time * 1000;
        animate = true;
        particuleGroup = 0;
        firstPart = true;
        lastPartN = wg.pos.length / 2;
        iterateArray = wg[type];
        wg.module1(iterateArray);
        timeSlice = wg.recordTime / (iterateArray.length + 1);
    }
    if (animate)
    {
        timePassed = event.time * 1000 - beginningTime;
        if ((particuleGroup >= (iterateArray.length)) || (timePassed > wg.recordTime))
        {
            animate = false;
            return;
        }
        if (particuleGroup == 0 && (timeSlice < timePassed))
        {
            firstPart = false;
        }
        if ((!firstPart) &&
            (particuleGroup < iterateArray.length - 1) &&
            (((particuleGroup + 1) * timeSlice) < timePassed)   )
        {
            particuleGroup++;
        }
        if ((firstPart && particuleGroup == 0) || (particuleGroup == iterateArray.length - 1))
        {
            wg.mapParticuleGroup(wg.letters, wg.applyForces, particuleGroup);
            wg.mapParticuleGroup(wg.letters, wg.update, particuleGroup);
        }
        else
        {
            wg.mapParticuleGroup(wg.letters, wg.applyForces, particuleGroup);
            wg.mapParticuleGroup(wg.letters, wg.applyForces, particuleGroup + 1);
            wg.mapParticuleGroup(wg.letters, wg.update, particuleGroup);
            wg.mapParticuleGroup(wg.letters, wg.update, particuleGroup + 1);
        }
        updateVisual();
        wg.friction(0, lastPartN);
    }
};

function updateVisual()
{
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
        }
        else
        {
            // Add missing circles.
            var n = (wg.pos.length - posLen) / 2;
            for (var i = 0; i < n; i++)
                circles.push(new Path.Circle([0, 0], RADIUS));
        }
    }
    // Confirm that number of particules is now correct.
    posLen = wg.pos.length;
    // Position and color all circles.
    for (i in circles)
    {
        circles[i].position = [wg.pos[i * 2], wg.pos[i * 2 + 1]];
        circles[i].fillColor = "blue";
    }
}