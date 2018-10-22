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

function gridSnaper(x, density)
{
    let jump = 1 / density;
    let xOff = x % jump;
    if (x < 0)
        jump = -jump;

    return (x - xOff + (abs(jump - xOff) < abs(xOff)) * jump);
}

function followPosition(tn, posX, posY, attachAnker = true, gridSnap = false, gridDensity = 1)
{
    if (attachAnker)
    {
        if (gridSnap)
        {
            tn.anker.x = gridSnaper(posX, gridDensity);
            tn.anker.y = gridSnaper(posY, gridDensity);
            tn.pos.x = gridSnaper(posX, gridDensity);
            tn.pos.y = gridSnaper(posY, gridDensity);
        }
        else
        {
            tn.anker.x = posX;
            tn.anker.y = posY;
            tn.pos.x = posX;
            tn.pos.y = posY;
        }
    }
    else
    {
        tn.pos.x = posX;
        tn.pos.y = posY;
    }
}

function graspNode(x, y)
{
    let eraser              = TYNO_WORLD.buttons.eraser;
    let letter              = TYNO_WORLD.letter;
    let center              = letter.center;
    let mousePos            = createVector(mouseX, mouseY);
    let editMetrics         = TYNO_WORLD.bools.editMetrics;

    if (eraser.pos.dist(mousePos) < eraser.space)
    {
        TYNO_WORLD.bools.holding = true;
        TYNO_WORLD.bools.eraserHold = true;
    }
    else if (editMetrics && center.pos.dist(mousePos) < center.space)
    {
        TYNO_WORLD.bools.holding = true;
        TYNO_WORLD.bools.centerHold = true;
    }
    else
    {
        let i = letter.closeToWhichNode(mousePos);
        if (i != -1)
        {
            TYNO_WORLD.bools.holding = true;
            TYNO_WORLD.globals.nHeld = i;
        }
    }
    return (TYNO_WORLD.bools.holding);
}


function mouseClicked()
{
    let bgButton            = TYNO_WORLD.buttons.bg;
    let restartButton       = TYNO_WORLD.buttons.restart;
    let gridButton          = TYNO_WORLD.buttons.grid;
    let gridSnapButton      = TYNO_WORLD.buttons.snap;
    let saveButton          = TYNO_WORLD.buttons.save;
    let loadButton          = TYNO_WORLD.buttons.load;
    let agitateButton       = TYNO_WORLD.buttons.agitate;
    let metricsButton       = TYNO_WORLD.buttons.metrics;

    let isHolding           = TYNO_WORLD.bools.holding;
    let lifeOn              = TYNO_WORLD.bools.life;
    let snapOn              = TYNO_WORLD.bools.gridSnap;
    let eraserDrag          = TYNO_WORLD.bools.eraserDrag;
    let editMetrics         = TYNO_WORLD.bools.editMetrics;

    let volLev              = TYNO_WORLD.globals.volLev;
    let density             = TYNO_WORLD.globals.gridDensity;
    let mass                = TYNO_WORLD.nodeMass;
    let letter              = TYNO_WORLD.letter;
    let center              = TYNO_WORLD.letter.center;

    // nothing is held so far
    if (!isHolding)
    {
        if (bgButton.isAround(mouseX, mouseY))
            bgButton.press();
        else if (restartButton.isAround(mouseX, mouseY))
            restartButton.press();
        else if (gridButton.isAround(mouseX, mouseY))
            gridButton.press();
        else if (gridSnapButton.isAround(mouseX, mouseY))
            gridSnapButton.press();
        else if (agitateButton.isAround(mouseX, mouseY) ||
                (lifeOn && volLev.isAround(mouseX, mouseY)))
            agitateButton.press();
        else if (metricsButton.isAround(mouseX, mouseY))
            metricsButton.press();
        else if (saveButton.isAround(mouseX, mouseY))
            saveButton.press();
        else if (loadButton.isAround(mouseX, mouseY))
            loadButton.press();
        else
        {
            // is not around a node
            if (!graspNode(mouseX, mouseY))
            {
                if (!(editMetrics &&
                    center.isAround(mouseX, mouseY)) &&
                    mouseY < height - 50)
                    letter.newNode(mouseX, mouseY, mass, snapOn, density);
            }
            // is around a node and therefore has grabbed it
            else
            {
                // mouseClicked attachAnker always false
                TYNO_WORLD.bools.attachAnker = false;
                TYNO_WORLD.bools.holding = true;
            }
        }
    }
    // something is held
    else
    {
        if (!eraserDrag)
        {
            // if you click and you are not draggind this eraser,
            // whatever you were holding is released :
            TYNO_WORLD.bools.holding = false;
            TYNO_WORLD.bools.eraserHold = false;
        }
        // clock back to initial value
        TYNO_WORLD.clocks.clicked = 1;
        // eraserDrag back to default value
        TYNO_WORLD.bools.eraserDrag = false;
        TYNO_WORLD.bools.centerHold = false;
    }
}

function mouseDragged()
{
    let isHolding           = TYNO_WORLD.bools.holding;
    let editMetrics         = TYNO_WORLD.bools.editMetrics;
    let isHoldingEraser     = TYNO_WORLD.bools.eraserHold;
    let letter              = TYNO_WORLD.letter;
    let eraser              = TYNO_WORLD.buttons.eraser;
    let snapOn              = TYNO_WORLD.bools.gridSnap;
    let density             = TYNO_WORLD.globals.gridDensity;
    let mass                = TYNO_WORLD.nodeMass;

    // nothing is held so far
    if (!isHolding)
    {
        if (graspNode(mouseX, mouseY))
        {
            TYNO_WORLD.bools.attachAnker = true;
            TYNO_WORLD.bools.holding = true;
        }
        else if (mouseY < height - 50)
        {
            letter.newNode(mouseX, mouseY, mass, snapOn, density);
        }
    }
    // eraserIsHeld
    else if (isHoldingEraser)
    {
        TYNO_WORLD.bools.eraserDrag = true;
        if (!letter.eraseConnection(eraser))
            letter.eraseNode(eraser);
    }
    else
    {
        TYNO_WORLD.bools.attachAnker = true;
    }
}

// !reformat
function windowResized()
{
	resizeCanvas(windowWidth, windowHeight);
    s_buttonsSetPos(height);
}
