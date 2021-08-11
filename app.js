// ----------------------------------------------
// VARIABLES
// ----------------------------------------------

// variables DOM
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let displayScore = document.querySelector(".score");
let winLose = document.querySelector(".win-lose");
let statsScore = document.querySelector(".stats-score");
// variables balle et barre
let rayonBalle = 10,
	barreHeight = 12,
	barreWidth = 75;

let x = canvas.width / 2,
	y = canvas.height - 30,
	barreX = (canvas.width - barreWidth) / 2,
	fin = false,
	vitesseX = 5,
	vitesseY = -5;

// variables briques
const nbCol = 8,
	nbRow = 5,
	largeurBrique = 75,
	hauteurBrique = 20;

const colors = [
	"#FF6633",
	"#FFB399",
	"#FF33FF",
	"#FFFF99",
	"#00B3E6",
	"#E6B333",
	"#3366E6",
	"#999966",
	"#99FF99",
	"#B34D4D",
	"#80B300",
	"#809900",
	"#E6B3B3",
	"#6680B3",
	"#66991A",
	"#FF99E6",
	"#CCFF1A",
	"#FF1A66",
	"#E6331A",
	"#33FFCC",
	"#66994D",
	"#B366CC",
	"#4D8000",
	"#B33300",
	"#CC80CC",
	"#66664D",
	"#991AFF",
	"#E666FF",
	"#4DB3FF",
	"#1AB399",
	"#E666B3",
	"#33991A",
	"#CC9999",
	"#B3B31A",
	"#00E680",
	"#4D8066",
	"#809980",
	"#E6FF80",
	"#1AFF33",
	"#999933",
	"#FF3380",
	"#CCCC00",
	"#66E64D",
	"#4D80CC",
	"#9900B3",
	"#E64D66",
	"#4DB380",
	"#FF4D4D",
	"#99E6E6",
	"#6666FF",
];

// gestion de l'animation
let endGame = false;

// variable de score
let score = 0;
// ----------------------------------------------
// FONCTIONS
// ----------------------------------------------

// 1 - fonction pour intiliser le jeu et son démarrage selon mobile ou pc
function initGame() {
	if (
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i)
	) {
		draw();
	} else {
		dessineBriques();
		dessineBalle();
		dessineBarre();
		document.addEventListener("keypress", (e) => {
			if (e.keyCode === 32) {
				// console.log(e.keyCode);
				draw();
			}
		});
	}
}

// 2 - fonction pour dessiner la balle
function dessineBalle() {
	ctx.beginPath();
	ctx.arc(x, y, rayonBalle, 0, Math.PI * 2);
	ctx.fillStyle = "#E01012";
	ctx.fill();
	ctx.closePath();
}

// 3 - fonction opur dessiner la raquette
function dessineBarre() {
	ctx.beginPath();
	ctx.rect(barreX, canvas.height - barreHeight, barreWidth, barreHeight);
	ctx.fillStyle = "#121012";
	ctx.fill();
	ctx.closePath();
}

// 4 - création du tableau des briques et des cellules par double boucle for
// Tableau avec toutes les briques
const briques = [];
for (let i = 0; i < nbRow; i++) {
	// on crée un tableau vide pour chaque rangée
	briques[i] = [];
	// on boucle après pour créer les colonnes afin d'avoir des cellules
	for (let j = 0; j < nbCol; j++) {
		// on remplit chaque cellule avec un objet
		briques[i][j] = { x: 0, y: 0, statut: 1 };
	}
}
// console.log(briques);

// 5 - fonction pour dessiner les briques
function dessineBriques() {
	for (let i = 0; i < nbRow; i++) {
		for (let j = 0; j < nbCol; j++) {
			// couleurs aléatoires
			let color = colors[Math.floor(Math.random() * (colors.length + 1))];
			if (briques[i][j].statut === 1) {
				// 75 * 8 + 10 * 8 + 35 = 750
				let briqueX = j * (largeurBrique + 10) + 35;
				let briqueY = i * (hauteurBrique + 10) + 30;

				briques[i][j].x = briqueX;
				briques[i][j].y = briqueY;
				// console.log(briqueX, briqueY);

				ctx.beginPath();
				ctx.rect(briqueX, briqueY, largeurBrique, hauteurBrique);
				ctx.fillStyle = "#F97314";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

// 6 - Gestion de l'animation et du dessin des formes
function draw() {
	if (endGame === false) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		dessineBriques();
		dessineBalle();
		dessineBarre();
		// appel de la fonction collisionDetection()
		collisionDetection();

		// rebond sur les côtés
		// on applique rayon balle pour permettre que la balle rebondiqqe à partir de son côté
		if (x + vitesseX > canvas.width - rayonBalle || x + vitesseX < rayonBalle) {
			vitesseX = -vitesseX;
		}
		if (y + vitesseY < rayonBalle) {
			vitesseY = -vitesseY;
		}
		if (score >= 15) {
			barreWidth = 60;
		}
		if (score >= 23) {
			barreWidth = 50;
		}
		if (score >= 30) {
			barreWidth = 40;
		}
		if (score === nbCol * nbRow) {
			barreWidth = 0;
			rayonBalle = 0;
		}
		if (y + vitesseY > canvas.height - rayonBalle) {
			// soit on est sur notre barre et on rebondit
			if (x > barreX && x < barreX + barreWidth) {
				vitesseX += 0.1;
				vitesseY += 0.1;
				vitesseY = -vitesseY;
			} else {
				barreWidth = 0;
				rayonBalle = 0;
				// soit on perd et cela met fin au jeu
				endGame = true;
				winLose.innerText =
					"Vous avez perdu. Cliquez sur le jeu pour recommencer";

				// stockage du score dans le local storage
				if (endGame === true) {
					if (localStorage.getItem("score")) {
						// console.log(score);
						compareScores(score);
						storeScore(score);
					} else {
						storeScore(score);
					}
				}
			}
		}
		// on crée l'animation
		requestAnimationFrame(draw);
		x += vitesseX;
		y += vitesseY;
	}
}

// 7 - Gestion collision et destruction briques
function collisionDetection() {
	// il faut checker le statut de toutes les briques
	// cette fonction sera appelée systématiquement dans la fonction draw()
	for (let i = 0; i < nbRow; i++) {
		for (let j = 0; j < nbCol; j++) {
			let currentBrique = briques[i][j];
			if (currentBrique.statut === 1) {
				if (
					x > currentBrique.x &&
					x < currentBrique.x + largeurBrique &&
					y > currentBrique.y &&
					y < currentBrique.y + hauteurBrique
				) {
					vitesseY = -vitesseY;
					currentBrique.statut = 0;
					score++;
					displayScore.innerText = `Score : ${score}`;

					if (score === nbCol * nbRow) {
						endGame = true;
						winLose.innerText =
							"Vous avez gagné ! Cliquez sur le jeu pour recommencer";
						if (!localStorage.getItem("score")) {
							storeScore(score);
						} else {
							compareScores(score);
						}
					}
				}
			}
		}
	}
}

// 8 - Déplacement raquette

// 1 - avec la souris
function mouseMoveBarre(e) {
	// on récupère la position de la barre par rapport au canvas
	// e.clientX => position de la gauche jusqu'à la souris
	// canvas.offsetLeft => décalage du canvas par rapport à la gauche
	// permet de récupérer la position de notre souris dans les limites de notre canvas
	let posXBarreCanvas = e.clientX - canvas.offsetLeft;
	// console.log(posXBarreCanvas);
	if (
		posXBarreCanvas > 35 - barreWidth / 2 &&
		posXBarreCanvas < canvas.width - 35 - barreWidth / 2
	) {
		// on cadre le déplacement à partir du centre de la barre
		barreX = posXBarreCanvas - barreWidth / 2 + 35;
	}
}

// 2 - avec les flèches du clavier
function keysMoveBarre(e) {
	// if (e.keyCode === 32) {
	// 	draw();
	// }
	let posXBarreCanvas = barreX;
	// console.log(posXBarreCanvas);
	if (e.keyCode === 39) {
		//console.log(e.keyCode);
		posXBarreCanvas += 70;
		if (posXBarreCanvas < canvas.width - 35 - barreWidth / 2) {
			barreX = posXBarreCanvas;
		} else {
			barreX = canvas.width - 35 - barreWidth / 2;
		}
	}
	if (e.keyCode === 37) {
		// console.log(e.keyCode);
		posXBarreCanvas -= 70;
		if (posXBarreCanvas > 35 - barreWidth / 2) {
			barreX = posXBarreCanvas - 35;
		} else {
			barreX = 0 + 35 - barreWidth / 2;
		}
	}
}
// 9 - stocker le score dans le local storage et comparer les socres anciens et nouveaux
function storeScore(score) {
	if (!localStorage.getItem("score")) {
		localStorage.setItem("score", score);
	}
	if (score > localStorage.getItem("score")) {
		localStorage.setItem("score", score);
	}
}
function compareScores(score) {
	let scoreStored = localStorage["score"];
	// console.log(scoreStored);
	if (score == scoreStored) {
		statsScore.innerText = `Votre meilleur score ${scoreStored} - Nouveau score : ${score} ! EGALITE !`;
	} else if (score > scoreStored) {
		statsScore.innerText = `Votre meilleur score  ${scoreStored} - Nouveau score : ${score} ! BRAVO !`;
	} else if (score < scoreStored) {
		statsScore.innerText = `Votre meilleur score  ${scoreStored} - Nouveau score : ${score} ! BOF BOF !`;
	}
}
// 10 - Lancer une nouvelle partie
function newGame() {
	// Gestion NewGame
	canvas.addEventListener("click", () => {
		if (endGame === true) {
			endGame = false;
			document.location.reload();
		}
	});
}
// ----------------------------------------------
// MAIN
// ----------------------------------------------

initGame();
document.addEventListener("mousemove", mouseMoveBarre);
document.addEventListener("keydown", keysMoveBarre);
newGame();
