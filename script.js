var canvas, canvasContext;
var carX = 830, carY = 50;
var carSpeedX = 0, carSpeedY = 0;
var targetSpeedX = 0, targetSpeedY = 0;
var timer = 0, timerInterval, startTime = Date.now();
var transitionSpeed = 0.2;
var lastDirection = null;
var carImage;
var angle;
var obstacles = [
  { x: 200, y: 160, width: 350, height: 2 }, // Haut
  { x: 200, y: 160, width: 2, height: 250 }, // Gauche
  { x: 550, y: 160, width: 2, height: 250 }, // Droite
  { x: 200, y: 410, width: 350, height: 2 }, // Bas
  { x: 0, y: 560, width: 600, height: 2 }, // Sol
  { x: 200, y: 720, width: 400, height: 2 },
  { x: 600, y: 720, width: 2, height: 60 },
  { x: 770, y: 0, width: 2, height: 250 },
  { x: 770, y: 750, width: 2, height: 200 },
  { x: 1000, y: 0, width: 2, height: 300 },
  { x: 1100, y: 720, width: 400, height: 2 },
  { x: 1500, y: 660, width: 2, height: 60 },
  { x: 1500, y: 160, width: 2, height: 340 },
  { x: 1300, y: 160, width: 200, height: 2 },
  { x: 1152, y: 500, width: 350, height: 2 },
  { x: 1000, y: 310, width: 230, height: 2 },

  // Ajoutez d'autres obstacles ici
];
var checkpoints = [
  { x: 1490, y: 750, width: 15, height: 150, cleared: false, order: 1 },
  { x: 1490, y: 0, width: 15, height: 150, cleared: false, order: 4},
  { x: 0, y: 160, width: 200, height: 15, cleared: false, order: 3 },
  { x: 0, y: 710, width: 200, height: 15, cleared: false, order: 2 },
  // Ajoutez d'autres checkpoints ici
];

var finishLine = { x: 1670, y: 520, width: 50, height: 120 };
var boostPlates = [
  { x: 1145, y: 315, width: 15, height: 170 },
  { x: 585, y: 570, width: 15, height: 140 },
  // Ajoutez d'autres plaques de boost ici
];


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
    case 37: // gauche
    case 81: // Q
      targetSpeedX = -8;
      break;
    case 38: // haut
    case 90: // Z
      targetSpeedY = -8;
      break;
    case 39: // droite
    case 68: // D
      targetSpeedX = 8;
      break;
    case 40: // bas
    case 83: // S
      targetSpeedY = 8;
      break;
  }
}

function keyUpHandler(e) {
  switch(e.keyCode) {
    case 37: // gauche
    case 39: // droite
    case 81: // Q
    case 68: // D
      targetSpeedX = 0;
      break;
    case 38: // haut
    case 40: // bas
    case 90: // Z
    case 83: // S
      targetSpeedY = 0;
      break;
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
 // Dans updateAll
var totalSpeed = Math.sqrt(carSpeedX * carSpeedX + carSpeedY * carSpeedY);
var angle = 0; // angle par défaut
if (totalSpeed > 100) { // Remplacez 1 par la vitesse minimale à laquelle la voiture peut tourner
  angle = Math.atan2(carSpeedY, carSpeedX);
}
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

// Dans updateAll
for (let obstacle of obstacles) {
  if (carX < obstacle.x + obstacle.width &&
      carX + 50 > obstacle.x &&
      carY < obstacle.y + obstacle.height &&
      carY + 25 > obstacle.y) {
    // Collision détectée, réagissez en conséquence
    carSpeedX *= -0.5;
    carSpeedY *= -0.5;
  }
}



// Dans updateAll
var nextCheckpointOrder = Math.min(...checkpoints.filter(cp => !cp.cleared).map(cp => cp.order));

for (let checkpoint of checkpoints) {
  if (carX < checkpoint.x + checkpoint.width &&
      carX + 50 > checkpoint.x &&
      carY < checkpoint.y + checkpoint.height &&
      carY + 25 > checkpoint.y) {
    // Checkpoint franchi
    if (checkpoint.order === nextCheckpointOrder) {
      checkpoint.cleared = true;
    }
  }
}



// Dans updateAll
var allCheckpointsCleared = checkpoints.every(cp => cp.cleared);
if (allCheckpointsCleared &&
    carX < finishLine.x + finishLine.width &&
    carX + 50 > finishLine.x &&
    carY < finishLine.y + finishLine.height &&
    carY + 25 > finishLine.y) {
  // Arrêt du timer et affichage du temps
  clearInterval(timerInterval);
  alert("Félicitations ! Vous avez terminé en " + (timer / 100) + " secondes.");
}

// Dans updateAll
for (let plate of boostPlates) {
  if (carX < plate.x + plate.width &&
      carX + 50 > plate.x &&
      carY < plate.y + plate.height &&
      carY + 25 > plate.y) {
    // Plaque de boost franchie
    carSpeedX *= 1.5;
    carSpeedY *= 1.5;
  }
}

// Dans updateAll
for (let obstacle of obstacles) {
  if (carX < obstacle.x + obstacle.width &&
      carX + 50 > obstacle.x &&
      carY < obstacle.y + obstacle.height &&
      carY + 25 > obstacle.y) {
    // Collision détectée
    if (carSpeedX > 0 && carX < obstacle.x) { // Se déplace vers la droite
      carX = obstacle.x - 50;
      carSpeedX *= -0.5;
    } else if (carSpeedX < 0 && carX + 50 > obstacle.x + obstacle.width) { // Se déplace vers la gauche
      carX = obstacle.x + obstacle.width;
      carSpeedX *= -0.5;
    }
    if (carSpeedY > 0 && carY < obstacle.y) { // Se déplace vers le bas
      carY = obstacle.y - 25;
      carSpeedY *= -0.5;
    } else if (carSpeedY < 0 && carY + 25 > obstacle.y + obstacle.height) { // Se déplace vers le haut
      carY = obstacle.y + obstacle.height;
      carSpeedY *= -0.5;
    }
  }
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

  // Dans drawAll
// Dessiner les obstacles
canvasContext.fillStyle = 'red';
for (let obstacle of obstacles) {
  canvasContext.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}
// Dessiner les checkpoints
canvasContext.fillStyle = 'yellow';
for (let checkpoint of checkpoints) {
  canvasContext.fillRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
}
// Dessiner la ligne d'arrivée
canvasContext.fillStyle = 'green';
canvasContext.fillRect(finishLine.x, finishLine.y, finishLine.width, finishLine.height);

// Dans drawAll
for (let checkpoint of checkpoints) {
  canvasContext.fillStyle = checkpoint.cleared ? 'gray' : 'yellow';
  canvasContext.fillRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
}

// Dans drawAll
canvasContext.fillStyle = 'blue';
for (let plate of boostPlates) {
  canvasContext.fillRect(plate.x, plate.y, plate.width, plate.height);
}

}
