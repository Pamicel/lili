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

function setupAllLetters()
{
    let newObj = {};
    for (letter in allLetters)
        newObj[letter] = engrave(JSON.parse(allLetters[letter]));
    allLetters = newObj;
}

// function addLetter(letter, h)
// {
//     let letters = POSTER_WORLD.letters;
//     let w = 0;
//
//     letters.push(engrave(JSON.parse(letter)));
//     for (i in letters)
//         w += letters[i].dimensions.encombrement;
//     // console.log(w);
//     let last = letters.length - 1;
//     letters[last].setPosition(w + letters[last].dimensions.encombrement / 2, h / 2);
// }

var switchButton = {
    radius : 10,
    posx : undefined,
    posy : undefined,
    setup : function(x, y) {
        this.posx = x;
        this.posy = y;
    },
    press : function() {
        switchBackground();
    },
    isClicked : function(x, y) {
        return (x < this.posx + this.radius &&
                x > this.posx - this.radius &&
                y < this.posy + this.radius &&
                y > this.posy - this.radius );
    },
    show : function() {
        push();
        fill('lightblue');
        ellipse(this.posy, this.posy, this.radius * 2, this.radius * 2);
        pop();
    }
}

function parseTextarea()
{
    POSTER_WORLD.text = document.getElementById('textarea').value;
    POSTER_WORLD.letters = [];
    POSTER_WORLD.linesWidth = POSTER_WORLD.text.split('\n');
    POSTER_WORLD.linesNLetters = [];
    var tmpLinesWid = [];

    for (l in POSTER_WORLD.linesWidth)
    {
        let w = 0;
        let len = POSTER_WORLD.linesWidth[l].length;
        var notChars = 0;
        for (var nthChar = 0; nthChar < len; nthChar++)
        {
            if (allLetters[POSTER_WORLD.linesWidth[l][nthChar]])
            {
                let letter = engrave(new Punch(allLetters[POSTER_WORLD.linesWidth[l][nthChar]]));
                w += letter.dimensions.encombrement;
                POSTER_WORLD.letters.push(letter);
            }
            else
                notChars++;
        }
        POSTER_WORLD.linesNLetters[l] = nthChar - notChars;
        tmpLinesWid.push(w);
    }
    POSTER_WORLD.linesWidth = tmpLinesWid;
    POSTER_WORLD.bools.parsed = true;
}

function setup()
{
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("container");
    colorMode(HSB, 360, 100, 100);
    // framerate(100);
    setupAllLetters();
    POSTER_WORLD.globals.mic = new p5.AudioIn();
    POSTER_WORLD.globals.mic.start();
    POSTER_WORLD.globals.fft = new p5.FFT();
    POSTER_WORLD.globals.fft.setInput(POSTER_WORLD.globals.mic);
    POSTER_WORLD.globals.octaves = POSTER_WORLD.globals.fft.getOctaveBands(8, 700);
    POSTER_WORLD.globals.volLev = new VolLevel(20, 50);
    POSTER_WORLD.globals.width = width;
    POSTER_WORLD.globals.height = height;
    POSTER_WORLD.letters = [];

    urlPath = getURLPath();
    switchButton.setup(40, height - 40);
    textSize(9);
    textAlign(CENTER);
}
