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

function parseAndDraw() {
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
            eA = cutArray(timestamps, wg.recordTime / 1000, wg.volume);
            eA = sampleArray(eA, wg.pos.length);
            // console.log(eA);
            // display(eA, smoothArray(eA, .2));
            eA = smoothArray(eA, .85);
            // console.log(eA);
            var extRange = document.getElementById('extRange').value;
            eA = eA.map(function(x) {return (x * extRange * wg.scaleFactor);});
            // console.log(eA);
            wg.extensionArray = eA;
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

window.onresize = function(evt) {
    wg.canvasWidth   = window.innerWidth * 0.8;
    wg.canvasHeight  = window.innerHeight * 0.5;
    parseAndDraw();
    // This below is a dirty fix.
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.5;
};

function watchTimestamps()
{
    parseAndDraw();
    wg.watch('tsOk', watchTimestamps);
}
watchTimestamps();

document.getElementById("refreshButton").onclick = parseAndDraw;