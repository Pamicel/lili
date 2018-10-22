const EXAGERATION = 10;

var centrCanvas = document.createElement('canvas');
centrCanvas.id = 'centrCanvas';
document.body.appendChild(centrCanvas);
var centrCtx = centrCanvas.getContext("2d");

var centroids = [];

function drawCentroids()
{
    centrCtx.fillStyle = '#ffffff';
    centrCtx.fillRect(0, 0, centrCanvas.width, centrCanvas.height);
    var len = fft.length;
    var mapW = centrCanvas.width / len;
    var mapH = centrCanvas.height / 1024;
    centrCtx.fillStyle = '#000000';
    for(i in fft)
    {
        centroids.push(calculateCentroid(fft[i]));
        centrCtx.fillRect(i * mapW, centrCanvas.height - calculateCentroid(fft[i]) * mapH, 1, 1);
    }
    centrCtx.fillStyle = '#ff0000';
    mean = calculateMean(centroids);
    for(i in fft)
    {
        centrCtx.fillRect(i * mapW, centrCanvas.height - mean * mapH, 1, 1);
    }
}

var diffCanvas = document.createElement('canvas');
diffCanvas.id = 'diffCanvas';
document.body.appendChild(diffCanvas);
var diffCtx = diffCanvas.getContext("2d");

var dif;

function drawDif()
{
    diffCtx.fillStyle = '#ffffff';
    diffCtx.fillRect(0, 0, diffCanvas.width, diffCanvas.height);
    dif = differentiateArray(centroids);
    // dif.map((x) => {return x * EXAGERATION});
    var len = dif.length;
    var mapW = diffCanvas.width / len;
    var mapH = diffCanvas.height / 1024;
    diffCtx.fillStyle = '#0000ff';
    for(i in dif)
    {
        diffCtx.fillRect(i * mapW, diffCanvas.height / 2 - dif[i] * mapH, 1, 1);
    }
}

drawCentroids();
drawDif();