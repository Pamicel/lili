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

const POSTER_WORLD = {
    letters : [],
    words : [],
    interlignage : 450,
    nodeColor : 255,
    nodeMass : 20,
    connectionsThickness : 1,
    buttons : {},
    buttonSize : 15,
    levelMin : 50,      // level below which a frequency domain is ignored
    agitationLevel : 1,
    entropy : 10,
    // k : ,
    globals : {
        mic : undefined,
        fft : undefined,
        octaves : undefined,
        volLev : undefined,
        width : undefined,
        height : undefined
    },
    buttonColumn : {
        x : 50,
        bottom : 50,
        spaceBetween : 65,
        w : 80,
        textOff : 30,
    },
    bools : {
        parsed : false,
        life : false,
        background : true,
        attachAnker : false,
    },
    clocks : {
        clicked : 1,
        cookieClk : 0
    }
}
