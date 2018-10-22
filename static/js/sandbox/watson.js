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

var token;
$.get('/getToken').then((res) => { token = res; });

function useWatson()
{
    const OPTIONS = {
        'token':            token,
        'file' :            blob,
        'model':            'fr-FR_BroadbandModel',
        'timestamps':       true,
        'objectMode':       true,
        'content-type':     audioFormat,
        'interim-results':  false };
    recognitionStream = WatsonSpeech.SpeechToText.recognizeFile(OPTIONS);
    recognitionStream.on('data', function(data) {
            // console.log(data);
            var res,
                ts,
                tsOut,
                out;

            if (data.results.length > 0 && data.results[0].final)
            {
                res = data.results[0].alternatives[0];
                ts = res.timestamps;
                watsonTranscript = res.transcript;
                tsOut = [];

                for (let i = 0, len = ts.length; i < len; i++)
                    tsOut.push(ts[i][1], ts[i][2]);
                timestamps = timestamps.concat(tsOut);
                ////////////////////////////////////////////////////////////////
                // console.log('timestamps before : ', timestamps);
                // console.log('transcript : ', watsonTranscript);
                // console.log(data);
                ////////////////////////////////////////////////////////////////
                out = [];
                for (let i = 0, len = timestamps.length; i < len; i++)
                    if (i == (len - 1) || i == 0 || (timestamps[i] != timestamps[i + 1] && timestamps[i] != timestamps[i - 1]))
                        out.push(timestamps[i]);
                timestamps = out;
                wg.tsOk = timestamps;
                ////////////////////////////////////////////////////////////////
                // console.log('timestamps after : ', timestamps);
                ////////////////////////////////////////////////////////////////
            }
        });
    recognitionStream.on('error', function(err) {
            console.log(err);
            if (err == 'Error: WebSocket connection error at WebSocket.d.onerror')
            {
                $.get('http://localhost:8080/getToken')
                    .then((res) => { 
                            token = res;
                            useWatson();
                        });
            }
        });
    recognitionStream.on('close', function(reasonCode, descr) {
        console.log(reasonCode, descr);
    })
}
