var heightMap;
var container;
var renderer;
var scene;
var camera;
var geometry;
var material;
var plane;

var parameters = {scalar: 150, minHeight: 100, maxHeight: 400, proceduralWidth: 100, proceduralHeight: 100};

function main() {
    
	heightMap = generateHeightMap(parameters.proceduralWidth, parameters.proceduralHeight);

    var gui = new dat.GUI({
        height : 5 * 32 - 1
    });
  
    init();
    animate();
};

function reloadPage(){
  console.log("minHeight" + parameters.minHeight);
};

function regenerate_terrain() {

    if (plane instanceof THREE.Mesh) {
        scene.remove(plane);
    }

    geometry = new THREE.PlaneGeometry(parameters.proceduralWidth,parameters.proceduralHeight,parameters.proceduralWidth-1,parameters.proceduralHeight-1);
    material = new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors});
    plane = new THREE.Mesh( geometry, material );
     
    //set height of vertices
    for ( var i = 0; i < plane.geometry.vertices.length; i++ ) {
      value = (heightMap[i] + 1) * parameters.scalar;
      if (value < parameters.minHeight) {
        value = parameters.minHeight;
      } else if (value > parameters.maxHeight) {
        value = parameters.maxHeight;
      }
      plane.geometry.vertices[i].z = value;
    }
    
    for (var i = 0; i < plane.geometry.faces.length; i++) {
        face = plane.geometry.faces[i];
        // We want to color the terrain so that lower (water) is blue, middle is green and very high is brown
        var red = (plane.geometry.vertices[face.a].z - parameters.scalar*.67 - parameters.minHeight)/(parameters.scalar);
        var green = 0.6*(plane.geometry.vertices[face.a].z - parameters.minHeight)/(parameters.scalar);
        var blue = 0.4 -(plane.geometry.vertices[face.a].z - parameters.minHeight)/(parameters.scalar);
        face.color.setRGB( red, green, blue);
    }

    plane.geometry.computeFaceNormals();
    plane.geometry.computeVertexNormals();

    scene.add(plane);
}

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = 300;
    //camera.position.x = 400;
    camera.target = new THREE.Vector3( 0, 0, 0 );
    scene = new THREE.Scene();
    scene.add(camera);

    //GUI Components
    var gui = new dat.GUI({
        height : 5 * 32 - 1
    });

    gui.add(parameters, 'minHeight').min(-800).max(800).step(25).onFinishChange(function(newValue){
      console.log("new minH val " + newValue);
      console.log("minH " + parameters.minHeight);
      //location.reload(); //This is not working when added - doesn't hold the values that were just set everything gets reset to default
    });
    gui.add(parameters, 'maxHeight').min(-800).max(800).step(25).onFinishChange(function(newValue){
      console.log("new maxH val " + newValue);
      console.log("maxH " + parameters.maxHeight);
      //location.reload(); //This is not working when added - doesn't hold the values that were just set everything gets reset to default
    });
    gui.add(parameters, 'scalar').min(0).max(300).step(10).onFinishChange(function(newValue){
      console.log("new scalar val " + newValue);
      console.log("scalar " + parameters.scalar);
      //location.reload(); //This is not working when added - doesn't hold the values that were just set everything gets reset to default
    });
    gui.add(parameters, 'proceduralWidth').min(100).max(1000).step(50).onFinishChange(function(newValue){
      console.log("new width val " + newValue);
      console.log("width " + parameters.proceduralWidth);
      //location.reload(); //This is not working when added - doesn't hold the values that were just set everything gets reset to default
    });    gui.add(parameters, 'proceduralHeight').min(100).max(1000).step(50).onFinishChange(function(newValue){
      console.log("new height val " + newValue);
      console.log("height " + parameters.proceduralHeight);
      //location.reload(); //This is not working when added - doesn't hold the values that were just set everything gets reset to default
    });
    
	// Setup Light 
	var light = new THREE.PointLight( 0xffffff, 1, 750 );
	light.position.set( 0, 0, 300 );
	scene.add( light );
        
    regenerate_terrain();

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

  var start = Date.now();
  
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

      if (max < value) max = value;
      if (min > value) min = value;

	  //Put data into the heightmap
      data[x + y * terrainWidth] = value;
    }
  }

  var delta_time = Date.now() - start;
  console.log("CPU: " + parameters.proceduralWidth + " x " + parameters.proceduralHeight + " size heightmap in " + delta_time + " ms");

  return data;
}
