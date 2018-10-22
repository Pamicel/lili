ALL = {
    lineHeight : 500,
    spaceWidth : 310,
    agitationFactors : [],
    
    // height
    // width
    // text
    // lines
    // soundSource
    // buffer
    
    pos : [],
    posAnker : [],
    vel : [],
    // letterCenters : [],

    // colors
    // colorsRateOfChange
    scaleFactor : 1,

    // totalHeight
    maxLineWidth : 0,

}

function setupAllLetters()
{
    let newObj = {};
    for (letter in allLetters)
        newObj[letter] = engrave(JSON.parse(allLetters[letter]));
    allLetters = newObj;
}

function parseTextarea()
{
    const Y_START = 20;

    ALL.text = document.getElementById('textarea').value;
    ALL.maxLineWidth = 0;
    // Restart arrays :
    ALL.lines = [[[]]];
    ALL.pos = [];
    ALL.vel = [];
    ALL.posAnker = [];

    var lineIndex = 0;
    var wordIndex = 0;
    var nNodes = 0;
    var xShift = 0;
    var yShift = Y_START;
    var lineWidth = 0;
    var len = ALL.text.length;

    for (let i = 0; i < len; i++)
    {
        if (ALL.text[i] == '\n')
        {
            ALL.lines.push([[]]);
            lineIndex++;
            wordIndex = 0;
            nNodes = 0;
            xShift = 0;
            yShift = ALL.lineHeight * lineIndex;
            if (lineWidth > ALL.maxLineWidth)
                ALL.maxLineWidth = lineWidth;
            lineWidth = 0
        }
        else if (ALL.text[i] == ' ')
        {
            lineWidth += ALL.spaceWidth;
            xShift += ALL.spaceWidth;
            while(ALL.text[i + 1] == ' ')
            {
                i++;
                lineWidth += ALL.spaceWidth;
                xShift += ALL.spaceWidth;
            }
            ALL.lines[lineIndex].push([]);
            wordIndex++;
        }
        else
        {
            let letter = allLetters[ALL.text[i]];
            if (letter)
            {
                lineWidth += letter.dimensions.encombrement;
                nNodes= letter.nodes.length;
                ALL.lines[lineIndex][wordIndex].push(nNodes);
                for (let i = 0; i < nNodes; i++)
                {
                    let x = letter.nodes[i].pos.x + xShift + letter.dimensions.encombrement / 2;
                    let y = letter.nodes[i].pos.y + yShift + letter.dimensions.hcorps / 2;
                    ALL.pos.push([x, y]);
                    ALL.posAnker.push([x, y]);
                }
                xShift += letter.dimensions.encombrement;
            }
        }
    }
    ALL.totalHeight = ALL.lineHeight * ALL.lines.length;
    // In case there is only one line and no '/n'
    if (lineWidth > ALL.maxLineWidth)
    {
        ALL.maxLineWidth = lineWidth;
        console.log('\n');
    }
    // allways immediatly scale at the end of a parsing
    scaleText();
    return (ALL.pos.length);
}

// function unScaleText() {
//     function unScale2D(array) {
//         array = array.map(([x, y]) => {return ([x / ALL.scaleFactor, y / ALL.scaleFactor])});
//         return (array);
//     }

//     if (ALL.scaleFactor < 1)
//     {
//         ALL.pos = unScale2D(ALL.pos);
//         ALL.vel = unScale2D(ALL.vel);
//         ALL.posAnker = unScale2D(ALL.posAnker);
//         ALL.scaleFactor = 1;
//     }
// }

function scaleText() {
    var vw = ALL.width;
    var vh = ALL.height;
    var txtW = ALL.maxLineWidth;
    var txtH = ALL.totalHeight;
    var scale = min(vw / txtW, vh / txtH);
    function scale2D(array) {
        array = array.map(([x, y]) => {return ([x * scale, y * scale])});
        return (array);
    }

    if (scale < 1)
    {
        ALL.pos = scale2D(ALL.pos);
        ALL.vel = scale2D(ALL.vel);
        ALL.posAnker = scale2D(ALL.posAnker);
        ALL.scaleFactor = scale;
    }
    else
    {
        ALL.scaleFactor = 1;
    }
}












////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/*
                                    VIEW
                                                                              */



const PADDING = 20;

function windowResized() {
    // unScaleText();
    // scaleText();
    parseTextarea();
    resizeCanvas(windowWidth - PADDING * 2, windowHeight - PADDING * 2);
    ALL.width   = windowWidth - PADDING * 2;
    ALL.height  = windowHeight - PADDING * 2;

}

function setup()
{
    var canvas  = createCanvas(windowWidth - PADDING * 2, windowHeight - PADDING * 2);
    ALL.width   = windowWidth - PADDING * 2;
    ALL.height  = windowHeight - PADDING * 2;
    document.getElementById("container").style.padding = PADDING;
    document.getElementById("container").style.background = 'white';
    canvas.parent("container");
    setupAllLetters();
    parseTextarea();
    fill('red');
    noStroke();
}

function draw()
{
    background(255);
    d = ALL.scaleFactor * 10;
    if (d > 2)
    {
        noStroke();
        fill('red');
        for(i in ALL.pos)
            ellipse(ALL.pos[i][0], ALL.pos[i][1], d, d);
    }
    else
    {
        stroke('red');
        noFill();
        for (i in ALL.pos)
            point(ALL.pos[i][0], ALL.pos[i][1]);
    }
}

