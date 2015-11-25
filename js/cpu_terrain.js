var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = 1024;
canvas.height = 768;

var ctx = canvas.getContext('2d');

var image = ctx.createImageData(canvas.width, canvas.height);
var data = image.data;

var height = 0;

function drawFrame() {

  // For calculating the time diff
  var start = Date.now();
  // Cache width and height values for the canvas.
  var cWidth = canvas.width;
  var cHeight = canvas.height;

  var max = -Infinity, min = Infinity;

  // Calculate the Z value for every X and Y in the frame
  for (var x = 0; x < cWidth; x++) {
    for (var y = 0; y < cHeight; y++) {
      var value = noise.perlin3(x / 50, y / 50, height);

      if (max < value) max = value;
      if (min > value) min = value;

	  // Scale the value from 0 to 255
      value = (1 + value) * 1.1 * 128;

	  //Put data into the image data
      var cell = (x + y * cWidth) * 4;
      data[cell] = data[cell + 1] = data[cell + 2] = value;
      data[cell + 3] = 255; // alpha.
    }
  }

  var end = Date.now();

  ctx.fillColor = 'black';
  ctx.fillRect(0, 0, 100, 100);
  ctx.putImageData(image, 0, 0);

  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center';
  ctx.fillText('rendered in ' + (end - start) + ' ms', cWidth / 2, cHeight - 20);

  if(console) {
    console.log('rendered in ' + (end - start) + ' ms', 'range: ' + min + ' to ' + max);
  }

  height += 0.05;
  requestAnimationFrame(drawFrame);
}

requestAnimationFrame(drawFrame);
