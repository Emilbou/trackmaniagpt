var canvas;
var canvasContext;
var carX = 50;
var carY = 50;
var carSpeedX = 2;
var carSpeedY = 1;
var acceleration = 1.05;
var timer = 0;
var timerInterval;
var accelerating = false;
var startTime = Date.now();
var walls = [
  { x: 100, y: 0, w: 10, h: 300 },
  { x: 200, y: 300, w: 10, h: 300 },
  { x: 300, y: 0, w: 10, h: 300 },
  { x: 400, y: 300, w: 10, h: 300 }
];



window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasContext = canvas.getContext('2d');
  document.addEventListener('keydown', keyDownHandler);
  timerInterval = setInterval(updateTimer, 10);
  setInterval(updateAll, 50);
}


var targetSpeedX = 0;
var targetSpeedY = 0;
var friction = 0.9;
var turningSpeed = 0.1;

function keyDownHandler(e) {
    accelerating = true;
  switch(e.keyCode) {
    case 37: // Left arrow
      targetSpeedX = -2;
      break;
    case 38: // Up arrow
      targetSpeedY = -2;
      break;
    case 39: // Right arrow
      targetSpeedX = 2;
      break;
    case 40: // Down arrow
      targetSpeedY = 2;
      break;
  }
}


function updateTimer() {
  timer = (Date.now() - startTime) / 10;
}

    function updateAll() {
  carX += carSpeedX;
  carY += carSpeedY;

if (accelerating) {
    carSpeedX *= acceleration;
    carSpeedY *= acceleration;
  } else {
    // Apply "drift" effect
    carSpeedX += (targetSpeedX - carSpeedX) * turningSpeed;
    carSpeedY += (targetSpeedY - carSpeedY) * turningSpeed;

    // Apply friction
    carSpeedX *= friction;
    carSpeedY *= friction;
  }

  accelerating = false;

  // Empêcher la voiture de dépasser les bords de l'écran
  if (carX < 0) {
    carX = 0;
    carSpeedX *= 0.5;
  }
  if (carX > canvas.width - 50) {
    carX = canvas.width - 50;
    carSpeedX *= 0.5;
  }
  if (carY < 0) {
    carY = 0;
    carSpeedY *= 0.5;
  }
  if (carY > canvas.height - 25) {
    carY = canvas.height - 25;
    carSpeedY *= 0.5;
  }
    var hitWall = false;

    // Check for wall collision
    walls.forEach(function(wall) {
        if (carX < wall.x + wall.w &&
            carX + 50 > wall.x &&
            carY < wall.y + wall.h &&
            carY + 25 > wall.y) {
        carSpeedX *= 0.5;
        carSpeedY *= 0.5;
        hitWall = true;
        }
    });

  if (!hitWall) {
    carSpeedX *= acceleration;
    carSpeedY *= acceleration;
  }

  drawAll();
 // Apply "drift" effect
  carSpeedX += (targetSpeedX - carSpeedX) * turningSpeed;
  carSpeedY += (targetSpeedY - carSpeedY) * turningSpeed;

  // Apply friction
  carSpeedX *= friction;
  carSpeedY *= friction;

  // Apply acceleration
  if (carSpeedX !== 0 || carSpeedY !== 0) {
    currentAcceleration *= acceleration;
  } else {
    currentAcceleration = 1;
  }

  carX += carSpeedX * currentAcceleration;
  carY += carSpeedY * currentAcceleration;


}

function drawAll() {
  // Draw background
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  // Draw walls
  canvasContext.fillStyle = 'grey';
  walls.forEach(function(wall) {
    canvasContext.fillRect(wall.x, wall.y, wall.w, wall.h);
  });

  // Draw car
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(carX, carY, 50, 25);

  // Draw timer
  canvasContext.fillStyle = 'white';
  canvasContext.font = '20px Arial';
  canvasContext.fillText('Time: ' + timer / 100 + 's', 10, 20);
}
