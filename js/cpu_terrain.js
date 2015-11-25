function main() {
	var canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	console.log(generateVertices(5000,5000));
}

var height = 0;

function generateVertices(terrainWidth, terrainLength) {

  var data = new Array(terrainWidth*terrainLength);
  var seedNumber  = Math.floor((Math.random() * 10000));
  noise.seed(seedNumber);
  console.log(seedNumber);

  // For calculating the time diff
  var start = Date.now();

  var max = -Infinity, min = Infinity;

  // Calculate the Z value for every X and Y in the frame
  for (var x = 0; x < terrainWidth; x++) {
    for (var y = 0; y < terrainLength; y++) {
      var value = noise.perlin3(x / 50, y / 50, height);

      if (max < value) max = value;
      if (min > value) min = value;

	  // Scale the value from 0 to 255
      value = (1 + value) * 1.1 * 128;

	  //Put data into the heightmap
      data[x + y * terrainWidth] = value;
    }
  }

  var end = Date.now();

  console.log('Vertices generated in ' + (end - start) + ' ms', 'range: ' + min + ' to ' + max);

  height += 0.5;
  return data;
}
