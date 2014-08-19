// Loads all the media.

function loadMedia(){

	var media = [['morgana', 'media/morgana.png'], ['brand', 'media/brand.png'], ['heart', 'media/heartFull.png'], ['heartEmpty', 'media/heartEmpty.png'], ['kennen', 'media/kennen.png'], ['kennen2', 'media/kennen2.png']];
	var mediaReady = 0;

	for (var i = 0; i < media.length; i++){

		var img = new Image();
		img.id = media[i][0]

		img.onerror = function(){

			error(1);
		};

		img.onload = function(){

			console.log("Loaded "+this.id);
			sprites[this.id] = this;

			if (++mediaReady ==  media.length){

				console.log("Media loaded successfully");
				init();
			}
		};

		img.src = media[i][1];
	}
};