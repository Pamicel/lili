/* https://p5js.org/reference/#/p5.FFT/getCentroid */

function setup()
{
	cnv = createCanvas(800,400);
	sound = new p5.AudioIn();
	sound.start();
	fft = new p5.FFT();
	sound.connect(fft);
    colorMode(HSB, 360, 100, 100);
}

function draw()
{
	var centroidplot = 0.0;
	var spectralCentroid = 0;
	var spectrum = fft.analyze();
    spectralCentroid = fft.getCentroid();
    background(0);

    //draw the spectrum
    fill('green');
	for (var i = 0; i< spectrum.length; i++)
    {
		var x = map(log(i), 0, log(spectrum.length), 0, width);
		var h = map(spectrum[i], 0, 255, 0, height);
		var rectangle_width = (log(i + 1) - log(i)) * (width / log(spectrum.length));
		rect(x, height, rectangle_width, -h)
	}

    // the mean_freq_index calculation is for the display.
	var nyquist = 22050;
	var mean_freq_index = spectralCentroid / (nyquist / spectrum.length);
	centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);

	stroke('red');
	rect(centroidplot, 0, width / spectrum.length, height);

    noStroke();
    fill('white');
    textSize(40);
    text("centroid: "+round(spectralCentroid)+" Hz", 10, 40);
}
