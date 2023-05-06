import * as THREE from 'three';

// Setup the scene
const scene = new THREE.Scene();

// Setup the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);

// Setup the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setup the ground plane
const planeGeometry = new THREE.PlaneGeometry(20, 20, 20, 20);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Create grid lines on the ground plane
const gridHelper = new THREE.GridHelper(20, 20);
gridHelper.rotation.x = -Math.PI / 2;
plane.add(gridHelper);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();