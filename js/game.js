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
var points = 1;
var lifes = 3;

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
	ctx.font = "30px Fixedsys"
	ctx.fillStyle = 'black';
	document.getElementById("canvas-container").appendChild(canvas);

	canvas.addEventListener('mousemove', function(e){
		mouse[0] = e.offsetX;
		mouse[1] = e.offsetY;
	}, false);

	loadMedia();
}

// Called when all the media is loaded.
function init(){

	for (var key in sprites){

		if (sprites[key].width + sprites[key].height > canvasMargin){
			canvasMargin = Math.sqrt(Math.pow(sprites[key].width, 2) + Math.pow(sprites[key].height, 2));
		}
	}

	createProjectiles();
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


function gameOver(){

	console.log("GAME OVER");
	//stop();
}


function gameLoop(){

	logic();
	render();
	if (gameState == 1){
		
		requestAnimFrame(gameLoop);
	}
}


function logic(){

	var t = (Date.now() - lastUpdate) / 1000;

	for(var i = 0; i < projectiles.length; i++){

		if (projectiles[i].collides()){

			collisions.push([mouse[0], mouse[1]]);
			projectiles.splice(i, 1);

			if (!--lifes){
				gameOver();
			}
		}else{

			projectiles[i].move(t);

			if (projectiles[i].position[0] > CANVAS_WIDTH+canvasMargin || projectiles[i].position[1] > CANVAS_HEIGHT+canvasMargin || projectiles[i].position[0] < -canvasMargin || projectiles[i].position[1] < -canvasMargin){

				projectiles[i].setNewPosition();
			}
		}
	}
	points += 2;
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
		ctx.fillRect(collisions[i][0]-1, collisions[i][1]-1, 2, 2);
	}

	ctx.fillText(points, CANVAS_WIDTH-ctx.measureText(points).width-10, CANVAS_HEIGHT-10);

	ctx.save();
	ctx.translate(30, CANVAS_HEIGHT-sprites['heart'].height-10);
	for (var i = 0; i < 3; i++){
		if (i+1 <= lifes){
			ctx.drawImage(sprites['heart'], (sprites['heart'].width*i)+5*i, 0);
		}else{
			ctx.drawImage(sprites['heartEmpty'], (sprites['heart'].width*i)+5*i, 0);
		}
	}
	ctx.restore();
}