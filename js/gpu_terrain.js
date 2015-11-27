var container, 
    renderer, 
    scene, 
    camera, 
    mesh, 
    start = Date.now(),
    fov = 70;

function init() {
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

    // create a material for our plane		
    material = new THREE.ShaderMaterial( {
        vertexShader: document.getElementById( 'vertex_shader' ).textContent,
        fragmentShader: document.getElementById( 'fragment_shader' ).textContent
    } );
    
    // create a sphere and assign the material
    mesh = new THREE.Mesh( 
        new THREE.IcosahedronGeometry( 20, 4 ), 
        material 
    );
    scene.add( mesh );
    
    // create the renderer and attach it to the DOM
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    container.appendChild( renderer.domElement );

    render();

} );

function render() {

    // let there be light
    renderer.render( scene, camera );
    requestAnimationFrame( render );
    
}
