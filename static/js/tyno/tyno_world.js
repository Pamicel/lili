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

/* http://stackoverflow.com/questions/33780271/export-a-json-object-to-a-text-file */

// WORLD : GLOBAL CONSTANT OBJECTS

const TYNO_WORLD = {
    letter : undefined,
    letterImg : undefined,
    punches : undefined,
    nodeColor : 255,
    nodeMass : 15,
    connectionsThickness : 1,
    buttons : {},
    buttonSize : 15,
    levelMin : 50,      // level below which a frequency domain is ignored
    buttonColumn : {
        x : 50,
        bottom : 50,
        spaceBetween : 65,
        w : 80,
        textOff : 30,
    },
    agitationLevel : 100,
    entropy : 20,
    globals : {
        nHeld : 0,
        mic : undefined,
        fft : undefined,
        octaves : undefined,
        volLev : undefined,
        gridDensity : 0.05
    },
    bools : {
        holding : false,
        centerHold : false,
        eraserHold : false,
        eraserDrag : false,
        life : false,
        background : true,
        attachAnker : true,
        grid : false,
        gridSnap : false,
        editMetrics : false
    },
    clocks : {
        clicked : 1,
        cookieClk : 0
    }
}
