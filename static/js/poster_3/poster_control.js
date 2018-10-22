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

function switchBackground()
{
    POSTER_WORLD.bools.background = !POSTER_WORLD.bools.background;
}

function mouseClicked()
{
    if (switchButton.isClicked())
        switchButton.press();
    else
    {
        POSTER_WORLD.bools.background = !POSTER_WORLD.bools.background;
        POSTER_WORLD.bools.life = !POSTER_WORLD.bools.life;
    }
}

function windowResized()
{
    switchButton.setup(40, windowHeight - 40);
	resizeCanvas(windowWidth, windowHeight);
    POSTER_WORLD.globals.width = windowWidth;
    POSTER_WORLD.globals.height = windowHeight;
}

function keyTyped()
{
    POSTER_WORLD.bools.parsed = false;
}
