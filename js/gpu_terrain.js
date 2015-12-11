var heightMap;
var container;
var renderer;
var scene;
var camera;
var geometry;
var material;
var plane;
var fov = 70;
var rotation_x = 0;
var rotation_z = 0;
var seedNumber = 0;

var parameters = {scalar: 130, minHeight: 0, maxHeight: 400, proceduralWidth: 250, proceduralHeight: 250};

function main() {
    
    seed();
  
    init();
    animate();
};

function init() {
    // grab the container from the DOM
    container = document.getElementById( "container" );

	//GUI Components
    var gui = new dat.GUI({
        height : 5 * 32 - 1
    });

    gui.add(parameters, 'minHeight').min(-1000).max(1000).step(50).onFinishChange(function(newValue) {
      regenerate_terrain();
    });
    gui.add(parameters, 'maxHeight').min(-1000).max(1000).step(50).onFinishChange(function(newValue) {
      regenerate_terrain();
    });
    gui.add(parameters, 'scalar').min(0).max(500).step(10).onFinishChange(function(newValue) {
      regenerate_terrain();
    });
    gui.add(parameters, 'proceduralWidth').min(10).max(1000).step(10).onFinishChange(function(newValue) {
      regenerate_terrain();
    });    gui.add(parameters, 'proceduralHeight').min(10).max(1000).step(10).onFinishChange(function(newValue) {
      regenerate_terrain();
    });
    
    var reseed_button = {
	    reseed: function() {
        	seed();
        	regenerate_terrain();
		}
	};

	//var btn = new reseed_button();
    gui.add(reseed_button,'reseed');
    
    // create a scene
    scene = new THREE.Scene();

    // create a camera the size of the browser window
    // and place it 100 units away, looking towards the center of the scene
    camera = new THREE.PerspectiveCamera( 
        fov, 
        window.innerWidth / window.innerHeight, 
        1, 
        4000 );
    camera.position.z = 600;
    camera.target = new THREE.Vector3( 0, 0, 0 );
    scene.add( camera );

	regenerate_terrain();

    // create the renderer and attach it to the DOM
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( "keypress", doKeyDown, false )
    renderer.render( scene, camera );
}

function seed() {
  // Get a full possibility of every seed - 2^16
  seedNumber  = Math.floor((Math.random() * 65536));
}

function animate() {

	requestAnimationFrame( animate );
	plane.rotation.x = rotation_x;	
	plane.rotation.z = rotation_z;

	renderer.render( scene, camera );
}

function reloadPage(){
  console.log("minHeight" + parameters.minHeight);
};

function regenerate_terrain() {

    if (plane instanceof THREE.Mesh) {
        scene.remove(plane);
    }

    geometry = new THREE.PlaneGeometry(parameters.proceduralWidth,parameters.proceduralHeight,parameters.proceduralWidth-1,parameters.proceduralHeight-1);
    // create a material for our plane -- 2^16 seeds
    material = new THREE.ShaderMaterial( {
        uniforms: {
                r: { 
                    type: "f", 
                    value: seedNumber
                },
				maxHeight: {
					type: "f",
					value: parameters.maxHeight
				},
				minHeight: {
					type: "f",
					value: parameters.minHeight
				},
				scalar: {
					type: "f",
					value: parameters.scalar
				},
            },
        vertexShader: document.getElementById( 'vertex_shader' ).textContent,
        fragmentShader: document.getElementById( 'fragment_shader' ).textContent
    } );

	plane = new THREE.Mesh(geometry, material);

    scene.add(plane);
}

function doKeyDown(e) {

	if ( e.keyCode == 119 ) {
		rotation_x -= .06;
	}

	if ( e.keyCode == 115 ) {		
		rotation_x += .06;
	}

	if ( e.keyCode == 100 ) {		
		rotation_z += .06;
	}

	if ( e.keyCode == 97 ) {		
		rotation_z -= .06;
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
