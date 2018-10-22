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

/*      SETUP THE AUDIO         */

// Audio flow variables.
var audioContext;
var sampleRate;
var audioFormat = 'audio/webm';
var analyser;
var ampAnalyser;
var recorder;
var chunks = [];
var blob;
// Transcription variables
var recognitionStream;
var watsonTranscript;
var finalTranscript = '';
var recognizing = false;
var ignoreOnend;
var startTimestamp;
var timestamps = [];
// Error messages.
const API_ERR_MSG = "Web Audio API is not supported in this browser";
const MIC_ERR_MSG = "ERROR. Your browser might not be compatible with this app.";
// Get information div in document
var info = document.getElementById("info");

// Check if Web Audio API is supported.
try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    sampleRate = audioContext.sampleRate;
} catch(err) {
    alert(API_ERR_MSG);
}


////////

// Create microphone input & build the audio pipe.
var micStream;
var micTrack;

navigator.mediaDevices.getUserMedia({audio: true})
.then(
    function(stream)
    {
        var dest;

        micStream = stream;
        micTrack = stream.getTracks()[0];
        // Create analyser node to extract ffts.
        analyser = audioContext.createAnalyser();
        // Create ampAnalyser to extract amplitudes.
        // gatherVol = audioContext.createScriptProcessor
        ampAnalyser = audioContext.createScriptProcessor(1024, 1, 1);
        ampAnalyser.onaudioprocess = function(e) {
                var buf,
                    out,
                    amp,
                    loud,
                    fft,
                    centroid;

                buf = e.inputBuffer.getChannelData(0);
                out = e.outputBuffer.getChannelData(0);
                amp = 0;
                // Iterate through buffer to get max amplitude
                if (recognizing)
                {
                    // for (var i = 0; i < buf.length; i++) {
                    //     loud = Math.abs(buf[i]);
                    //     if(loud > amp)
                    //         amp = loud;
                    //     // Write input samples to output unchanged.
                    //     out[i] = buf[i];
                    // }
                    fft = new Float32Array(analyser.frequencyBinCount);
                    analyser.getFloatFrequencyData(fft);
                    centroid = calculateCentroid(fft);
                    wg.centroids.push(centroid);
                    wg.fft.push(fft);
                    wg.volume.push(...buf);
                }
                for(i in buf)
                    out[i] = buf[i];
            };
        // Create a destination.
        dest = audioContext.createMediaStreamDestination();
        // Create a recorder that will listen to the destination.
        recorder = new MediaRecorder(dest.stream);
        // Connect everything toghether.
        audioContext.createMediaStreamSource(stream).connect(ampAnalyser);
        ampAnalyser.connect(analyser);
        setupRecorderBehaviour();
        analyser.connect(dest);
    })
.catch(
    function(err)
    {
        alert(MIC_ERR_MSG + err);
    });

// Assignments for the Recorder's event functions.
function setupRecorderBehaviour()
{
    recorder.onstart = function(evt) {
        // Erase last blob URL from the audio element.
        chunks = [];
        document.querySelector("audio").src = "";
    };

    recorder.ondataavailable = function(evt) {
        // Push each chunk (blobs) in an array.
        chunks.push(evt.data);
    };

    recorder.onstop = function(evt) {
        // Make blob out of our blobs, and create an object URL and push it to the audio element.
        blob = new Blob(chunks, {type : audioFormat});
        useWatson(blob);
        document.getElementById("playback").src = URL.createObjectURL(blob);
        wg.recordTime = evt.timeStamp - startTimestamp;
    };
}


////////

// https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API

// var micButton = document.getElementById("micButton");

if (!('webkitSpeechRecognition' in window))
    upgrade();
else if (navigator.onLine)
{
    // Display button and informations if SpeechRecognition is supported.
    micButton.style.display = 'inline-block';
    showInfo('infoStart');
    var recognition = new webkitSpeechRecognition();
    setupRecognitionBehaviour();
}
else
{
    let buttons = document.getElementsByTagName('button');
    for(let i = 0; i < buttons.length; i++)
        buttons[i].style.display = 'none';
    // micButton.style.display = 'none';
    showInfo('infoOffline');
}

function setupRecognitionBehaviour()
{
    // Define type of recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = function() {
        recognizing = true;
        showInfo('infoSpeakNow');
        startImg.src = '../assets/sandbox/mic-animate.gif';
    };

    recognition.onerror = function(event) {
        console.log('error', event.error);
        if (event.error == 'no-speech')
        {
            startImg.src = '../assets/sandbox/mic.gif';
            showInfo('infoNoSpeech');
            ignoreOnend = true;
        }
        if (event.error == 'audio-capture')
        {
            startImg.src = '../assets/sandbox/mic.gif';
            showInfo('infoNoMicrophone');
            ignoreOnend = true;
        }
        if (event.error == 'not-allowed')
        {
            if (event.timeStamp - startTimestamp < 100)
                showInfo('infoBlocked');
            else
                showInfo('infoDenied');
            ignoreOnend = true;
        }
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignoreOnend)
            return;
        startImg.src = '../assets/sandbox/mic.gif';
        if (finalTranscript != '')
        {
            showInfo('infoStart');
            return;
        }
        showInfo('infoAgain');
        if (window.getSelection)
        {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('finalSpan'));
            window.getSelection().addRange(range);
        }
    };

    recognition.onresult = function(event) {
        var interimTranscript = '';
        if (typeof(event.results) == 'undefined')
        {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        }
        for (let i = event.resultIndex; i < event.results.length; ++i)
        {
            if (event.results[i].isFinal)
                finalTranscript += event.results[i][0].transcript;
            else
                interimTranscript += event.results[i][0].transcript;
        }
        finalTranscript = capitalize(finalTranscript);
        wg.text = finalTranscript;
        // if (wg.text != '')
        //     translator().then((val) => {wg.fireDraw = true;})
        //                 .catch((reason) => {console.log(reason);});
        finalSpan.innerHTML = linebreak(finalTranscript);
        interimSpan.innerHTML = linebreak(interimTranscript);
    };
}

////////

function linebreak(s)
{
    const TWO_LINES = /\n\n/g;
    const ONE_LINE = /\n/g;

    return s.replace(TWO_LINES, '<p></p>').replace(ONE_LINE, '<br>');
}

function upgrade()
{
    micButton.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

function capitalize(s)
{
    const FIRST_CHAR = /\S/;

    return s.replace(FIRST_CHAR, function(m) { return m.toUpperCase(); });
}

function showInfo(s)
{
    if (s)
    {
        for (let child = info.firstChild; child; child = child.nextSibling)
            if (child.style)
                child.style.display = child.id == s ? 'inline' : 'none';
        info.style.visibility = 'visible';
    }
    else
        info.style.visibility = 'hidden';
}
