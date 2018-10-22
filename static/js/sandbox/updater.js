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

var time = 0;

wg.centerOfMass = function(firstPart, lastPart)
{
    var x = 0;
    var y = 0;

    // Assumes all particules have mass 1.
    for (let i = firstPart; i < lastPart; i++)
    {
        x += wg.pos[i * 2];
        y += wg.pos[i * 2 + 1];
    }
    x /= lastPart - firstPart;
    y /= lastPart - firstPart;
    return ([x, y]);
};

// wg.centerOfMassLetterN = function(letterN)
// {
//     if (letterN)
//         return (mapParticuleGroup(wg.letters, wg.centerOfMass, letterN));
// };

// wg.centerOfMassWordN = function(wordN)
// {
//     if (wordN)
//         return (mapParticuleGroup(wg.words, wg.centerOfMass, wordN));
// };

wg.update = function(firstPart, lastPart)
{
    let i = firstPart;
    let x, y;
    while(i < lastPart)
    {
        x = i * 2;
        y = x + 1;
        wg.pos[x] += wg.vel[x];
        wg.pos[y] += wg.vel[y];
        i++;
    }
};

function translateAll(x, y)
{
    if (!x || !y)
    {
        x = wg.offsetPos.x;
        y = wg.offsetPos.y;
    }
    for(let i = 0, len = wg.pos.length; i < len; i += 2)
    {
        wg.pos[i] += x;
        wg.pos[i + 1] += y;
        wg.posAnker[i] += x;
        wg.posAnker[i + 1] += y;
    }
}

wg.applyForces = function(firstPart, lastPart)
{
    let i = firstPart;
    let x, y;
    while(i < lastPart)
    {
        x = i * 2;
        y = x + 1;
        wg.vel[x] += wg.forces[x];
        wg.vel[y] += wg.forces[y];
        wg.forces[x] = 0;
        wg.forces[y] = 0;
        i++;
    }
    return (x / 2);
};

wg.addOffset = function(firstPart, lastPart)
{
    let i = firstPart;
    let x, y;
    while(i < lastPart)
    {
        x = i * 2;
        y = x + 1;
        wg.pos[x] += wg.offset[x];
        wg.pos[y] += wg.offset[y];
        if (wg.collision)
        {
            if ((wg.pos[x] > wg.canvasWidth && wg.offset[x] > 0) || (wg.pos[x] < 0 && wg.offset[x] < 0))
                wg.offset[x] = -wg.offset[x];
            if ((wg.pos[y] > wg.canvasHeight && wg.offset[y] > 0) || (wg.pos[y] < 0 && wg.offset[y] < 0))
                wg.offset[y] = -wg.offset[y];
        }
        i++;
    }
    return (x / 2);
};

function dotProduct(x1, y1, x2, y2)
{
    return (x1 * x2 + y1 * y2);
}

// wg.animation = function(damp) {
//     var x,
//         y,
//         dpx,
//         dpy,
//         offx,
//         offy;

//     x = 0;
//     y = 1;
//     while ((wg.offset[x] == 0 || wg.offset[y] == 0) && y < wg.offset.length)
//     {
//         x++;
//         y++;
//     }
//     dpx = wg.pos[x] - wg.posAnker[x];
//     dpy = wg.pos[y] - wg.posAnker[y];
//     offx = wg.offset[x];
//     offy = wg.offset[y];

//     let isBeyoundOrigin = dotProduct(dpx, dpy, offx, offy) < 0
//         ,
//         isBeyoundEnd = !isBeyoundOrigin && ((dpx + dpy) * (dpx + dpy)) > ((offx + offy) * (offx + offy))
//         ,
//         isBetweenOriginAndEnd = !isBeyoundOrigin && !isBeyoundEnd && dotProduct(dpx, dpy, offx, offy) >= 0
//         ,
//         isMoving = wg.vel[x] != 0 || wg.vel[y] != 0
//         ,
//         movesToOrigin = isMoving && dotProduct(wg.vel[x], wg.vel[y], dpx, dpy) < 0
//         ,
//         movesToEnd = isMoving && !movesToOrigin
//         ,
//         originOvershoot = movesToOrigin && ((dpx + dpy) * (dpx + dpy)) < ((wg.vel[x] + wg.vel[y]) * (wg.vel[x] + wg.vel[y]))
//         ,
//         endOvershoot = movesToEnd && ((dpx - offx + dpy - offy) * (dpx - offx + dpy - offy)) < ((wg.vel[x] + wg.vel[y]) * (wg.vel[x] + wg.vel[y]))
//         ,
//         tooCloseToEnd = Math.abs(dotProduct(dpx - offx, dpy - offy, offx, offy)) < 1
//         ,
//         tooCloseToOrigin = Math.abs(dotProduct(dpx, dpy, offx, offy)) < 1;

//         // if (tooCloseToOrigin)
//         //     console.log('tooCloseToOrigin');
//         // if (tooCloseToEnd)
//         //     console.log('tooCloseToEnd');

//     if (tooCloseToEnd || isBeyoundEnd || (isBetweenOriginAndEnd && (!isMoving || movesToOrigin)))
//     {
//         console.log('toOrigin');
//         wg.toOrigin(damp, originOvershoot);
//     }
//     else if (tooCloseToOrigin || isBeyoundOrigin || (isBetweenOriginAndEnd && movesToEnd))
//     {
//         console.log('toEnd');
//         wg.toEnd(damp, endOvershoot);
//     }
// };

wg.animation = function()
{
    var t,
        x,
        y,
        pos,
        o,
        off;

    t = time * 2 * Math.PI / 50;
    pos = wg.pos;
    o = wg.posAnker;
    off = wg.offset;
    for (let i = 0, len = wg.pos.length; i < len; i += 2)
    {
        x = i;
        y = i + 1;
        pos[x] = (Math.sin(t) / 2 + 1) * o[x] + (Math.sin(t + 2 * Math.PI) / 2 + 1) * (o[x] + off[x]) + wg.offsetPos.x;
        pos[y] = (Math.sin(t) / 2 + 1) * o[y] + (Math.sin(t + 2 * Math.PI) / 2 + 1) * (o[y] + off[y]) + wg.offsetPos.y;
    }
    time++;
};

// wg.animationToEnd = function(damp) {
//     var x,
//         y,
//         dpx,
//         dpy,
//         offx,
//         offy;

//     x = 0;
//     y = 1;
//     while ((wg.offset[x] == 0 || wg.offset[y] == 0) && y < wg.offset.length)
//     {
//         x++;
//         y++;
//     }
//     dpx = wg.pos[x] - wg.posAnker[x];
//     dpy = wg.pos[y] - wg.posAnker[y];
//     offx = wg.offset[x];
//     offy = wg.offset[y];
//     lp2 = (dpx + dpy) * (dpx + dpy);
//     lo2 = (offx + offy) * (offx * offy);
//     let isMoving = wg.vel[x] != 0 || wg.vel[y] != 0;
//     let movesToEnd = isMoving && dotProduct(wg.vel[x], wg.vel[y], dpx, dpy) > 0;
//     let endOvershoot = movesToEnd && ((dpx - offx + dpy - offy) * (dpx - offx + dpy - offy)) < ((wg.vel[x] + wg.vel[y]) * (wg.vel[x] + wg.vel[y]));
//     if (dotProduct(dpx, dpy, offx, offy) <= 0 || Math.abs(lp2 - lo2) > 0.1)
//         wg.toEnd(damp, endOvershoot);
//     else
//         wg.animateEnd = false;
// };

// wg.toEnd = function(damp, overshoot = false) {
//     var desire;

//     for (let i = 0, len = wg.posAnker.length; i < len; i += 2)
//     {
//         x = i;
//         y = i + 1;
//         // steering = desire - velocity
//         // mass is considered 1, so f = ma becomes f = a
//         desire = [wg.posAnker[x] + wg.offset[x] - wg.pos[x], wg.posAnker[y] + wg.offset[y] - wg.pos[y]];
//         wg.vel[x] += (desire[0] - wg.vel[x]) / damp;
//         wg.vel[y] += (desire[1] - wg.vel[y]) / damp;
//         wg.vel[x] /= (1 + overshoot * 10);
//         wg.vel[y] /= (1 + overshoot * 10);
//         wg.pos[x] += wg.vel[x];
//         wg.pos[y] += wg.vel[y];
//     }
// };

// wg.toOrigin = function(damp, overshoot = false) {
//     var desire;

//     for (let i = 0, len = wg.posAnker.length; i < len; i += 2)
//     {
//         x = i;
//         y = i + 1;
//         // steering = desire - velocity
//         // mass is considered 1, so f = ma becomes f = a
//         desire = [wg.posAnker[x] - wg.pos[x], wg.posAnker[y] - wg.pos[y]];
//         wg.vel[x] += (desire[0] - wg.vel[x]) / damp;
//         wg.vel[y] += (desire[1] - wg.vel[y]) / damp;
//         wg.vel[x] /= (1 + overshoot * 10);
//         wg.vel[y] /= (1 + overshoot * 10);
//         wg.pos[x] += wg.vel[x];
//         wg.pos[y] += wg.vel[y];
//     }
// };

// wg.friction = function(firstPart, lastPart) {
//     var x = firstPart;
//     var y = firstPart + 1;
//     while(y < lastPart)
//     {
//         wg.vel[x] *= 0.98;
//         wg.vel[y] *= 0.98;
//         x += 2;
//         y += 2;
//     }
//     return (x / 2);
// };

wg.translateXY = function(iterateArray, groupN) {
    mapParticuleGroup(iterateArray, () => {for (let i in wg.offset) {wg.offset[i] += 10;} }, groupN);
    // mapParticuleGroup(iterateArray, () => {for (i in wg.forces) {wg.forces[i] = 1;} }, groupN);
    // mapParticuleGroup(iterateArray, wg.applyForces, groupN)
};

wg.extend = function(iterateArray, extentionArray, groupN)
{
    mapParticuleGroup(iterateArray, (firstPart, lastPart) => {
        var x, y;
        var center = wg.centerOfMass(firstPart, lastPart);
        while (firstPart < lastPart)
        {
            x = firstPart * 2;
            y = firstPart * 2 + 1;
            wg.offset[x] += (wg.pos[x] - center[0]) * extentionArray[x];
            wg.offset[y] += (wg.pos[y] - center[1]) * extentionArray[y];
            firstPart++;
        }
    }, groupN);
};

wg.extendX = function(iterateArray, groupN)
{
    mapParticuleGroup(iterateArray, (firstPart, lastPart) => {
        var x;
        var center = wg.centerOfMass(firstPart, lastPart);
        while (firstPart < lastPart)
        {
            x = firstPart * 2;
            wg.offset[x] += (wg.pos[x] - center[0]) / 5;
            firstPart++;
        }
    }, groupN);
};

wg.extendY = function(iterateArray, extentionArray, groupN)
{
    mapParticuleGroup(iterateArray, (firstPart, lastPart) => {
        var y;
        var center = wg.centerOfMass(firstPart, lastPart);
        while (firstPart < lastPart)
        {
            y = firstPart * 2 + 1;
            wg.offset[y] += (wg.pos[y] - center[1]) * extentionArray[y];
            firstPart++;
        }
    }, groupN);
};

