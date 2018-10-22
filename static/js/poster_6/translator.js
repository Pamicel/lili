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

function parsetext(text = '') // Argument for debugging purposes
{
    const Y_START = 20;
    var lineIndex,
        wordIndex,
        nParticules,
        xShift,
        yShift,
        lineWidth,
        len;

    ///////////////////////////////////////////
    // Debug utility
    wg.text = text;
    ///////////////////////////////////////////

    lineIndex = 0;
    wordIndex = 0;
    nParticules = 0;
    xShift = 0;
    yShift = Y_START;
    lineWidth = 0;
    len = wg.text.length;

    // Reinitialise environment:
    wg.maxLineWidth = 0;
    wg.lines = [[[]]];
    wg.pos = [];
    wg.vel = [];
    wg.forces = [];
    wg.offset = [];
    wg.posAnker = [];
    wg.linesCount = 1; // Assumes there is at least one line
    wg.wordsCount = 1; // and one word (both corrected after parsing).
    wg.lettersCount = 0;
    
    for (let i = 0; i < len; i++)
    {
        if (wg.text[i] == '\n')
        {
            // Add a line.
            wg.lines.push([[]]);
            lineIndex++;
            wordIndex = 0;
            nParticules = 0;
            xShift = 0;
            yShift = wg.lineHeight * lineIndex;
            if (lineWidth > wg.maxLineWidth)
                wg.maxLineWidth = lineWidth;
            lineWidth = 0;
        }
        else if (wg.text[i] == ' ')
        {
            // Add a word.
            lineWidth += wg.spaceWidth;
            xShift += wg.spaceWidth;
            while(wg.text[i + 1] == ' ')
            {
                i++;
                lineWidth += wg.spaceWidth;
                xShift += wg.spaceWidth;
            }
            wg.lines[lineIndex].push([]);
            wordIndex++;
            wg.wordsCount++;
        }
        else
        {
            // Add a letter.
            let letter = allLetters[wg.text[i]];
            if (letter)
            {
                wg.lettersCount++;
                lineWidth += letter.dimensions.encombrement;
                nParticules= letter.pastilles.length;
                wg.lines[lineIndex][wordIndex].push(nParticules);
                for (let i = 0; i < nParticules; i++)
                {
                    let x = letter.pastilles[i].x + xShift + letter.dimensions.encombrement / 2;
                    let y = letter.pastilles[i].y + yShift + letter.dimensions.hcorps / 2;
                    wg.pos.push(x, y);
                    wg.posAnker.push(x, y);
                    wg.vel.push(0, 0);
                    wg.forces.push(0, 0);
                    wg.offset.push(0, 0);
                }
                xShift += letter.dimensions.encombrement;
            }
        }
    }
    wg.linesCount += lineIndex;
    // If needed, the following if stmt corrects the assumption made above that
    // there was at least one word and one line.
    if (wg.lettersCount === 0)
    {
        wg.linesCount = 0;
        wg.wordsCount = 0;
    }
    // Save the dimensions in the global object
    wg.totalHeight = wg.lineHeight * wg.lines.length;
    // In case there is only one line and no '/n'.
    if (lineWidth > wg.maxLineWidth)
        wg.maxLineWidth = lineWidth;
    // Create the letters and words arrays for easy iteration on letters and words.
    setLetters();
    setWords();
    // Always immediatly scale at the end of a parsing.
    scaleText();
    return (wg.pos.length);
}

/*
 * setLetter
 *
 *  wg.letters is an array of particule indices as such :
 *  [    start_of_letter[0],
 *       start_of_letter[1] === end_of_letter[0] + 1, 
 *       start_of_letter[2] === end_of_letter[1] + 1,
 *       ...
 *       start_of_letter[n] === end_of_letter[n - 1] + 1,
 *       ...
 *       end_of_all_letters + 1  ]
 *
 */
function setLetters()
{
    var tot;

    wg.letters = [0];
    tot = 0;
    for (let lineN in wg.lines)
        for (let wordN in wg.lines[lineN])
            for (let letterN in wg.lines[lineN][wordN])
            {
                tot += wg.lines[lineN][wordN][letterN];
                wg.letters.push(tot);
            }
}

/*
 * setWords
 *
 *  wg.words is an array of particule indices as such :
 *  [    start_of_word[0],
 *       start_of_word[1] === end_of_word[0] + 1, 
 *       start_of_word[2] === end_of_word[1] + 1,
 *       ...
 *       start_of_word[n] === end_of_word[n - 1] + 1,
 *       ...
 *       end_of_all_words + 1  ]
 *
 */
function setWords()
{
    var tot;

    wg.words = [0];
    tot = 0;
    for (let lineN in wg.lines)
        for (let wordN in wg.lines[lineN])
        {
            for (let letterN in wg.lines[lineN][wordN])
            {
                tot += wg.lines[lineN][wordN][letterN];
            }
            wg.words.push(tot);
        }
}

function scaleText()
{
    var vw,
        vh,
        txtW,
        txtH,
        widthRatio,
        heightRatio,
        scale;

    function scaleUni(array) {
        array = array.map((val) => {return (val * scale);});
        return (array);
    }

    vw = wg.canvasWidth;
    vh = wg.canvasHeight;
    txtW = wg.maxLineWidth;
    txtH = wg.totalHeight;
    widthRatio = vw / txtW;
    heightRatio = vh / txtH;
    scale = (widthRatio < heightRatio) ? widthRatio : heightRatio;
    if (scale < 1)
    {
        wg.pos = scaleUni(wg.pos);
        wg.vel = scaleUni(wg.vel);
        wg.posAnker = scaleUni(wg.posAnker);
        wg.scaleFactor = scale;
    }
    else
        wg.scaleFactor = 1;
}

// function unScaleText() {
//     function unScale2D(array) {
//         array = array.map(([x, y]) => {return ([x / wg.scaleFactor, y / wg.scaleFactor])});
//         return (array);
//     }

//     if (wg.scaleFactor < 1)
//     {
//         wg.pos = unScale2D(wg.pos);
//         wg.vel = unScale2D(wg.vel);
//         wg.posAnker = unScale2D(wg.posAnker);
//         wg.scaleFactor = 1;
//     }
// }

mapParticuleGroup = function(iterateArray, func, groupN)
{
    var firstPart, lastPart;
    if (groupN != undefined)
    {
        if (groupN === iterateArray.length - 1)
            return ;
        firstPart = iterateArray[groupN];
        lastPart = iterateArray[groupN + 1];
    }
    else
    {
        firstPart = 0;
        lastPart = iterateArray[iterateArray.length - 1];
    }
    return (func(firstPart, lastPart));
};

function addaptToLetters(array)
{
    var res;

    if (array.length < wg.letters.length)
        return ;
    res = [];
    for (let i = 0, len = wg.letters.length; i < len; i++)
    {
        let np = mapParticuleGroup(wg.letters, (fp, lp) => (lp - fp), i);
        while (np--)
            res.push(array[i], array[i]);
    }
    return (res);
}

function translator()
{
    return (new Promise((resolve, reject) => {
            if (parsetext(wg.text) != 0)
                resolve('done');
            else
                reject('Parsed an empty text');
        }));
}

function parseAndDraw()
{
    translator().then(function(val)
        {
            wg.ext = document.getElementById('extendCheck').checked;
            // wg.extendX = document.getElementById('extendXCheck').checked;
            // wg.extendY = document.getElementById('extendYCheck').checked;
            // wg.translate = document.getElementById('translateXYCheck').checked;

            wg.text = finalTranscript;

            // Volume to extension.
            // Choose your array by hand my friend.
            var eA;
            var cutVol;
            cutVol = cutArray(timestamps, wg.recordTime / 1000, wg.volume);
            eA = sampleArrayMax(cutVol, wg.pos.length);
            eA = sampleArray(eA, wg.letters.length);
            eA = addaptToLetters(eA);
            // display(eA, smoothArray(eA, .2));
            // eA = smoothArray(eA, .85);
            var extValue = Number(document.getElementById('extValue').value);
            if (!extValue)
                var extValue = 1;
            eA = eA.map(function(x) {return (x * extValue * wg.scaleFactor);});
            wg.extensionArray = eA;

            var radValue = Number(document.getElementById('radValue').value);
            console.log(radValue);
            wg.radii = sampleArray(cutVol, wg.pos.length / 2);
            // console.log(centerScaleArray(wg.radii, radValue, radValue));
            wg.radii = centerScaleArray(wg.radii, radValue, radValue);
            // console.log(wg.extensionArray);
            
            // Volume diff to extensionY
            wg.extensionY = differentiateArray(wg.extensionArray);
            wg.extensionY = sampleArray(wg.extensionY, wg.pos.length);

            // FFT centroid to color
            //! TO DO
            wg.fireDraw = true;
        })
                .catch((reason) => {console.log(reason);});
}
