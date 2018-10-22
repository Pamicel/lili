/*                                                                            */
/*                                                 ▄▄▄▄ ▄▄▄                   */
/*                                              ▄▀▀   ▀█   █                  */
/*                                            ▄▀  ▄██████▄ █                  */
/*                                           ▄█▄█▀  ▄ ▄ █▀▀▄                  */
/*                                          ▄▀ ██▄  ▀ ▀ ▀▄ █                  */
/*       pamicel@student.42.fr              ▀▄  ▀ ▄█▄▄  ▄█▄▀                  */
/*       april 2017                           ▀█▄▄  ▀▀▀█▀ █                   */
/*                                           ▄▀   ▀██▀▀█▄▀                    */
/*                                          █  ▄▀▀▀▄█▄  ▀█                    */
/*                                          ▀▄█     █▀▀▄▄▀█                   */
/*                                           ▄▀▀▄▄▄██▄▄█▀  █                  */
/*                                          █▀ █████████   █                  */
/*                                          █  ██▀▀▀   ▀▄▄█▀                  */
/*                                           ▀▀                               */
/*                                                                            */

var express = require('express');
var morgan = require('morgan');
var app = express();
var path = require('path');
var cred = require('/watson-credentials.json');

////////////////////////////////////////////////////////////////////////////////
// WATSON BS //

var watson = require('watson-developer-cloud');

var authorization = watson.authorization({
  username: cred.username,
  password: cred.password,
  version: 'v1',
  url: 'https://stream-fra.watsonplatform.net/authorization/api'
});

console.log(authorization);
console.log(watson);

app.get('/getToken', function(req, res) {
    var params = {
        url: cred.url
    };
    authorization.getToken(params, function (err, token) {
        if (!token)
        {
            console.log('error:', err);
            res.send("0");
        }
        else
        {
            console.log(token);
            res.send(token);
        }
    });
});

////////////////////////////////////////////////////////////////////////////////

/*
Liste des URLs :

    /tyno
    /tyno_sandbox
    /tyno/{lettre}
    /poster-beta
    /poster_0
    /poster_1
    /poster_2
    /poster_3
    /poster_4
    /poster_5
    /poster_6
    /poster_7
    /sandbox
    /capsule_logo_0
    /capsule_logo_1
    /capsule_logo_2
    /ostendo_0
    /ostendo_1
    /test_0
    /test_1
    /speech

*/

/***
https://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
***/

var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * called by creating an option like :
 *
 *  var options = {
 *      host: 'somesite.com',
 *      port: 443,
 *      path: '/some/path',
 *      method: 'GET',
 *      headers: {
 *          'Content-Type': 'application/json'
 *      }
 *   };
 *
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
function getJSON(options, onResult)
{
    console.log("rest::getJSON");

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            onResult(res.statusCode, output);
        });
    });

    req.on('error', function(err) {
        console.log(err);
        //res.send('error: ' + err.message);
    });

    req.end();
};

// var tokenURL = "https://stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/text-to-speech/api"

/***
***/

app.set('views', __dirname + '/views');
app.use(morgan('dev')); //log incoming requests to the console
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
    });

// Tyno

app.get('/tyno', (req, res) => {
    res.render('tyno', { letter : '' });
    });

app.get('/tyno_sandbox', (req, res) => {
    res.render('tyno_sandbox', { letter : '' });
    });

app.get('/tyno/*', (req, res) => {
    var urlEnd = req.url.split('/')[2];
    res.render('tyno', { letter : '/' + urlEnd });
    });

// Functionnal posters

app.get('/poster-beta', (req, res) => {
    res.render('poster_beta');
    });

app.get('/poster_*', (req, res) => {
    let num = req.url.split('poster_')[1];
    res.render('poster_' + num);
    });

// Other

app.get('/sandbox', (req, res) => {
    res.render("sandbox");
    });

app.get('/capsule_logo_*', (req, res) => {
    let num = req.url.split('capsule_logo_')[1];
    res.render("capsule_logo_" + num);
    });

app.get('/ostendo_*', (req, res) => {
    let num = req.url.split('ostendo_')[1];
    res.render("ost_" + num);
    });

app.get('/getAmp', (req, res) => {
    res.render("getAmp");
    });

app.get('/test_0', (req, res) => {
    res.render('test', {whichScript : "show_centroid/test.js"});
    });

app.get('/test_1', (req, res) => {
    res.render('test', {whichScript : "playground/playground.js"});
    });

app.get('/speech', (req, res) => {
    res.render('speechTextApi');
    });

app.get('/galettes', (req, res) => {
    res.sendFile(path.join(__dirname+'/views/galettes.html'));
    });

app.get('/sypo', (req, res) => {
    res.render('sypographie');
    });

app.get('/marie', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/marie.html'));
  });

app.listen(8080);
