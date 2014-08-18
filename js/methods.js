function error(id){
	/*
		id -> Error
		----------------
		1 -> Media error

	*/
	switch(id){
		case 1:
			console.log("Error#1 Failed at loading the media.")
			alert("The media could not be loaded for some reason, please try refreshing the page, if the problem persists contact me: creepycereals@gmail.com");
	}

}

function createProjectiles(){
	for (var i = 0; i < 15; i++){
		projectiles.push(new Projectile(Morgana));
	}
	for (var i = 0; i < 15; i++){
		projectiles.push(new Projectile(Brand));
	}
}