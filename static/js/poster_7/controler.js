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
    let w = window.innerWidth * 0.8;
    let h =  window.innerHeight * 0.5;
    wg.canvasWidth   = w;
    wg.canvasHeight  = h;
    paper.view.viewSize.width = w;
    paper.view.viewSize.height = h;
    parseAndDraw();
    // This below is a dirty fix.
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.5;
    // for the responsive haters out there.
    if (window.innerWidth < 770)
    {
        troll.style.display = '';
    }
    else
        troll.style.display = 'none';
};

function watchTimestamps()
{
    parseAndDraw();
    wg.watch('tsOk', watchTimestamps);
}
watchTimestamps();

document.getElementById("refreshButton").onclick = function() {parseAndDraw();};
// $("form").submit(function (e) {
//     parseAndDraw();
//     // e.preventDefault();
//     // return false;
// });

function initModifyButton(query, func, type = 'cross')
{
    var el,
        modSpan,
        dismissSpan;

    el = $(query);
    el.addClass(type);
    modSpan = document.createElement('span');
    modSpan.innerText = "Modifier";
    dismissSpan = document.createElement('span');
    if (type == 'cross')
        dismissSpan.innerText = "✖";
    else if (type == 'ok')
        dismissSpan.innerText = "✔";
    else
        return ;
    if (el.hasClass("on"))
        el[0].appendChild(dismissSpan);
    else
        el[0].appendChild(modSpan);
    el.click(function() {
        if (el.hasClass('on'))
        {
            el.addClass('off');
            el.removeClass('on');
            el[0].replaceChild(modSpan, dismissSpan);
            func('off');
        }
        else
        {
            el.removeClass('off');
            el.addClass('on');
            el[0].replaceChild(dismissSpan, modSpan);
            func('on');
        }
    });
}

initModifyButton("#scaleHider", (newState) => {
        wg.userScaleFactor = (newState == 'on');
        $('#scale').toggleClass('auto');
        $('#scale').toggleClass('manual');
    ;}, 'cross');

initModifyButton("#resultModif", (newState) => {
        var fSpan = $("#finalSpan")[0];
        var inp = $("#result textarea")[0];
        if (newState == 'on')
        {
            inp.value = fSpan.innerText;
            fSpan.style.display = 'none';
            inp.style.display = '';
            return ;
        }
        fSpan.innerText = inp.value;
        wg.text = inp.value;
        parseAndDraw(inp.value);
        inp.style.display = 'none';
        fSpan.style.display = '';
    }, 'ok');

var midColor = document.getElementById('midColorValue');
var colorDiv = document.getElementById('colorDiv');
midColor.onchange = function(e) {
    colorDiv.style.backgroundColor = 'hsl(' + midColor.value + ', 50%, 50%)';
}

bgButton = document.getElementById('bgbutton');
bgButton.style.backgroundColor = 'white';
bgButton.addEventListener('click', function() {
        if (bgButton.style.backgroundColor == 'white')
        {
            canvas.style.backgroundColor = 'white';
            bgButton.style.backgroundColor = 'black';
        }
        else
        {
            canvas.style.backgroundColor = 'black';
            bgButton.style.backgroundColor = 'white';
        }
    });

// var bounceCheck = document.getElementById("bounceCheck");
// bounceCheck.onclick = function () {
//     wg.collision = bounceCheck.checked;
//     parseAndDraw();
// };