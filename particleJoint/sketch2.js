// Declare kinectron
var kinectron = null;


// Three.js variables
var width = window.innerWidth;
var height = window.innerHeight;
var camera, scene, renderer; 

// Used for Hand Tracking
var hands = {
    left: {
        position: new THREE.Vector3(),
        camera: new THREE.Vector3(),
        orientation: new THREE.Vector4(),
    },
    right: {
        position: new THREE.Vector3(),
        camera: new THREE.Vector3(),
        orientation: new THREE.Vector4(),
    },
};

// Used in initParticles()
var emitters = [], particleGroup;

function drawHand(key, data) {

    hands[key].camera.x = data.cameraX;
    hands[key].camera.y = data.cameraY;
    hands[key].camera.z = data.cameraZ;

    hands[key].orientation.x = data.orientationX;
    hands[key].orientation.y = data.orientationY;
    hands[key].orientation.z = data.orientationZ;
    hands[key].orientation.w = data.orientationW;

    console.log(key, data);
}

function handleBodyCallback(body) {
    console.log('handleBodyCallback', body);
    drawHand('left', body.joints[kinectron.HANDLEFT]);
    drawHand('right', body.joints[kinectron.HANDRIGHT]);
}

function initKinectron() {
    // Define and create an instance of kinectron
    // var kinectronIpAddress = '10.1.20.54';
    var kinectronIpAddress = '10.1.10.130';
    // var kinectronIpAddress = '10.1.20.65';
    kinectron = new Kinectron(kinectronIpAddress);

    // Connect remote to application
    kinectron.makeConnection();

    kinectron.startTrackedBodies(handleBodyCallback);
}

function initScene() {
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
}

// Create particle group and emitter
function initParticles() {
    console.log('initParticles');

    particleGroup = new SPE.Group({
        texture: {
            value: THREE.ImageUtils.loadTexture('../img/smokeparticle.png')
        }
    });


    Object.keys(hands).forEach(function (key) {
        initEmitter(key);
        particleGroup.addEmitter( emitters[key] );
    });

    scene.add( particleGroup.mesh );
}

function initEmitter(key) {

    emitters[key] = new SPE.Emitter({
        maxAge: 3,
        position: {
            value: new THREE.Vector3(0, 0, 0)
        },

        acceleration: {
            value: new THREE.Vector3(10, 5, 10),
            spread: new THREE.Vector3(50, 50, 50)
        },

        velocity: {
            value: new THREE.Vector3(20, 20, 20)
        },

        color: {
            value: [ new THREE.Color( 0.5, 0.5, 0.5 ), new THREE.Color() ],
            spread: new THREE.Vector3(1, 1, 1),
        },
        size: {
            value: [25, 0]
        },

        particleCount: 1000
    });

    return emitters[key];
}

function init() {

    initKinectron();

    initScene();

    initParticles();

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

    Object.keys(hands).forEach(function (key) {
        const hand = hands[key];
        hand.position.x = hand.camera.x * window.innerWidth/4;
        hand.position.y = hand.camera.y * window.innerHeight/4;
        hand.position.z = hand.camera.z;

        // move the particle emitter to the hand position
        emitters[key].position.value = emitters[key].position.value.set( hand.position.x, hand.position.y, hand.position.z );
        emitters[key].rotation.y += 0.1;

        // console.log(key, hand, emitters[key]);

    });

    render( 0.016 );
}

function render(dt) {
    particleGroup.tick( dt );
    renderer.render(scene, camera);
}

init();
animate();