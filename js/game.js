/* Globals: */
CANVAS_WIDTH = 800;
CANVAS_HEIGHT = 600;
var sprites = {}; // Contains the Image object
var projectiles = []; // Contines all the projectiles within the canvas
var gameState = 0; // 0-> Paused; 1 -> Running
var ctx; // Canvas context
var lastUpdate = 0; 
var canvasMargin = 0;
var mouse = [0, 0];
var collisions = [];

/* Multi support for requestAnimationFrame() */
var requestAnimFrame = (function(){
	return window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){window.setTimeout(callback, 1000 / 60);};
})();

/* Called by body.onload */
function createCanvas(){

	var canvas = document.createElement("canvas");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvas.id = "canvas";

	ctx = canvas.getContext('2d');
	document.getElementById("canvas-container").appendChild(canvas);

	canvas.addEventListener('mousemove', function(e){
		mouse[0] = e.offsetX;
		mouse[1] = e.offsetY;
	}, false);

	loadMedia();
}

// This method is called when all the media is loaded.
function init(){

	createProjectiles();

	for (var key in sprites){

		if (sprites[key].width + sprites[key].height > canvasMargin){
			canvasMargin = Math.sqrt(Math.pow(sprites[key].width, 2) + Math.pow(sprites[key].height, 2));
		}
	}

	gameState = 1;
	lastUpdate = Date.now();
	gameLoop();
}


function stop(){

	gameState = 0;
}


function resume(){

	gameState = 1;
	gameLoop();
}


function gameLoop(){

	logic();
	render();
	if (gameState == 1){
		requestAnimFrame(gameLoop);
	}
}


function logic(){

	// Projectiles:
	var t = (Date.now() - lastUpdate) / 1000;
	for(var i = 0; i < projectiles.length; i++){
		
		if (projectiles[i].collides()){

			collisions.push([mouse[0], mouse[1]]);
			console.log('Collision!');
		}

		projectiles[i].move(t);

		if (projectiles[i].position[0] > CANVAS_WIDTH+canvasMargin || projectiles[i].position[1] > CANVAS_HEIGHT+canvasMargin || projectiles[i].position[0] < -canvasMargin || projectiles[i].position[1] < -canvasMargin){
			projectiles[i].setNewPosition();
		}
	}
	lastUpdate = Date.now();
}


function render(){

	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	for (var i = 0; i < projectiles.length; i++){

		ctx.save();
		ctx.translate(projectiles[i].position[0], projectiles[i].position[1]);
		projectiles[i].render(ctx);
		ctx.restore();
	}

	for (var i = 0; i < collisions.length; i++){
		ctx.fillStyle = 'red';
		ctx.fillRect(collisions[i][0]-1, collisions[i][1]-1, 2, 2);
	}
}