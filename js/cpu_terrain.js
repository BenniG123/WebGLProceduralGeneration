var heightMap;
var proceduralWidth = 200;
var proceduralHeight = 200;
var container;
var renderer;
var scene;
var camera;
var scalar = 100;
var minHeight = 50;
var maxHeight = 150;

function main() {
    var start = Date.now();
	heightMap = generateHeightMap(proceduralWidth, proceduralHeight);    
    var delta_time = Date.now() - start;
    console.log("CPU: " + proceduralWidth + " x " + proceduralHeight + " size heightmap in " + delta_time + " ms");

    var gui = new dat.GUI({
        height : 5 * 32 - 1
    });
  
    init();
    //animate();
   
};

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = 100;
    camera.target = new THREE.Vector3( 0, 0, 0 );
    scene = new THREE.Scene();
    scene.add(camera);

    // plane
    var geometry = new THREE.PlaneGeometry(proceduralWidth,proceduralHeight,proceduralWidth-1,proceduralHeight-1);
    var material = new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors}); //
    plane = new THREE.Mesh( geometry, material );
     
    //set height of vertices
    for ( var i = 0; i < plane.geometry.vertices.length; i++ ) {
        plane.geometry.vertices[i].z = heightMap[i];
    }
    
    for (var i = 0; i < plane.geometry.faces.length; i++) {
        face = plane.geometry.faces[i];
        // We want to color the terrain so that lower (water) is blue, middle is green and very high is brown
        var red = (plane.geometry.vertices[face.a].z - scalar*.67 - minHeight)/(scalar);
        var green = 0.6*(plane.geometry.vertices[face.a].z - minHeight)/(scalar);
        var blue = 0.4 -(plane.geometry.vertices[face.a].z - minHeight)/(scalar);
        face.color.setRGB( red, green, blue);
    }
    
    plane.rotation.x = -45;
    plane.rotation.z = 45;

    
	// Lighting Calculations 
	var light = new THREE.PointLight( 0xffffff, 1, 750 );
	light.position.set( 0, 0, 500 );
	scene.add( light );
    
    plane.geometry.computeFaceNormals();
    plane.geometry.computeVertexNormals();

    scene.add(plane);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
    
    renderer.render( scene, camera );

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

  // Get a full possibility of every seed - 2^16
  var seedNumber  = Math.floor((Math.random() * 65536));
  noise.seed(seedNumber);

  var max = -Infinity, min = Infinity;

  // Calculate the Z value for every X and Y in the frame
  for (var x = 0; x < terrainWidth; x++) {
    for (var y = 0; y < terrainLength; y++) {
      var value = noise.perlin3(x / 50, y / 50, 0);

	  // Scale the value from 0 to max height
      value = value * scalar;
      if (value < minHeight) {
        value = minHeight;
      } else if (value > maxHeight) {
        value = maxHeight;
      }

      if (max < value) max = value;
      if (min > value) min = value;

	  //Put data into the heightmap
      data[x + y * terrainWidth] = value;
    }
  }

  return data;
}
