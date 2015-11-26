var heightMap;
var proceduralWidth = 100;
var proceduralHeight = 100;
var container;
var renderer;
var scene;
var camera;

function main() {
	heightMap = generateHeightMap(proceduralWidth, proceduralHeight);
  
    init();
    animate();
   
};

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 4000 );
	camera.position.z = 100;
    camera.rotation.x = 90;
	scene = new THREE.Scene();
    scene.add(camera);
    // plane
    var geometry = new THREE.PlaneGeometry(100,100,proceduralWidth,proceduralHeight);
    var material = new THREE.MeshLambertMaterial(0xff0000);
    plane = new THREE.Mesh( geometry, material );

     
    //set height of vertices
    for ( var i = 0; i<plane.geometry.vertices.length; i++ ) {
         plane.geometry.vertices[i].z = heightMap[i];
    }

    var light = new THREE.PointLight( 0xffffff, 1, 500 );
	light.position.set( 0, 0, 150 );
	scene.add( light );
 
    scene.add(plane);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function generateHeightMap(terrainWidth, terrainLength) {
  
  var data = new Array(terrainWidth*terrainLength);
  // 137 80 78 71 13 10 26 10

  var seedNumber  = Math.floor((Math.random() * 10000));
  noise.seed(seedNumber);
  console.log(seedNumber);

  // For calculating the time diff
  var start = Date.now();

  var max = -Infinity, min = Infinity;

  // Calculate the Z value for every X and Y in the frame
  for (var x = 0; x < terrainWidth; x++) {
    for (var y = 0; y < terrainLength; y++) {
      var value = noise.perlin3(x / 50, y / 50, 0);

      if (max < value) max = value;
      if (min > value) min = value;

	  // Scale the value from 0 to 255
      value = (1 + value) * 1.1 * 128;

	  //Put data into the heightmap
      data[x + y * terrainWidth] = value;
    }
  }

  var end = Date.now();

  console.log(terrainWidth*terrainLength + ' vertices generated in ' + (end - start) + ' ms', 'range: ' + min + ' to ' + max);

  return data;
}
