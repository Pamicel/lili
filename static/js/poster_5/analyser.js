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

////////////////////////////////////////////////////////////////////////////////

function analyserStep()
{
    var dataArray;

    dataArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(dataArray);
    wg.fft.push(dataArray);
    // volume.push(analyser.maxDecibels - analyser.minDecibels);
    if (recognizing)
        window.requestAnimationFrame(analyserStep);
}

/**
 * Calculates the array's centroid.
 * Which means that the returned value is not a frequency but an index
 * in the array.
 */
function calculateCentroid(dataArray)
{
    var centroid,
        sum;

    centroid = 0;
    sum = 0;
    for (let i = 0, len = dataArray.length; i < len; i++)
        sum += dataArray[i];
    for (let i = 0, len = dataArray.length; i < len; i++)
        centroid += dataArray[i] * (i + 1) / sum;
    return (centroid);
}

// https://stackoverflow.com/questions/32788836/smoothing-out-values-of-an-array

function avg (v) {
    return (v.reduce((a, b) => a + b, 0) / v.length);
}

function smoothArray (vector, variance) {
    var t_avg = avg(vector)*variance;
    var ret = Array(vector.length);
    for (var i = 0; i < vector.length; i++) {
        (function () {
            var prev = i > 0 ? ret[i - 1] : vector[i];
            var next = i < vector.length ? vector[i] : vector[i - 1];
            ret[i] = avg([t_avg, avg([prev, vector[i], next])]);
        })();
  }
  return ret;
}

function display (x, y) {
  console.clear();
  console.assert(x.length === y.length);
  x.forEach((el, i) => console.log(`${el}\t\t${y[i]}`));
}
////

function calculateDeviations(dataArray)
{
    var dev,
        mean;

    dev = [];
    mean = calculateMean(dataArray);
    for (let i = 0, len = dataArray.length; i < len; i++)
        dev.push(dataArray[i] - mean);
    return (dev);
}

/*
 * It is good to know that differentiateArray returns an array
 * of length dataArray.length - 1. That is because it differentiates
 * on ]0, n].
 *
 * Exples : differentiateArray([1, 2, 3, 4])        returns [1, 1, 1]
 *          differentiateArray([1, 2, 2, 2])        returns [1, 0, 0]
 *          differentiateArray([1, 2, 2, 2, 4])     returns [1, 0, 0, 2]
 */
function differentiateArray(dataArray)
{
    var dif;

    dif = [];
    for (let i = 1, len = dataArray.length; i < len; i++)
        dif.push(dataArray[i] - dataArray[i - 1]);
    return (dif);
}

function cutArray(timestamps, duration, array)
{
    var timeToIndexRatio,
        res;

    res = [];
    timeToIndexRatio = duration / array.length;
    for (let i = 0, len = timestamps.length; i < len; i += 2)
    {
        let index = Math.round(timestamps[i] / timeToIndexRatio);
        let end = Math.round(timestamps[i + 1] / timeToIndexRatio);
        while (index < end)
            res.push(array[index++]);
    }
    return (res);
}

function sampleArray(array, newSize)
{
    var sampleRatio;

    sampleRatio = newSize / array.length;
    // console.log(newSize);
    // console.log(sampleRatio);
    // console.log(array.length);
    if (sampleRatio <= 1)
        return (downSample(array, sampleRatio));
    return (upSample(array, sampleRatio));
}

function downSample(array, ratio)
{
    var res,
        sampleLen;

    if (ratio >= 1)
        return (array);
    res = [];
    sampleLen = Math.round(1 / ratio);
    for (let i = 0; i < array.length; i += sampleLen)
        res.push(avg(array.slice(i, i + sampleLen)));
    return (res);
}

function maxOf(array, index, end)
{
    var max;

    max = array[index++];
    while(index < end)
    {
        if (max < array[index])
            max = array[index];
        index++;
    }
    return (max);
}


//! TEMPORARY
function upSample(array, ratio)
{
    var res,
        sampleLen;

    if (ratio <= 1)
        return (array);
    res = [];
    sampleLen = Math.ceil(ratio);
    for (i in array)
    {
        let n = sampleLen;
        while (n--)
            res.push(array[i]);
    }
    return (res);
}

//! Calculate overall amplitude then derivate and derivate again.
////////////////////////////////////////////////////////////////////////////////

function micOnOff(event)
{
    if (recognizing)
    {
        recorder.stop();
        recognition.stop();
        micTrack.enabled = false; // Silences the mic.
        return;
    }
    wg.fft = [];
    wg.volume = [];
    timestamps = [];
    window.requestAnimationFrame(analyserStep);
    micTrack.enabled = true; // Opens the mic.
    finalTranscript = ''; // Initialize the content of the transcript span.
    recorder.start();
    recognition.start();
    ignoreOnend = false; //! I don't know what that does and I should find out.
    finalSpan.innerHTML = ''; // Clean the view.
    interimSpan.innerHTML = '';
    startImg.src = '../assets/sandbox/mic-slash.gif'; // Visual cue to show that microphone is listenning
    showInfo('info_allow');
    startTimestamp = event.timeStamp; // Save time recorder and recognition began.
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var audio = document.getElementById('playback');
var segmentEnd;

audio.addEventListener('timeupdate', function (){
    // console.log(audio.currentTime);
    if (segmentEnd && audio.currentTime >= segmentEnd) {
        audio.pause();
    }   
}, false);

function playSegment(startTime, endTime){
    segmentEnd = endTime;
    audio.currentTime = startTime;
    audio.play();
}

function playSeg(n)
{
    playSegment(timestamps[n * 2], timestamps[n * 2 + 1]);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

