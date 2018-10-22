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

wg.friction = function(firstPart, lastPart)
{
    var x = firstPart;
    var y = firstPart + 1;
    while(y < lastPart)
    {
        wg.vel[x] *= 0.98;
        wg.vel[y] *= 0.98;
        x += 2;
        y += 2;
    }
    return (x / 2);
};

wg.translateXY = function(iterateArray, groupN)
{
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

