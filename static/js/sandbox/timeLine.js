var playSegButtons,
    separators;

playSegButtons = [];
function setupSegButtons()
{
    for (let i = 0, len = timestamps.length; i < len; i += 2)
    {
        let x,
            w,
            newEl,
            ts;

        ts = document.getElementById('timeLine');
        x = (timestamps[i] / (wg.recordTime / 1000)) * 100;
        w = (timestamps[i + 1] - timestamps[i]) / (wg.recordTime / 1000) * 100;
        newEl = document.createElement("div");
        newEl.style.width = w + "%";
        newEl.style.left = x + "%";
        newEl.i = i / 2;
        newEl.addEventListener('click', () => {playSeg(newEl.i)});
        newEl.className = "segButtons";
        newEl.innerText = "▶";
        playSegButtons.push(newEl);
        ts.appendChild(newEl);
    }
}
setupSegButtons();

function updateTimestamps(i, value)
{
    let x,
        w;

    timestamps[i] = value;
    if (i % 2 == 0)
    {
        x = (timestamps[i] / (wg.recordTime / 1000)) * 100;
        w = (timestamps[i + 1] - timestamps[i]) / (wg.recordTime / 1000) * 100;
        playSegButtons[i / 2].style.width = w + "%";
        playSegButtons[i / 2].style.left = x + "%";
    }
    else
    {
        x = (timestamps[i - 1] / (wg.recordTime / 1000)) * 100;
        w = (timestamps[i] - timestamps[i - 1]) / (wg.recordTime / 1000) * 100;
        playSegButtons[(i - 1) / 2].style.left = x + "%";
        playSegButtons[(i - 1) / 2].style.width = w + "%";
    }
}

separators = [];
function setupSeparators()
{
    for (i in timestamps)
    {
        let x,
            newEl,
            // mark,
            ts;

        ts = document.getElementById('timeLine');
        x = (timestamps[i] / (wg.recordTime / 1000)) * 100;
        newEl = document.createElement("div");
        // mark = document.createElement('div');
        // mark.style = "background-color: white; width: 1; height: 100%; margin: auto;";
        // newEl.appendChild(mark);
        newEl.className = "separators";
        newEl.style.left = x + "%";
        newEl.addEventListener('mousedown', function(e) {
            newEl.isDown = true;
            newEl.offset = [
                newEl.offsetLeft - e.clientX,
                newEl.offsetTop - e.clientY
            ];
        }, true);
        newEl.i = Number(i);

        document.addEventListener('mouseup', function() {
            newEl.isDown = false;
        }, true);

        document.addEventListener('mousemove', function(event) {
            // event.preventDefault();
            let newX,
                newT,
                i;

            i = newEl.i;
            if (newEl.isDown)
            {
                mousePosition = {

                    x : event.clientX,
                    y : event.clientY

                };
                newX = mousePosition.x + newEl.offset[0];
                newT = (newX / ts.clientWidth) * (wg.recordTime / 1000);
                if (    newT > 0
                        && newT < (wg.recordTime / 1000)
                        && (i == 0 || newT > timestamps[i - 1])
                        && (i == (timestamps.length - 1) || newT < timestamps[i + 1]))
                {
                    newEl.style.left = (newX / ts.clientWidth * 100) + '%';
                    updateTimestamps(i, newT);
                }
            }
        }, true);
        separators.push(newEl);
        ts.appendChild(newEl);
    }
}
setupSeparators();

function setupTimeLine()
{
    separators = [];
    playSegButtons = [];
    ts = document.getElementById('timeLine');
    while (ts.hasChildNodes())
        ts.removeChild(ts.lastChild);
    setupSegButtons();
    setupSeparators();
}
