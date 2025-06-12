import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

const canvas = document.querySelector('.canvas');
const scene = new THREE.Scene();


// Camera setup
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5.6708516251695835, 61.187885484442276, 114.13573589404785);
camera.rotation.set(-0.09101145002168787, -0.015141104958504379, -0.0013817776236273555);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); 
directionalLight.position.set(-90.53579872258244, 463.33470443725, 272.39652861393523).normalize();
scene.add(directionalLight);

let isMovingForward = false; // Tracks if 'W' is pressed
const moveSpeed = 0.5

        // Example: Toggle movement on key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'w') isMovingForward = true;
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'w') isMovingForward = false;
        });


// Predefined camera positions and rotations
const cameraPositions = [
    {
        position: new THREE.Vector3(5.6708516251695835, 61.187885484442276, 114.13573589404785),
        rotation: new THREE.Euler(-0.09101145002168787, -0.015141104958504379, -0.0013817776236273555),
        name: "Overview"
    },
    {
        position: new THREE.Vector3(9.822355573807581,  36.26996170817355,  -158.8981485581262),
        rotation: new THREE.Euler(-0.091011,  -0.015141, -0.001382),
        name: "Exhibit 1"
    },
    {
        position: new THREE.Vector3(-4.770131365459541, 33.120249306092724, -261.3907145776329),
        rotation: new THREE.Euler(3.1145918232290373, 0.17845505557959393, -3.1367986246668718),
        name: "Exhibit 2"
    },
    {
        position: new THREE.Vector3(32.91221769454644, 41.1786026573557, -179.61256233236608),
        rotation: new THREE.Euler(-0.03574764038860751, -0.396662419257831, -0.013815823977368396),   
        name: "Exhibit 3"
    },
     {
        position: new THREE.Vector3(-64.8060609869119, 85.83852697614797, -53.675629053946466),
        rotation: new THREE.Euler(-2.1296180278367434, -0.5694051943950866, -2.4300679855981158),   
        name: "Exhibit 4"
    },
    //  {
    //     position: new THREE.Vector3(1.1446561747482837, 41.05041330602423, -34.805792705018575),
    //     rotation: new THREE.Euler(-1.9408942715982773, -1.2766886281876975, -1.9559341499457672),   
    //     name: "Exhibit 5"
    // },
     {
        position: new THREE.Vector3(11.552905750635468, 25.882949920222167, 272.71205448443226),
        rotation: new THREE.Euler(-0.091011, -0.015141, -0.001382),   
        name: "Exhibit 6"
    },
     {
        position: new THREE.Vector3(22.300896436027898, 62.29227814177167, -538.8281409638914),
        rotation: new THREE.Euler(-2.3094893314523444, -0.7900770326714942, -2.479122097147682),   
        name: "Exhibit 7"
    },
     {
        position: new THREE.Vector3(-247.0814466658041, 33.44676279320914, 4.9120846785012215),
        rotation: new THREE.Euler(-1.4249759647802003, -1.4348211790201635, -1.4236368874337875),   
        name: "Exhibit 8"
    },
     {
        position: new THREE.Vector3(-99.65196078090746, 32.171629723198926, 4.299873268958202),
        rotation: new THREE.Euler(0.8319865599528853, -1.4852269228737378, 0.8301614340229976),   
        name: "Exhibit 9"
    },
     {
        position: new THREE.Vector3(-175.6185683819684, 58.22294694826911, -0.6903534911815552),
        rotation: new THREE.Euler(-0.3360817150264683, 1.5099700207550495, 0.33550582254111705),   
        name: "Exhibit 10"
    },
    {
        position: new THREE.Vector3(-175.6185683819684, 58.22294694826911, -0.6903534911815552),
        rotation: new THREE.Euler(-0.3360817150264683, 1.5099700207550495, 0.33550582254111705),
        name: "Exhibit 11"
    },
    {
        position: new THREE.Vector3(-238.06039077213785, 54.23330326323434, 113.04788342207345),
        rotation: new THREE.Euler(0.10369779607973305, -0.35471774250791627, 0.03613083568438164),
        name: "Exhibit 12"
    },
    {
        position: new THREE.Vector3(-268.88363691224555, 62.23810386110548, -264.4094107334755),
        rotation: new THREE.Euler(2.9131809605523107, -1.3438430673316077, 2.9188440208000954),
        name: "Exhibit 13"
    }

];
let hotspots = [];
let isAnimating = false;

function createNavigationRing() {
    const group = new THREE.Group();
    
    // Create outer ring
    const outerGeometry = new THREE.RingGeometry(4, 5, 32);
    const outerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x222222,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const outerRing = new THREE.Mesh(outerGeometry, outerMaterial);
    outerRing.rotation.x = Math.PI / 2; // Make it face downward
    
    // Create inner ring
    const innerGeometry = new THREE.RingGeometry(2, 3, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const innerRing = new THREE.Mesh(innerGeometry, innerMaterial);
    innerRing.rotation.x = Math.PI / 2; // Make it face downward
    
    group.add(outerRing);
    group.add(innerRing);
    
    return group;
}

function createHotspots() {
    // Remove existing hotspots if any
    hotspots.forEach(hotspot => {
        if (hotspot.mesh) {
            scene.remove(hotspot.mesh);
            clearInterval(hotspot.blinkInterval);
        }
    });
    hotspots = [];
    
    // Create a hotspot for each camera position (except the current one)
    cameraPositions.forEach((pos, index) => {
        // Skip the current position
        if (camera.position.equals(pos.position)) return;
        
        // Create navigation ring
        const ring = createNavigationRing();
        
        // Position the hotspot near the target position
        ring.position.copy(pos.position);
        ring.position.y = 0.5; // Adjust to be slightly below the target
        
        // Make it clickable
        ring.userData = { targetPosition: index };
        
        scene.add(ring);
        
        // Add blinking animation
        let blinkDirection = -0.05;
        const blinkInterval = setInterval(() => {
            ring.children.forEach(child => {
                if (child.material.opacity <= 0.1 || child.material.opacity >= 0.8) {
                    blinkDirection *= -1;
                }
                child.material.opacity += blinkDirection;
            });
        }, 100);
        
        hotspots.push({ 
            mesh: ring, 
            targetPosition: index,
            blinkInterval: blinkInterval
        });
    });
}

function moveCameraToPosition(targetIndex) {
    if (isAnimating || targetIndex < 0 || targetIndex >= cameraPositions.length) return;
    
    isAnimating = true;
    //controls.enabled = false; // Disable controls during animation
    
    const target = cameraPositions[targetIndex];
    
    // Animate camera position and rotation
    gsap.to(camera.position, {
        x: target.position.x,
        y: target.position.y,
        z: target.position.z,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
            isAnimating = false;
            //controls.enabled = true;
            createHotspots(); // Update hotspots after movement
        }
    });
    
    gsap.to(camera.rotation, {
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z,
        duration: 2,
        ease: "power2.inOut"
    });
}

// Raycaster for hotspot interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Raycaster improvements:
function onMouseClick(event) {
    if (isAnimating) return;
    
    // Calculate mouse position
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check intersections - include children in check
    const allObjects = [];
    hotspots.forEach(h => {
        allObjects.push(h.mesh);
        h.mesh.children.forEach(child => allObjects.push(child));
    });
    
    const intersects = raycaster.intersectObjects(allObjects);
    
    if (intersects.length > 0) {
        // Find the parent mesh if a child was clicked
        let clickedObject = intersects[0].object;
        while (clickedObject.parent && !hotspots.some(h => h.mesh === clickedObject)) {
            clickedObject = clickedObject.parent;
        }
        
        const clickedHotspot = hotspots.find(h => h.mesh === clickedObject);
        if (clickedHotspot) {
            moveCameraToPosition(clickedHotspot.targetPosition);
        }
    }
}

window.addEventListener('click', onMouseClick, false);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function createHomeButton() {
    const homeButton = document.createElement('div');
    homeButton.id = 'home-button';
    homeButton.innerHTML = 'Home';
    homeButton.title = 'Return to homepage';
    
    homeButton.addEventListener('click', () => {
        window.location.href = 'https://pearlrhythmfoundation.org/category/art-archive/'; // Change this to your actual homepage URL
    });
    
    document.body.appendChild(homeButton);
}

// Load the main model
const loader = new GLTFLoader();
loader.load('https://storage.googleapis.com/pearl-artifacts-cdn/pearl-gltf-artifacts/museum.glb', (gltf) => {
    console.log(gltf);
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(25, 25, 25);
    scene.add(model);
    checkAllAssetsLoaded();
    
    // Create initial hotspots
    createHotspots();
    
    // Debug: log camera position on click
    window.addEventListener("mouseup", function() {
        console.log("Camera position:", camera.position);
        console.log("Camera rotation:", camera.rotation);
    });
});

// Animation loop
const animate = () => {
     if (isMovingForward) {
        camera.translateZ(-moveSpeed);
    }
    renderer.render(scene, camera);
    //controls.update();
    requestAnimationFrame(animate);
};

animate();


        function updateLoadingProgress() {
                const percentage = Math.round((modelsLoaded / totalModels) * 100);
                document.getElementById('loading-percentage').textContent = percentage;
                document.getElementById('progress-bar-fill').style.width = `${percentage}%`;

                if (modelsLoaded === totalModels) {
                    // All models loaded, show main content
                    document.querySelector('.loading-screen').classList.add('fade-out');
                    document.querySelector('.main-content').classList.add('fade-in');
                }
            }

            function checkAllAssetsLoaded() {
                modelsLoaded++;
               
                updateLoadingProgress();    
        }     

document.addEventListener('DOMContentLoaded', function() {
    // Create home button
    createHomeButton();
    
    // Show the popup when the page loads
    const popup = document.getElementById('instructionPopup');
    popup.style.display = 'flex';
    
    // Close the popup when the button is clicked
    document.getElementById('closePopup').addEventListener('click', function() {
        popup.style.display = 'none';
    
                    });

                });