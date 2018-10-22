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

function d_showLetter(connectionsThickness)
{
    let letter               = TYNO_WORLD.letter;

    letter.update(1);
    letter.show(connectionsThickness);
}

function d_eraserShow()
{
    let eraserHold          = TYNO_WORLD.bools.eraserHold;
    let eraser              = TYNO_WORLD.buttons.eraser;
    let textOff             = TYNO_WORLD.buttonColumn.textOff;

    if (!eraserHold)
    {
        eraser.applyForce(eraser.arrive(eraser.anker));
        eraser.update();
        eraser.show("red");
    }
    else
        eraser.show("lightblue");
    if (eraser.isAround(eraser.anker.x, eraser.anker.y))
    {
        push();
        strokeWeight(1);
        fill(eraser.color);
        text(eraser.label, eraser.anker.x, eraser.anker.y + textOff);
        pop();
    }
}

function d_agitation(vol)
{
    let nodes               = TYNO_WORLD.letter.nodes;
    let agitation           = TYNO_WORLD.agitationLevel;
    let agitateButton       = TYNO_WORLD.buttons.agitate;

    for (let i = 0; i < nodes.length; i++)
        nodes[i].applyForce(nodes[i].agitate(vol * agitation));
    agitateButton.applyForce(agitateButton.agitate(1));
}

function d_showButton(button, crossed = false)
{
    let textOff             = TYNO_WORLD.buttonColumn.textOff;

    if (crossed)
        crossedButton(button);
    else
        button.show();
    if (button.label != undefined)
    {
        push();
        fill(button.color);
        strokeWeight(1);
        text(button.label, button.pos.x, button.pos.y + textOff);
        pop();
    }
}

function crossedButton(button)
{
    push();
    strokeWeight(1);
    stroke(button.color);
    let x1 = button.pos.x - button.mass / 2;
    let y1 = button.pos.y - button.mass / 2;
    let x2 = button.pos.x + button.mass / 2;
    let y2 = button.pos.y + button.mass / 2;
    line(x1, y1, x2, y2);
    line(x1, y2, x2, y1);
    noFill();
    ellipse(button.pos.x, button.pos.y, button.mass, button.mass);
    pop();
}

function d_agitateShow()
{
    let button              = TYNO_WORLD.buttons.agitate;
    let lifeOn              = TYNO_WORLD.bools.life;
    let textOff             = TYNO_WORLD.buttonColumn.textOff;

    button.applyForce(button.arrive(button.anker));
    button.update();
    button.show();
    if (!lifeOn)
    {
        push();
        strokeWeight(1);
        fill(button.color);
        text(button.label, button.pos.x, button.pos.y + textOff);
        pop();
    }
}

function d_holdingNode(attachAnker)
{
    let letter              = TYNO_WORLD.letter;
    let center              = letter.center;
    let nod                 = letter.nodes[TYNO_WORLD.globals.nHeld];
    let ankerIsAttached     = TYNO_WORLD.bools.attachAnker;
    let gridSnapOn          = TYNO_WORLD.bools.gridSnap;
    let density             = TYNO_WORLD.globals.gridDensity;

    if (!ankerIsAttached)
        nod.showAnker(-center.pos.x, -center.pos.y);
    followPosition(nod, mouseX - center.pos.x, mouseY - center.pos.y, ankerIsAttached, gridSnapOn, density);
    letter.connectToCloseNodes(nod);
}

function d_holdingCenter(attachAnker)
{
    let center              = TYNO_WORLD.letter.center;
    let ankerIsAttached     = TYNO_WORLD.bools.attachAnker;
    let clickAnimDiam       = center.mass * 2 / TYNO_WORLD.clocks.clicked;
    let gridSnapOn          = TYNO_WORLD.bools.gridSnap;
    let density             = TYNO_WORLD.globals.gridDensity;

    if (!ankerIsAttached)
    {
        center.showAnker();
        if ((TYNO_WORLD.clocks.clicked += 0.1) < 1.5)
        {
            push();
            noFill();
            stroke(center.color);
            strokeWeight(1);
            ellipse(center.pos.x, center.pos.y, clickAnimDiam, clickAnimDiam);
            pop();
        }
    }
    followPosition(center, mouseX, mouseY, ankerIsAttached, false, density);
}

function d_drawGrid()
{
    let den                 = TYNO_WORLD.globals.gridDensity;

    push();
    stroke(TYNO_WORLD.buttons.grid.color);
    strokeWeight(1);
    for (let i = 1 / den; i < width; i += 1 / den)
        line(i, 0, i, height);
    for (let i = 1 / den; i < height; i += 1 / den)
        line(0, i, width, i);
    pop();
}

// DRAW  // // // // // // // // // //

// var win1 = new Win([], 400, 100, "return force");
// var win2 = new Win([], 400, 100, "expansionRate");

function draw()
{
    var isBackgroundOn      = TYNO_WORLD.bools.background;
    var isGridOn            = TYNO_WORLD.bools.grid;
    var lifeOn              = TYNO_WORLD.bools.life;
    var isHolding           = TYNO_WORLD.bools.holding;
    var isHoldingEraser     = TYNO_WORLD.bools.eraserHold;
    var isHoldingCenter     = TYNO_WORLD.bools.centerHold;
    var editMetrics         = TYNO_WORLD.bools.editMetrics;
    var eraser              = TYNO_WORLD.buttons.eraser;
    var buttons             = TYNO_WORLD.buttons;
    var columnX             = TYNO_WORLD.buttonColumn.x;
    var columnW             = TYNO_WORLD.buttonColumn.w;
    var columnTop           = height;
    var vol;
    var oct                 = TYNO_WORLD.globals.octaves;
    TYNO_WORLD.globals.fft.analyze();
    var logAv               = TYNO_WORLD.globals.fft.logAverages(oct);
    var centroid            = TYNO_WORLD.globals.fft.getCentroid();
    const FMID = 700;


    for (name in buttons)
    {
        if (columnTop > buttons[name].pos.y)
            columnTop = buttons[name].pos.y;
    }
    columnTop -= TYNO_WORLD.buttonSize * 2;

    if (isBackgroundOn)
        background(0);
    else
    {
        push();
        fill(0, 0, 0, .1);
        rect(0, 0, width, height);
        pop();
    }
    push();
    if (isGridOn)
    {
        d_drawGrid();
        stroke(TYNO_WORLD.buttons.grid.color);
        strokeWeight(1);
    }
    if(editMetrics)
    {
        TYNO_WORLD.letter.showCenter();
        TYNO_WORLD.letter.showDimensions(height, width);
        if (keyIsPressed && !lifeOn)
        {
            let nodes = TYNO_WORLD.letter.nodes;
            if (keyIsDown(LEFT_ARROW))
                for (let i = 0; i < nodes.length; i++)
                    {
                        nodes[i].anker.x -= 1;
                        nodes[i].pos.x -= 1;
                    }
            if (keyIsDown(RIGHT_ARROW))
                for (let i = 0; i < nodes.length; i++)
                    {
                        nodes[i].anker.x += 1;
                        nodes[i].pos.x += 1;
                    }
            if (keyIsDown(UP_ARROW))
                for (let i = 0; i < nodes.length; i++)
                    {
                        nodes[i].anker.y -= 1;
                        nodes[i].pos.y -= 1;
                    }
            if (keyIsDown(DOWN_ARROW))
                for (let i = 0; i < nodes.length; i++)
                    {
                        nodes[i].anker.y += 1;
                        nodes[i].pos.y += 1;
                    }
        }
    }
    fill(0);
    rect(columnX - columnW / 2, 0, columnW, height);
    rect(columnX - columnW / 2, columnTop, columnW, height);
    pop();
    if (lifeOn)
    {
        vol = TYNO_WORLD.globals.mic.getLevel();
        volAgitation = TYNO_WORLD.agitationLevel * vol;
        if (vol < 0.003)
            centroid = FMID;
        // TYNO_WORLD.letter.expandNodes(volAgitation);
        if (centroid < 600)
        {
            TYNO_WORLD.letter.expandLetter(volAgitation);
            TYNO_WORLD.letter.expandLinks(volAgitation);
        }
        else if (centroid > 800)
            TYNO_WORLD.letter.shrinkLetter(volAgitation);
        TYNO_WORLD.globals.volLev.show(vol * 2, width, height, TYNO_WORLD);
        d_showLetter(1);
    }
    else
    {
        imageMode(CENTER);
        // image(TYNO_WORLD.letterImg, width / 2, height / 2);
        d_showLetter(70);
    }
    d_eraserShow();
    d_showButton(buttons.bg);
    d_showButton(buttons.restart, true);
    d_agitateShow();
    d_showButton(buttons.grid);
    d_showButton(buttons.snap);
    d_showButton(buttons.metrics);
    d_showButton(buttons.save, true);
    d_showButton(buttons.load, true);
    if (isHolding)
    {
        if (isHoldingEraser)
            followPosition(eraser, mouseX, mouseY, false);
        else if (isHoldingCenter)
            d_holdingCenter(TYNO_WORLD.bools.attachAnker);
        else
            d_holdingNode(TYNO_WORLD.bools.attachAnker);
    }
}
