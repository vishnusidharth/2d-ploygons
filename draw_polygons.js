import * as THREE from 'three';
import Polygon from './polygon';
import Vertex from './vertex'
import Line from './line';
import RaycasterIntersections from './raycaster'

// Define global variables for the scene and objects
let scene, camera, renderer, plane, vertices = [], lines = [], completedPolygon = [];
let completed = false;

function init() {
    // Setup the scene
    scene = new THREE.Scene();

    // Setup the camera
    camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 0.1, 1000);
    camera.position.z = 100;

    // Setup the renderer
    renderer = new THREE.WebGLRenderer({
        // antialias: true, 
        devicePixelRation: window.devicePixelRatio, 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Setup the ground plane
    const planeGeometry = new THREE.PlaneGeometry(500, 500, 500, 500);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = 'plane';
    scene.add(plane);

    // Create grid lines on the ground plane
    const gridHelper = new THREE.GridHelper(500, 15);
    gridHelper.name = 'helper'
    gridHelper.rotateX(Math.PI / 2)
    plane.add(gridHelper);

    // Add a mouse click listener to the renderer
    renderer.domElement.addEventListener('mousedown', startDrawingPolygon);

    // Adding event listeners to the control buttons
    const [completeButton, resetButton, copyButton] = document.querySelectorAll('.controls>button');
    completeButton.addEventListener('click', completePolygon);
    resetButton.addEventListener('click', resetCanvas);
    copyButton.addEventListener('click', copyPolygon)
    
    // run animation loop
    animate();
}

// Mouse down event handler
function startDrawingPolygon(event) {
    event.preventDefault();

    // Check if the polygon is complete
    if (event.target.tagName === 'BUTTON' || completed) {
        return;
    }

    // Get the mouse position on the plane
    const mouse = getMousePosition(event);

    // Check for intersections with the plane
    const intersects = new RaycasterIntersections(mouse, camera, plane).intersectionPoints;
    if (intersects.length > 0) {
        const point = intersects[0].point;

        // Create a new vertex
        createVertex(point);

        if (vertices.length > 1) {
            // Draw a line from the last vertex to the new vertex
            drawLine(vertices);
        }
    }
}

function getMousePosition(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return mouse
}

function createVertex(point) {
    const vertex = new Vertex(point, 2).generateVertex();
    vertices.push(vertex);
    scene.add(vertex);
}

function drawLine(vertices) {
    const line = new Line(vertices).generateLine();
    lines.push(line);
    scene.add(line);
}

// Complete the polygon
function completePolygon() {
    if (vertices.length <= 2) {
        alert('Minimum of 3 vertices are required to create a polygon')
        return
    }
    if (!completed) {
        // Create the polygon
        const polygon = new Polygon(vertices).generatePolygon();

        // generate edge that connecting first and last vertex
        drawLine([...vertices, vertices[0]])

        // Color the vertices and edges
        vertices.forEach(vertex => vertex.material.color.set(0x0000ff)); 
        lines.forEach(line => line.material.color.set(0x000000));

        // generate Group
        const group = new THREE.Group();
        [...vertices, ...lines, polygon].forEach(item => group.add(item))
        completedPolygon.push(group);
        scene.add(group);

        // mark completed state true
        completed = true
    }
}

function resetCanvas() {
    [...completedPolygon, ...lines, ...vertices].forEach(item => scene.remove(item));
    completedPolygon = [];
    vertices = [];
    lines = [];
    completed = false;
}

function copyPolygon() {
    if(!completed) {
        alert('please complete the polygon');
        return
    }
    const clone = completedPolygon[0].clone();
    completedPolygon.push(clone)
    scene.add(clone);

    function onMouseMove(event) {
        const mouse = getMousePosition(event);

        const intersects = new RaycasterIntersections(mouse, camera, plane).intersectionPoints;

        if (intersects.length > 0) {
            clone.position.copy(intersects[0].point);
        }
    }

    function onMouseDown(event) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mousedown', onMouseDown);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);

};

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate)
}

// starting the app
init();