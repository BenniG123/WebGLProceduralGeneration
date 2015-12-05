var container, 
    renderer, 
    scene, 
    camera, 
    mesh, 
    start = Date.now(),
    fov = 70;
var ran = Math.random() * 65536;
var minHeight = 0;
var maxHeight = 10;

function main() {
    // grab the container from the DOM
    container = document.getElementById( "container" );
    
    // create a scene
    scene = new THREE.Scene();

    // create a camera the size of the browser window
    // and place it 100 units away, looking towards the center of the scene
    camera = new THREE.PerspectiveCamera( 
        fov, 
        window.innerWidth / window.innerHeight, 
        1, 
        10000 );
    camera.position.z = 100;
    camera.target = new THREE.Vector3( 0, 0, 0 );

    scene.add( camera );

    // create a material for our plane -- 2^16 seeds
    material = new THREE.ShaderMaterial( {
        uniforms: {
                r: { 
                    type: "f", 
                    value: ran
                },
				maxHeight: {
					type: "f",
					value: maxHeight
				},
				minHeight: {
					type: "f",
					value: minHeight
				},
            },
        vertexShader: document.getElementById( 'vertex_shader' ).textContent,
        fragmentShader: document.getElementById( 'fragment_shader' ).textContent
    } );

    //material = new THREE.MeshNormalMaterial();
    
    var geometry = new THREE.PlaneGeometry( 100, 100, 99, 99);

    // create a sphere and assign the material
    mesh = new THREE.Mesh( 
        geometry, 
        material 
    );
    scene.add( mesh );

    var pointLight = new THREE.PointLight( 0xffffff, 1, 300 );
    pointLight.position.set( 0, 0, 200 );
    scene.add( pointLight );

    mesh.rotation.x = -45;
    mesh.rotation.z = 45;

    //mesh.material = new THREE.MeshLambertMaterial();
    //mesh.geometry.buffersNeedUpdate = true;
    //mesh.geometry.uvsNeedUpdate = true;


    // create the renderer and attach it to the DOM
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    container.appendChild( renderer.domElement );

    render();

}

function render() {

    ran = Math.random()*1000;
    renderer.render( scene, camera );
    requestAnimationFrame( render );
    
}
