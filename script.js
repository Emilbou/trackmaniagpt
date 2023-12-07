
var canvas, canvasContext;
var countdown = 3; // Compte à rebours initial
var gameStarted = false; // État du jeu
var imagesLoaded = 0;
var totalImages = 1; // Mettez à jour ce nombre en fonction du nombre total d'images


var carX = 830, carY = 50;
var carSpeedX = 0, carSpeedY = 0;
var targetSpeedX = 0, targetSpeedY = 0;
var timer = 0, timerInterval, startTime = Date.now();
var transitionSpeed = 0.2;
var lastDirection = null;
var carImage;
var angle;
var obstacles = [
  { x: 200, y: 160, width: 350, height: 10 }, // Haut
  { x: 200, y: 160, width: 10, height: 250 }, // Gauche
  { x: 550, y: 160, width: 10, height: 250 }, // Droite
  { x: 200, y: 410, width: 350, height: 10 }, // Bas
  { x: 0, y: 560, width: 600, height: 10 }, // Sol
  { x: 200, y: 720, width: 400, height: 10 },
  { x: 600, y: 720, width: 10, height: 60 },
  { x: 770, y: 0, width: 10, height: 250 },
  { x: 770, y: 750, width: 10, height: 200 },
  { x: 1000, y: 0, width: 10, height: 300 },
  { x: 1100, y: 720, width: 400, height: 10 },
  { x: 1500, y: 660, width: 10, height: 60 },
  { x: 1500, y: 160, width: 10, height: 340 },
  { x: 1300, y: 160, width: 200, height: 10 },
  { x: 1152, y: 500, width: 350, height: 10 },
  { x: 1000, y: 310, width: 230, height: 10 },

  // Ajoutez d'autres obstacles ici
];
var obstacleTexture = new Image();
obstacleTexture.src = 'assets/textures/theWall.png';

// Assurez-vous que votre canvas est correctement sélectionné et que le contexte 2D est initialisé
var canvas = document.getElementById('gameCanvas'); // Remplacez 'yourCanvasId' par l'ID de votre élément canvas
var canvasContext = canvas.getContext('2d');



obstacleTexture.onload = function() {
  // Créer le motif uniquement après le chargement complet de l'image
  var pattern = canvasContext.createPattern(obstacleTexture, 'repeat');

  obstacles.forEach(function(obstacle) {
    // Appliquer le motif
    canvasContext.fillStyle = pattern;
    canvasContext.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
};

// Assurez-vous que le reste de votre code qui interagit avec le canvasContext se trouve après l'initialisation de celui-ci.


var checkpoints = [
  { x: 1490, y: 750, width: 15, height: 150, cleared: false, order: 1 },
  { x: 1490, y: 0, width: 15, height: 150, cleared: false, order: 2},
  { x: 0, y: 160, width: 200, height: 15, cleared: false, order: 3 },
  { x: 0, y: 710, width: 200, height: 15, cleared: false, order: 4 },
  // Ajoutez d'autres checkpoints ici
];

var finishLine = { x: 1670, y: 520, width: 50, height: 120 };
var boostPlates = [
  { x: 1145, y: 315, width: 15, height: 170 },
  { x: 585, y: 570, width: 15, height: 140 },
  // Ajoutez d'autres plaques de boost ici
];

var ramps = [
  { x: 800, y: 400, width: 50, height: 50, inAir: false }
];


// Détection de collision avec le tramplin
for (let ramp of ramps) {
  if (carX < ramp.x + ramp.width &&
      carX + 50 > ramp.x &&
      carY < ramp.y + ramp.height &&
      carY + 25 > ramp.y) {
    // Appliquer une décélération moins importante
    carSpeedX *= 0.8;
    carSpeedY *= 0.8;

    // Mettre la voiture en l'air
    ramp.inAir = true;
  }
}



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
  startCountdown();
setupButtonControls();
}

function keyDownHandler(e) {
  if (!gameStarted) return;
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
  if (!gameStarted) return;
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

function handleButtonPress(buttonId) {
  if (!gameStarted) return;
  switch(buttonId) {
    case 'left': // Bouton gauche
      targetSpeedX = -8;
      break;
    case 'up': // Bouton haut
      targetSpeedY = -8;
      break;
    case 'right': // Bouton droite
      targetSpeedX = 8;
      break;
    case 'down': // Bouton bas
      targetSpeedY = 8;
      break;
  }
}

function setupButtonControls() {
  var buttons = ['up', 'down', 'left', 'right'];
  buttons.forEach(buttonId => {
    var button = document.getElementById(buttonId);
    button.addEventListener('mousedown', () => handleButtonPress(buttonId));
    button.addEventListener('mouseup', () => resetTargetSpeed());
    button.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonPress(buttonId); }, false);
    button.addEventListener('touchend', (e) => { e.preventDefault(); resetTargetSpeed(); }, false);
  });
}

function resetTargetSpeed() {
  targetSpeedX = 0;
  targetSpeedY = 0;
}


function updateTimer() {
  if (gameStarted) {
    timer = (Date.now() - startTime) / 10;
  }
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

var totalSpeed = Math.sqrt(carSpeedX * carSpeedX + carSpeedY * carSpeedY);
var angle = 0; // angle par défaut
if (totalSpeed > 100) { // Remplacez 1 par la vitesse minimale à laquelle la voiture peut tourner
  angle = Math.atan2(carSpeedY, carSpeedX);
}
  // Apply acceleration or deceleration based on direction
  var currentAcceleration = 1.029 + Math.log(1 + totalSpeed) / 50;
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

for (let obstacle of obstacles) {
  if (carX < obstacle.x + obstacle.width &&
      carX + 50 > obstacle.x &&
      carY < obstacle.y + obstacle.height &&
      carY + 25 > obstacle.y) {
    // Collision détectée
    if (carSpeedX > 0 && carX < obstacle.x) { // Se déplace vers la droite
      carX = obstacle.x - 50;
      carSpeedX = 0; // Arrêtez la voiture en réinitialisant la vitesse
    } else if (carSpeedX < 0 && carX + 50 > obstacle.x + obstacle.width) { // Se déplace vers la gauche
      carX = obstacle.x + obstacle.width;
      carSpeedX = 0; // Arrêtez la voiture
    }
    if (carSpeedY > 0 && carY < obstacle.y) { // Se déplace vers le bas
      carY = obstacle.y - 25;
      carSpeedY = 0; // Arrêtez la voiture
    } else if (carSpeedY < 0 && carY + 25 > obstacle.y + obstacle.height) { // Se déplace vers le haut
      carY = obstacle.y + obstacle.height;
      carSpeedY = 0; // Arrêtez la voiture
    }
  }
}



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



var allCheckpointsCleared = checkpoints.every(cp => cp.cleared);
if (allCheckpointsCleared &&
    carX < finishLine.x + finishLine.width &&
    carX + 50 > finishLine.x &&
    carY < finishLine.y + finishLine.height &&
    carY + 25 > finishLine.y) {
  // Arrêt du timer et affichage du temps
  clearInterval(timerInterval);
  localStorage.setItem('bestTime', timer/100);
  window.location.href = 'win.html';
}

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



 for (let ramp of ramps) {
    if (carX < ramp.x + ramp.width &&
        carX + 50 > ramp.x &&
        carY < ramp.y + ramp.height &&
        carY + 25 > ramp.y) {
      // Appliquer la décélération
      carSpeedX *= 0.5;
      carSpeedY *= 0.5;

      // Mettre la voiture en l'air
      ramp.inAir = true;
    }
  }

  for (let ramp of ramps) {
    if (ramp.inAir) {
      // La durée du saut est proportionnelle à la vitesse
      var jumpDuration = Math.sqrt(carSpeedX * carSpeedX + carSpeedY * carSpeedY);

      // TODO: Ajouter le code pour gérer le saut et l'atterrissage
    }
  }

  // Dans updateAll
for (let ramp of ramps) {
  if (carX < ramp.x + ramp.width &&
      carX + 50 > ramp.x &&
      carY < ramp.y + ramp.height &&
      carY + 25 > ramp.y) {
    // Appliquer la décélération
    carSpeedX *= 0.5;
    carSpeedY *= 0.5;

    // Mettre la voiture en l'air
    ramp.inAir = true;
  }
}

// Vérifier si la voiture est en contact avec le sol
var onGround = obstacles.some(obstacle => {
  return carX < obstacle.x + obstacle.width &&
         carX + 50 > obstacle.x &&
         carY < obstacle.y + obstacle.height &&
         carY + 25 > obstacle.y;
});

// Si la voiture est en contact avec le sol, réinitialiser l'état inAir
if (onGround) {
  ramps.forEach(ramp => ramp.inAir = false);
}

  drawAll();
}

function drawAll() {
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'white';

  var angle = Math.atan2(carSpeedY, carSpeedX);
  

  canvasContext.save();
  
  canvasContext.translate(carX + 25, carY + 12.5); 
  canvasContext.rotate(angle);
  

  canvasContext.restore();

  
  canvasContext.fillStyle = 'white';
  canvasContext.font = '20px Arial';
  canvasContext.fillText('Time: ' + timer / 100 + 's', 10, 20);
  
  var speed = Math.sqrt(carSpeedX * carSpeedX + carSpeedY * carSpeedY);
  speed = Math.round(speed * 100) / 100; // Arrondir à deux décimales
  canvasContext.fillText('Speed: ' + speed + ' px/s', canvas.width -10, 20);

for (let obstacle of obstacles) {
  canvasContext.drawImage(obstacleTexture, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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
 if (!gameStarted) {
    canvasContext.fillStyle = 'white';
    canvasContext.font = '50px Arial';
    canvasContext.fillText(countdown, canvas.width / 2, canvas.height / 2);
  }


   // Dessiner le tramplin
  canvasContext.fillStyle = 'purple';
  for (let ramp of ramps) {
    canvasContext.fillRect(ramp.x, ramp.y, ramp.width, ramp.height);
  }

// Calculer l'angle de rotation en radians
  var angle = Math.atan2(carSpeedY, carSpeedX);

  // Sauvegarder l'état actuel du contexte
  canvasContext.save();

  // Translatez le contexte à la position de la voiture
  canvasContext.translate(carX + 25, carY + 12.5);

  // Appliquer la rotation
  canvasContext.rotate(angle);

// Vérifier si la voiture est en l'air
var inAir = ramps.some(ramp => ramp.inAir);

// Ajuster la taille de la voiture si elle est en l'air
var scale = inAir ? 1.5 : 1;

// Dessiner l'image de la voiture
canvasContext.drawImage(carImage, -25 * scale, -12.5 * scale, 50 * scale, 25 * scale);
  // Restaurer l'état du contexte
  canvasContext.restore();

}


function startCountdown() {
  var countdownInterval = setInterval(function() {
    if (countdown > 0) {
      console.log(countdown); // ou affichez-le sur le canvas
      countdown--;
    } else {
      clearInterval(countdownInterval);
      gameStarted = true; // Démarrez le jeu
      startTime = Date.now(); // Démarrez le timer
    }
  }, 1000);
}
