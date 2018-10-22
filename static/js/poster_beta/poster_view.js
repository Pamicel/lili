/*                                                                            */
/*                                                 ▄▄▄▄ ▄▄▄                   */
/*                                              ▄▀▀   ▀█   █                  */
/*                                            ▄▀  ▄██████▄ █                  */
/*                                           ▄█▄█▀  ▄ ▄ █▀▀▄                  */
/*                                          ▄▀ ██▄  ▀ ▀ ▀▄ █                  */
/*       pamicel@student.42.fr              ▀▄  ▀ ▄█▄▄  ▄█▄▀                  */
/*       march 2017                           ▀█▄▄  ▀▀▀█▀ █                   */
/*                                           ▄▀   ▀██▀▀█▄▀                    */
/*                                          █  ▄▀▀▀▄█▄  ▀█                    */
/*                                          ▀▄█     █▀▀▄▄▀█                   */
/*                                           ▄▀▀▄▄▄██▄▄█▀  █                  */
/*                                          █▀ █████████   █                  */
/*                                          █  ██▀▀▀   ▀▄▄█▀                  */
/*                                           ▀▀                               */
/*                                                                            */

// DRAW FUNCTIONS //////////////////////////////////////////////////////////////

function d_showLetters(connectionsThickness, hue, sat, bri, opacity, k = 1)
{
    var letters                 = POSTER_WORLD.letters;
    if (letters.length > 0)
    {
        var width                   = POSTER_WORLD.globals.width;
        var height                  = POSTER_WORLD.globals.height;
        var interL                  = POSTER_WORLD.interlignage;
        var nLines                  = POSTER_WORLD.linesWidth.length;
        var paddingSides = 100;
        var paddingTop = 100;
        var nLetter = 0;
        var maxW = max(POSTER_WORLD.linesWidth);
        var h = paddingTop + letters[0].dimensions.hcorps / 2;

        push();
        var scaleFactor = min(height / (nLines * interL + paddingTop * 2), width / (maxW + paddingSides * 2));
        if (scaleFactor < 1)
        {
            translate(width / 2, 0);
            scale(scaleFactor);
            translate(- maxW / 2, 0);
        }
        else
            translate(width / 2 - maxW / 2 - paddingSides / 2, 0);
        for (let i in POSTER_WORLD.linesNLetters)
        {
            let len = POSTER_WORLD.linesNLetters[i];
            let w = 0;

            for (let j = 0; j < len; j++)
            {
                w += letters[nLetter].dimensions.encombrement / 2;
                letters[nLetter].update(k);
                letters[nLetter].show(connectionsThickness, hue, sat, bri, opacity, w, h);
                w += letters[nLetter].dimensions.encombrement / 2;
                nLetter++;
            }
            h += POSTER_WORLD.interlignage;
        }
        pop();
    }
    POSTER_WORLD.bools.parsed = true;
}

// DRAW  // // // // // // // // // //

function draw()
{
    if (!POSTER_WORLD.bools.parsed)
        parseTextarea();
    let isBackgroundOn      = POSTER_WORLD.bools.background;
    let lifeOn              = POSTER_WORLD.bools.life;
    var oct                 = POSTER_WORLD.globals.octaves;
    let spectrum            = POSTER_WORLD.globals.fft.analyze();
    let logAv               = POSTER_WORLD.globals.fft.logAverages(oct);
    var centroid            = POSTER_WORLD.globals.fft.getCentroid();
    var vol                 = 0;
    const HFFT = 100;
    const WFFT = 200;
    const MIDFFT = 700;
    const MINHSB = 0;
    const MAXHSB = 270;
    const FMAX = 8000;
    const FMIN = 100;
    // let k                   = log(centroid) / 3;

    if (isBackgroundOn)
        background(0);
    else
    {
        push();
        fill(0, 0, 0, .1);
        rect(0, 0, width, height);
        pop();
    }
    if (lifeOn)
    {
        vol = POSTER_WORLD.globals.mic.getLevel();
        volAgitation = POSTER_WORLD.agitationLevel * vol;
        if (vol < 0.003)
            centroid = MIDFFT;
        for (let i = 0; i < POSTER_WORLD.letters.length; i++)
        {
            POSTER_WORLD.letters[i].expandNodes(volAgitation * 50);
            if (centroid < 600)
            {
                POSTER_WORLD.letters[i].expandLetter(volAgitation);
                POSTER_WORLD.letters[i].expandLinks(volAgitation);
            }
            else if (centroid > 800)
            {
                POSTER_WORLD.letters[i].shrinkLetter(volAgitation);
            }
            POSTER_WORLD.globals.volLev.show(volAgitation * 1, width, height, POSTER_WORLD);
        }
    }
    else
        centroid = MIDFFT;
    var hue = map(constrain(centroid, FMIN, FMAX), FMIN, FMAX, MINHSB, MAXHSB);
    d_showLetters(0, hue, 100, 100, vol == 0 ? 1 : vol + 0.3);

    /////////////////////////////////////////////
    // fft
    var centroidplot = 0.0;
    //draw the spectrum
    fill('white');
    noStroke();
    for (var i = 0; i< spectrum.length; i++)
    {
        var x = map(log(i), 0, log(spectrum.length), width - WFFT, width);
        var h = map(spectrum[i], 0, 255, 0, HFFT);
        var rectangle_width = (log(i + 1) - log(i)) * (width / log(spectrum.length));
        rect(x, 0, rectangle_width, h)
    }
    // the mean_freq_index calculation is for the display.
    var nyquist = 22050;
    var mean_freq_index = centroid / (nyquist / spectrum.length);
    centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), width - WFFT, width);
    var mean_freq_indexMIN = FMIN / (nyquist / spectrum.length);
    centroidplotMIN = map(log(mean_freq_indexMIN), 0, log(spectrum.length), width - WFFT, width);
    var mean_freq_indexMID = MIDFFT / (nyquist / spectrum.length);
    centroidplotMID = map(log(mean_freq_indexMID), 0, log(spectrum.length), width - WFFT, width);
    var mean_freq_indexMAX = FMAX / (nyquist / spectrum.length);
    centroidplotMAX = map(log(mean_freq_indexMAX), 0, log(spectrum.length), width - WFFT, width);

    stroke('blue');
    strokeWeight(2);
    line(centroidplot, 0, centroidplot, HFFT);
    line(centroidplotMIN, 0, centroidplotMIN, HFFT);
    line(centroidplotMID, 0, centroidplotMID, HFFT);
    line(centroidplotMAX, 0, centroidplotMAX, HFFT);
    noStroke();
}
