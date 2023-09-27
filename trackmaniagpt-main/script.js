var canvas, canvasContext;
var carX = 50, carY = 50;
var carSpeedX = 0, carSpeedY = 0;
var targetSpeedX = 0, targetSpeedY = 0;
var timer = 0, timerInterval, startTime = Date.now();
var transitionSpeed = 0.2;
var lastDirection = null;
var carImage;


window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasContext = canvas.getContext('2d');
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);
  timerInterval = setInterval(updateTimer, 10);
  setInterval(updateAll, 50);
  carImage = new Image();
  carImage.src = 'assets/voiture.png';
}

function keyDownHandler(e) {
  switch(e.keyCode) {
    case 37: targetSpeedX = -8; break;
    case 38: targetSpeedY = -8; break;
    case 39: targetSpeedX = 8; break;
    case 40: targetSpeedY = 8; break;
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
  var isDiagonal = targetSpeedX !== 0 && targetSpeedY !== 0;

  // Update speed based on target and transition
  carSpeedX += (targetSpeedX - carSpeedX) * transitionSpeed;
  carSpeedY += (targetSpeedY - carSpeedY) * transitionSpeed;

  // Normalize diagonal speed
  if (isDiagonal) {
    carSpeedX /= Math.sqrt(2);
    carSpeedY /= Math.sqrt(2);
  }

  // Calculate total speed for determining straight line or turn
  var totalSpeed = Math.sqrt(carSpeedX * carSpeedX + carSpeedY * carSpeedY);

  // Apply acceleration or deceleration based on direction
  var currentAcceleration = 1.02 + Math.log(1 + totalSpeed) / 50;
  var currentDeceleration = 0.99;

  if (targetSpeedX !== 0 || targetSpeedY !== 0) {
    carSpeedX *= currentAcceleration;
    carSpeedY *= currentAcceleration;
  } else {
    carSpeedX *= currentDeceleration;
    carSpeedY *= currentDeceleration;
  }

  // Re-normalize diagonal speed after applying acceleration or deceleration
  if (isDiagonal) {
    carSpeedX *= Math.sqrt(2);
    carSpeedY *= Math.sqrt(2);
  }

  // Update car position
  carX += carSpeedX;
  carY += carSpeedY;



  // Déterminer la direction actuelle
  var currentDirection = '';
  if (targetSpeedX > 0) currentDirection += 'R';
  if (targetSpeedX < 0) currentDirection += 'L';
  if (targetSpeedY > 0) currentDirection += 'D';
  if (targetSpeedY < 0) currentDirection += 'U';




  // Mettre à jour la dernière direction
  lastDirection = currentDirection;
  
  if (targetSpeedX !== 0 && targetSpeedY !== 0) {
    carSpeedX *= currentDeceleration;
    carSpeedY *= currentDeceleration;
  } else {
    carSpeedX *= currentAcceleration;
    carSpeedY *= currentAcceleration;
  }

  // Vérifier si la voiture est en train de tourner
  var isTurning = targetSpeedX !== 0 && targetSpeedY !== 0;






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
 // Calculer l'angle de rotation en radians
  var angle = Math.atan2(carSpeedY, carSpeedX);
  
  // Sauvegarder l'état actuel du contexte
  canvasContext.save();
  
  // Translatez le contexte à la position de la voiture
  canvasContext.translate(carX + 25, carY + 12.5); // 25 et 12.5 sont la moitié de la largeur et de la hauteur de la voiture
  
  // Appliquer la rotation
  canvasContext.rotate(angle);
  
  // Dessiner l'image de la voiture
  canvasContext.drawImage(carImage, -25, -12.5, 100, 50); // Dessiner l'image de manière à ce que son centre soit à l'origine
  
  // Restaurer l'état du contexte
  canvasContext.restore();

  
  // Afficher le timer en haut à gauche
  canvasContext.fillStyle = 'white';
  canvasContext.font = '20px Arial';
  canvasContext.fillText('Time: ' + timer / 100 + 's', 10, 20);
  
  // Calculer et afficher la vitesse en haut à droite
  var speed = Math.sqrt(carSpeedX * carSpeedX + carSpeedY * carSpeedY);
  speed = Math.round(speed * 100) / 100; // Arrondir à deux décimales
  canvasContext.fillText('Speed: ' + speed + ' px/s', canvas.width - 150, 20);
}
