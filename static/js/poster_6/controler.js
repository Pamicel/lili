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
$("form").submit(function (e) {
    e.preventDefault();
    parseAndDraw();
    return false;
});

// var bounceCheck = document.getElementById("bounceCheck");
// bounceCheck.onclick = function () {
//     wg.collision = bounceCheck.checked;
//     parseAndDraw();
// };