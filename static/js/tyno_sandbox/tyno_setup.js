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

function s_addButton(name, diam, color = undefined, label = undefined)
{
    let buttons             = TYNO_WORLD.buttons;

    buttons[name] = new TypoNode(0, 0, diam);
    if (label != undefined)
        buttons[name].label = label;
    if (color != undefined)
        buttons[name].color = color;
}

function s_buttonsSetPos(height)
{
    let buttons             = TYNO_WORLD.buttons;
    let columnX             = TYNO_WORLD.buttonColumn.x;
    let colBottom           = TYNO_WORLD.buttonColumn.bottom;
    let dy                  = TYNO_WORLD.buttonColumn.spaceBetween;

    let i = 1;
    // let max = 5;
    // let ddx = 1.5;
    for (name in buttons)
    {
        buttons[name].pos.x = columnX;// * (1 + ddx * (i >= max));
        buttons[name].pos.y = height - colBottom - dy * i;// * (1 + i % max);
        buttons[name].anker.x = columnX;// * (1 + ddx * (i >= max));
        buttons[name].anker.y = height - colBottom - dy * i;//(1 + i % max);
        i++;
    }
}

function s_createButtonBar(height)
{
    let buttonSize          = TYNO_WORLD.buttonSize;
    let buttons             = TYNO_WORLD.buttons;

    s_addButton("restart",      buttonSize,     "red",          "RESTART"           );
    s_addButton("load",         buttonSize,     "yellow",       "LOAD"              );
    s_addButton("save",         buttonSize,     "green",        "SAVE"              );
    s_addButton("agitate",      buttonSize,     "lightgreen",   "SOUND\nAGITATION"  );
    s_addButton("bg",           buttonSize,     "white",        "GHOST"             );
    s_addButton("eraser",       10,             "red",          "ERASER"            );
    s_addButton("snap",         buttonSize,     "#104e8b",      "GRID SNAP"         );
    s_addButton("grid",         buttonSize,     "#104e8b",      "SHOW\nGRID"        );
    s_addButton("metrics",      buttonSize,     "lightblue",    "SHOW\nMETRICS"     );
    s_buttonsSetPos(height);
    buttons.bg.press        = function()
    {
        TYNO_WORLD.bools.background = !TYNO_WORLD.bools.background;
    };
    buttons.agitate.press   = function()
    {
        TYNO_WORLD.bools.life = !TYNO_WORLD.bools.life;
    };
    buttons.metrics.press   = function()
    {
        TYNO_WORLD.bools.editMetrics = !TYNO_WORLD.bools.editMetrics;
    };
    buttons.grid.press      = function()
    {
        TYNO_WORLD.bools.grid = !TYNO_WORLD.bools.grid;
    };
    buttons.snap.press      = function()
    {
        TYNO_WORLD.bools.gridSnap = !TYNO_WORLD.bools.gridSnap;
        if (TYNO_WORLD.buttons.snap.mass != buttonSize)
            TYNO_WORLD.buttons.snap.mass = buttonSize;
        else
            TYNO_WORLD.buttons.snap.mass = 2 * buttonSize / 3;
    };
    buttons.restart.press   = function()
    {
        TYNO_WORLD.letter.nodes.splice(0, TYNO_WORLD.letter.nodes.length);
    };
    buttons.save.press      = function()
    {
        saveLetter(TYNO_WORLD.letter);
    };
    buttons.load.press  = function()
    {
        loadLetter();
    };
}

function setup()
{
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("container");
    colorMode(HSB, 360, 100, 100);
    // framerate(100);
    TYNO_WORLD.globals.mic = new p5.AudioIn();
    TYNO_WORLD.globals.mic.start();
    TYNO_WORLD.globals.fft = new p5.FFT();
    TYNO_WORLD.globals.fft.setInput(TYNO_WORLD.globals.mic);
    TYNO_WORLD.globals.octaves = TYNO_WORLD.globals.fft.getOctaveBands(8, 700);
    TYNO_WORLD.globals.volLev = new VolLevel(20, 50);
    TYNO_WORLD.letter
        = new NodeLetter(gridSnaper(width / 2, TYNO_WORLD.globals.gridDensity),
                         gridSnaper(height / 2, TYNO_WORLD.globals.gridDensity));
    TYNO_WORLD.letterImg = loadImage("../assets/letter/letter.jpg");
    urlPath = getURLPath();
    if (urlPath.length > 1)
    {
        urlLetter = urlPath[urlPath.length - 1];
        if (urlLetter in allLetters)
            loadLetter(allLetters[urlLetter]);
    }
    // var fs = require("fs");
    // var JSONprint = fs.readFileSync("../assets/letter/letter.json", "utf-8");
    // loadLetter(JSONprint);
    s_createButtonBar(height);
    textSize(9);
    textAlign(CENTER);
}
