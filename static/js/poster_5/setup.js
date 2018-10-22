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


"use strict";

/*      ADD POLYFILL        */

/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable:     false,
        configurable:   true,
        writable:       false,
        value: function (prop, handler) {
            var oldval = this[prop],
                newval = oldval,
                getter = function () {
                    return newval;
                },
                setter = function (val) {
                    oldval = newval;
                    return newval = handler.call(this, prop, oldval, val);
                };
            if (delete this[prop]) { 
                // can't watch constants
                Object.defineProperty(this, prop, {
                    get: getter,
                    set: setter,
                    enumerable: true,
                    configurable: true
                });
        }
    }
});
}

// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function (prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
}




/*      SETUP THE GLOBAL OBJECT         */

window.globals = {
    lineHeight          : 500,
    spaceWidth          : 310,
    radius              : 10,
    agitationFactors    : [],
    
    canvasWidth         : window.innerWidth * 0.8,
    canvasHeight        : window.innerHeight * 0.5,
    text                : '',
    // lines
    // letters
    // words
    // forces
    // linesCount
    // wordsCount
    // lettersCount
    // soundSource
    // buffer
    
    pos                 : [],
    posAnker            : [],
    vel                 : [],
    // letterCenters    : [],

    fireDraw            : false,

    // colors
    // colorsRateOfChange
    scaleFactor         : 1,

    // totalHeight
    maxLineWidth        : 0,
    collision           : false,

    volume              : [],
    tsOk                : [],
    fft                 : [],

    ext                 : false,
    extX                : false,
    extY                : false,
    traXY               : false
    // recording
    // recordTime
};

// paper.install(window);

var wg = window.globals;




/*      SETUP THE LETTERS       */

function setupAllLetters()
{
    let newObj = {};
    for (let letter in allLetters)
        newObj[letter] = JSON.parse(allLetters[letter]);
    allLetters = newObj;
}

setupAllLetters();
