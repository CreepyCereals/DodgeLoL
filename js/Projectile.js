/* Projectile object */

function Projectile(champion){

	this.sprite = sprites[champion.sprite];
	this.position = [0, 0];
	this.speed = [0, 0];
	this.plainSpeed = champion.speed;
	this.shape = champion.shape;

	if (champion.shape == 'rectangle'){

		this.rotation = 0;
		this.hyp = Math.sqrt(Math.pow(this.sprite.width, 2) + Math.pow(this.sprite.height, 2));
	}

	if (champion.shape == 'circle'){

		this.radius = this.sprite.width/2;
	}

	// Moves the projectile (called from 'logic').
	this.move = function(delay){

		this.position[0] = this.position[0] + this.speed[0] * delay;
		this.position[1] = this.position[1] + this.speed[1] * delay;
	}

	// Draws the projectile on the canvas.
	this.render = function(){

		if (this.rotation){

			ctx.rotate(this.rotation);
		}
		ctx.drawImage(this.sprite, 0, 0);
		//ctx.fillStyle = "red";
		//ctx.fillRect(0, 0, 5, 5);
	}

	// Checks if the projectile is collisioning the player.
	this.collides = function(){
		if (this.shape == 'rectangle'){
			/*
						. P

			   A _______________ B
				|				|
				|				|
				|_______________|
			   D                 C


			*/

			var areas = 0;
			var points = [];
			var distances = [];
			var p = 0;
			points[0] = this.position;

			if (this.speed[0] > 0){

				points[1] = [this.position[0]+Math.cos(this.rotation)*(this.sprite.width), this.position[1]+Math.sin(this.rotation)*(this.sprite.width)];
				points[2] = [points[1][0]-(Math.sin(this.rotation)*(this.sprite.height)), points[1][1]+(Math.cos(this.rotation)*(this.sprite.height))];
				points[3] = [this.position[0]-(Math.sin(this.rotation)*(this.sprite.height)), this.position[1]+(Math.cos(this.rotation)*(this.sprite.height))];
			}else{

				points[1] =[this.position[0]-Math.sin(this.rotation-(Math.PI/2))*(this.sprite.width), this.position[1]+Math.cos(this.rotation-(Math.PI/2))*(this.sprite.width)];
				points[2] = [points[1][0]-(Math.sin(this.rotation)*(this.sprite.height)), points[1][1]+(Math.cos(this.rotation)*(this.sprite.height))];
				points[3] = [this.position[0]-(Math.sin(this.rotation)*(this.sprite.height)), this.position[1]+(Math.cos(this.rotation)*(this.sprite.height))];
			}

			for (var i = 0; i < 4; i++){
				distances[i] = Math.sqrt(Math.pow((mouse[0]-points[i][0]), 2) + Math.pow((mouse[1]-points[i][1]), 2));
			}

			p = (distances[0]+distances[1]+this.sprite.width)/2;
			areas += Math.sqrt(p*(p-distances[0])*(p-distances[1])*(p-this.sprite.width));
			p = (distances[1]+distances[2]+this.sprite.height)/2;
			areas += Math.sqrt(p*(p-distances[1])*(p-distances[2])*(p-this.sprite.height));
			p = (distances[2]+distances[3]+this.sprite.width)/2;
			areas += Math.sqrt(p*(p-distances[2])*(p-distances[3])*(p-this.sprite.width));
			p = (distances[3]+distances[0]+this.sprite.height)/2;
			areas += Math.sqrt(p*(p-distances[3])*(p-distances[0])*(p-this.sprite.height));
			
			if (areas > (this.sprite.width * this.sprite.height)){

				return false;
			}else{

				return true;
			}
		}

		if (this.shape == 'circle'){

			var center = [this.position[0]+this.sprite.width/2, this.position[1]+this.sprite.height/2];
			var distance = Math.sqrt(Math.pow(mouse[0]-center[0], 2)+Math.pow(mouse[1]-center[1], 2));

			if (distance > this.radius){

				return false;
			}else{

				return true;
			}
		}
	}

	// Generates a new position for the projectile
	this.setNewPosition = function(){

		var n = Math.random();

		if (n<=0.25){

			this.position[0] = -canvasMargin;
			this.position[1] = Math.random()*CANVAS_HEIGHT;
			this.speed[0] = (Math.floor(Math.random()*this.plainSpeed));
			if (Math.random()<=0.5){

				this.speed[1] = (this.plainSpeed-this.speed[0]);
			}else{

				this.speed[1] = Math.abs((this.plainSpeed-this.speed[0]))*-1;
			}
		}
		else if (n<=0.5){

			this.position[0] = Math.random()*CANVAS_WIDTH;
			this.position[1] = -canvasMargin;
			this.speed[1] = (Math.floor(Math.random()*this.plainSpeed));
			if (Math.random()<=0.5){

				this.speed[0] = (this.plainSpeed-this.speed[1]);
			}else{

				this.speed[0] = Math.abs((this.plainSpeed-this.speed[1]))*-1;
			}
		}
		else if (n<=0.75){

			this.position[0] = CANVAS_WIDTH+canvasMargin;
			this.position[1] = Math.random()*CANVAS_HEIGHT;
			this.speed[0] = (Math.floor(Math.random()*this.plainSpeed))*-1;
			if (Math.random()<=0.5){

				this.speed[1] = (this.plainSpeed-Math.abs(this.speed[0]));
			}else{

				this.speed[1] = Math.abs(this.plainSpeed-Math.abs(this.speed[0]))*-1;
			}
		}
		else if(n<=1){

			this.position[0] = Math.random()*CANVAS_WIDTH;
			this.position[1] = (CANVAS_HEIGHT + canvasMargin);
			this.speed[1] = (Math.floor(Math.random()*this.plainSpeed))*-1;
			if (Math.random()<=0.5){

				this.speed[0] = (this.plainSpeed-Math.abs(this.speed[1]));
			}else{

				this.speed[0] = Math.abs((this.plainSpeed-Math.abs(this.speed[1])))*-1;
			}
		}
		if (this.shape == 'rectangle'){

			if (this.speed[1] > 0){

				this.rotation = Math.acos(this.speed[0] / (Math.sqrt(Math.pow(this.speed[0], 2) + Math.pow(this.speed[1], 2))));
			}else{

				this.rotation = (Math.acos(this.speed[0] / (Math.sqrt(Math.pow(this.speed[0], 2) + Math.pow(this.speed[1], 2))))*-1);
			}
		}
	}

	this.setNewPosition();
}