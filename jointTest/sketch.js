// Declare kinectron
var kinectron = null;


// Three.js variables
var width = window.innerWidth;
var height = window.innerHeight;
var camera, scene, renderer; 
var geometry, texture, mesh;
var geometry2, texture2, mesh2;
var orientationX, orientationY, orientationZ, orientationW;

var cameraX, cameraY, cameraZ;

function drawJoint(data) {
    //console.log(data);
    cameraX = data.cameraX;
    cameraY = data.cameraY;
    cameraZ = data.cameraZ;
    orientationX = data.orientationX;
    orientationY = data.orientationY;
    orientationZ = data.orientationZ;
    orientationW = data.orientationW;
}

function initKinectron() {
    // Define and create an instance of kinectron
    var kinectronIpAddress = '10.1.10.130'; // FILL IN YOUR KINECTRON IP ADDRESS HERE
    kinectron = new Kinectron(kinectronIpAddress);

    // Connect remote to application
    kinectron.makeConnection();

    // init the hand tracking with drawJoint as callback
    kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawJoint);
}

function initRightHand() {
    // Create first cube   
    var material = new THREE.MeshPhongMaterial( { color: 0x3b0160 }  );
    // var material = new THREE.MeshBasicMaterial({ color: 0x3b0160 });
    // geometry = new THREE.BoxGeometry( 50, 50, 50 );
    geometry = new THREE.SphereGeometry( 50, 32, 32 );
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 100, 0 ) );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
}

function init() {

    initKinectron();

    // Three.js renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
  
    // Three.js scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 500;
    scene.add(camera);

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 1 ).normalize();
    scene.add(light);

    initRightHand();

    // Listen for window resize  
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame(animate);

    mesh.position.x = cameraX * window.innerWidth/4;
    mesh.position.y = cameraY * window.innerHeight/4;
    //mesh.position.z = cameraZ * 1000/4;
    mesh.position.z = cameraZ;

    mesh.rotation.x = orientationX;
    mesh.rotation.y = orientationY;
    mesh.rotation.z = orientationZ;


    //mesh2.rotation.y += 0.01;
  
    renderer.render(scene, camera);
}

init();
animate();