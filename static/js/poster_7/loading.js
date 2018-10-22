
   /////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const OPTS = {
    fill:           'none',
    radius:         25,
    strokeWidth:    { 50 : 0 },
    scale:          { 0: 1 },
    duration:       200,
    left: 0,        top: 0,
    easing: 'cubic.out'
};

const mainCircle = new mojs.Shape(Object.assign({}, OPTS, {
    stroke:         '#57c2fb',
}));

const smallCircles = [];
const colors = [ 'deeppink', '#65246a', '#e73f34', '#00F87F' ]

for ( let i = 0; i < 4; i++ )
{
    let c = new mojs.Shape( Object.assign({}, OPTS, {
        parent:         mainCircle.el,
        radius:         { 0 : 15 },
        strokeWidth:    { 30: 0 },
        left: '50%',    top: '50%',
        stroke:         colors[ i % colors.length],
        delay:          'rand(0, 350)',
        x:              'rand(-50, 50)',
        y:              'rand(-50, 50)',
        radius:         'rand(5, 20)'
    }));
    smallCircles.push(c);
}


function setLoading()
{
  wg.loading = true;
  window.setTimeout(loading, 1500);
}

function unsetLoading()
{
  wg.loading = false;
}

function loading(e) {    
     mainCircle
      .tune({ x: canvas.offsetLeft + canvas.width / 2, y: canvas.offsetTop + canvas.height / 2  })
      .replay();
    
      for ( let i = 0; i < smallCircles.length; i++ ) {
        smallCircles[i]
          .generate()
          .replay(); 
      }
    if (window.globals.loading)
      window.setTimeout(loading, 1000);
    else
      mainCircle.tune({ x: -100, y: -100});
  }
