var xPos = document.documentElement.clientWidth-20;
var yPos = document.documentElement.clientHeight/2;
var step = 0.5;
var delay = 5;
var height = 0;
var Hoffset = 0;
var Woffset = 0;
var yon = 0;
var xon = 0;
var pause = true;
var interval;
img.style.top = yPos;

function changePos() {
width = document.documentElement.clientWidth;
height = document.documentElement.clientHeight;
Hoffset = img.offsetHeight;
Woffset = img.offsetWidth;
img.style.left = xPos + document.documentElement.scrollLeft + "px";
img.style.top = yPos + document.documentElement.scrollTop + "px";
  
if (yon) {
yPos = yPos + step;
}else {
yPos = yPos - step;
}
  
if (yPos < 0) {
yon = 1;
yPos = 0;
}
  
if (yPos >= (height - Hoffset)) {
yon = 0;
yPos = (height - Hoffset);
}
  
if (xon) {
xPos = xPos + step;
}
  else {
xPos = xPos - step;
}
  
if (xPos < 0) {
xon = 1;
xPos = 0;
}
  
if (xPos >= (width - Woffset)) {
xon = 0;
xPos = (width - Woffset);
}
}

function start() {
img.visibility = "visible";
interval = setInterval('changePos()', delay);
}

start();

img.onmouseover = function() {
clearInterval(interval);
interval = null;
}

img.onmouseout = function() {
interval = setInterval('changePos()', delay);
}
