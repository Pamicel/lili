// Thanks to the following: 
// https://github.com/ironwallaby/delaunay.git
// http://gradients.io/
// https://uigradients.com

let color_group = [], fill_color = [], number_of_triangles = 100;

const gradients = [
  {
    name: 'mimosa',
    colors: [
    ['#D74177', '#FFE98A'],
    ['#3A1C71', '#D76D77'],
    ['#e96443', '#904e95'],
    ['#ff7e5f', '#feb47b']
  ]},
  {
    name: 'sea',
    colors: [
    ['#00A8C5', '#FFFF7E'],
    ['#0cebeb', '#20e3b2'],
    ['#007991', '#78ffd6'],
    ['#1CD8D2', '#93EDC7']
  ]},
  {
    name: 'great-good',
    colors: [
    ['#D4145A', '#FBB03B'],
    ['#C04848', '#480048'],
    ['#cc2b5e','#753a88'],
    ['#C33764', '#1D2671']
  ]},
  {
    name: 'metal',
    colors: [
    ['#E8CBC0', '#636FA4'],
    ['#DBE6F6', '#C5796D'],
    ['#F3904F', '#3B4371'],
    ['#DAE2F8', '#D6A4A4']
  ]},
  {
    name: 'warm-military',
    colors: [
    ['#FFA17F', '#00223E'],
    ['#556270', '#FF6B6B'],
    ['#F0C27B', '#1F1C2C'],
    ['#ff7e5f', '#00223E']
  ]}
];

function randNum(min, max){
  return Math.floor(Math.random() * (max-min + 1)) + min;
}

const resizeCanvas = function(){
  const canvas = document.querySelector('canvas');
  canvas.width = window.screen.availWidth;
  canvas.height = window.screen.availHeight;
}

function pointsArray(){
  let points = [];
  while(points.length < number_of_triangles){
    points.push([randNum(-50, window.screen.availWidth), randNum(-50, window.screen.availHeight)])
  }
  points.push([0,0], [window.screen.availWidth, 0], [0, window.screen.availHeight], [window.screen.availWidth, window.screen.availHeight])
  return points
}

const chooseColor = function(value){
  var color_choice = gradients.find(function(obj){
    return obj.name === value
  })
  var colors;
  if (color_choice) {
    colors = color_choice.colors
  } else {
    colors = gradients[randNum(0, gradients.length-1)].colors;
  }
  return colors;
}

const convertToTriangles = function(value){
  color_group = chooseColor(value);
  const ctx = document.querySelector('canvas').getContext('2d');
  ctx.fillStyle = color_group[randNum(0, color_group.length-1)][randNum(0,1)];
  ctx.fillRect(0, 0, window.screen.availWidth, window.screen.availHeight);
  var vertices = pointsArray();
  var triangles = Delaunay.triangulate(vertices);
  for(i = triangles.length; i; ) {
    var x_arr = [], y_arr = [];
    ctx.beginPath();
    --i; 
    x_arr.push(vertices[triangles[i]][0]);
    y_arr.push(vertices[triangles[i]][1]);
    ctx.moveTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
    --i; 
    x_arr.push(vertices[triangles[i]][0]);
    y_arr.push(vertices[triangles[i]][1]);
    ctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
    --i; 
    x_arr.push(vertices[triangles[i]][0]);
    y_arr.push(vertices[triangles[i]][1]);
    ctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
    ctx.closePath();
    var start_x_point = x_arr[randNum(0, x_arr.length - 1)];
    x_arr.splice(x_arr.indexOf(start_x_point), 1);
    var end_x_point = x_arr[randNum(0, x_arr.length - 1)];
    var start_y_point = y_arr[randNum(0, y_arr.length - 1)];
    y_arr.splice(y_arr.indexOf(start_y_point), 1);
    var end_y_point = y_arr[randNum(0, y_arr.length - 1)];
    var start_point = [start_x_point, start_y_point];
    var end_point = [end_x_point, end_y_point];
    var points = [start_point, end_point];
    fill_color = color_group[randNum(0, color_group.length-1)];
    ctx.fillStyle = gradient(ctx, points, fill_color);
    ctx.fill();
    ctx.strokeStyle = gradient(ctx, points, fill_color);
    ctx.stroke();
  }
}

function changeLinkColors(index, color1, color2){
  document.documentElement.style.setProperty(('--start-color-'+index), color1);
  document.documentElement.style.setProperty(('--end-color-'+index), color2);
}
var gradient = function (ctx, points, color){
  let grd = ctx.createLinearGradient(points[0][0],points[0][1],points[1][0],points[1][1]);
  grd.addColorStop(0, color[0]);
  grd.addColorStop(1, color[1]);
  return grd;
}

function drawBackground(value){
  convertToTriangles(value);
  const links = document.querySelectorAll('a');
  for (var i = 0; i<links.length; i++){
    changeLinkColors(i+1, fill_color[0], fill_color[1]); links[i].addEventListener('mouseenter', function(e){
      var index = 0;
      while( e.target !== links[index] ) 
        index++;
      let hover_color = color_group[randNum(0, color_group.length-1)];
      while(hover_color[0] === fill_color[0]){
        hover_color = color_group[randNum(0, color_group.length-1)];
      }
      changeLinkColors(index+1, hover_color[0], hover_color[1]);
    });
    links[i].addEventListener('mouseleave', function(e){
      var index = 0;
      while( e.target !== links[index] ) 
        index++;
      changeLinkColors(index+1, fill_color[0], fill_color[1])
    })
  }
}

window.onload = function(){
  resizeCanvas();
  drawBackground(document.querySelector('#color-schemes :checked'));
  var inputs = document.querySelectorAll('input');
  for(var i = 0; i < inputs.length; i++){
    inputs[i].addEventListener('change', function(e){
      number_of_triangles = document.getElementById('triangle_count').value;
      drawBackground(document.querySelector('#color-schemes :checked').id);
  });
  }
}