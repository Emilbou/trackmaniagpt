var canvas, canvasContext;
var carX = 50, carY = 50;
var carSpeedX = 0, carSpeedY = 0;
var targetSpeedX = 0, targetSpeedY = 0;
var acceleration = 1.10; // Augmentation du facteur d'accélération
var timer = 0, timerInterval, startTime = Date.now();
var transitionSpeed = 0.2;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasContext = canvas.getContext('2d');
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);
  timerInterval = setInterval(updateTimer, 10);
  setInterval(updateAll, 50);
}

function keyDownHandler(e) {
  switch(e.keyCode) {
    case 37: targetSpeedX = -4; break;
    case 38: targetSpeedY = -4; break;
    case 39: targetSpeedX = 4; break;
    case 40: targetSpeedY = 4; break;
  }
}

function keyUpHandler(e) {
  switch(e.keyCode) {
    case 37: case 39: targetSpeedX = 0; break;
    case 38: case 40: targetSpeedY = 0; break;
  }
}

function updateTimer() {
  timer = (Date.now() - startTime) / 10;
}

function updateAll() {
  carSpeedX += (targetSpeedX - carSpeedX) * transitionSpeed;
  carSpeedY += (targetSpeedY - carSpeedY) * transitionSpeed;

  carX += carSpeedX;
  carY += carSpeedY;

  // Apply acceleration
  if (targetSpeedX !== 0 || targetSpeedY !== 0) {
    carSpeedX *= acceleration;
    carSpeedY *= acceleration;
  }

  // Prevent the car from going off-screen
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

  drawAll();
}

function drawAll() {
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(carX, carY, 50, 25);
  canvasContext.fillStyle = 'white';
  canvasContext.font = '20px Arial';
  canvasContext.fillText('Time: ' + timer / 100 + 's', 10, 20);
}
