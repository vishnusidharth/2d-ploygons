import * as THREE from 'three';

// Define global variables for the scene and objects
let scene, camera, renderer, plane, vertices = [], lines = [], completedPolygon = [];
let completed = false;

// Setup the scene
function init() {
    scene = new THREE.Scene();

    // Setup the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);

    // Setup the renderer
    renderer = new THREE.WebGLRenderer({
        // antialias: true, 
        devicePixelRation: window.devicePixelRatio, 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Setup the ground plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20, 20, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = 'plane';
    scene.add(plane);

    // Create grid lines on the ground plane
    const gridHelper = new THREE.GridHelper(20, 20);
    gridHelper.name = 'helper'
    gridHelper.rotateX(Math.PI / 2)
    plane.add(gridHelper);

    // Add a mouse click listener to the renderer
    renderer.domElement.addEventListener('mousedown', onMouseDown);

    // Adding event listeners to the control buttons
    const [completeButton, resetButton, copyButton] = document.querySelectorAll('.controls>button');
    completeButton.addEventListener('click', completePolygon);
    resetButton.addEventListener('click', resetCanvas);
    copyButton.addEventListener('click', copyPolygon)
    
    // run animation loop
    animate();
}

// Mouse down event handler
function onMouseDown(event) {
    event.preventDefault();

    // Check if the polygon is complete
    if (event.target.tagName === 'BUTTON' || completed) {
        return;
    }

    // Get the mouse position on the plane
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the plane
    const intersects = raycaster.intersectObject(plane);
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

function createVertex(point) {
    const vertexGeometry = new THREE.SphereGeometry(0.1);
    const vertexMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const vertex = new THREE.Mesh(vertexGeometry, vertexMaterial);
    vertex.position.copy(point);
    vertices.push(vertex);
    scene.add(vertex);
}

function drawLine(vertices) {
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setFromPoints(vertices.map(vertex => vertex.position))
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    lines.push(line);
    scene.add(line);
}

// function that will generate and return polygon based on the global vertices
function createPolygon() {
    const shape = new THREE.Shape(vertices.map(vertex => new THREE.Vector2(vertex.position.x, vertex.position.y)));
    const geometry = new THREE.ShapeGeometry(shape)
    const material = new THREE.MeshBasicMaterial({ color: 0xff5500, side: THREE.DoubleSide });
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(
        vertices.reduce((acc, vertex) =>
            new Float32Array([...acc, ...[Number(vertex.position.x), Number(vertex.position.y), Number(vertex.position.z)]]),
            []
        ),
        3
    ));
    return new THREE.Mesh(geometry, material);
}

// Complete the polygon
function completePolygon() {
    if (vertices.length <= 2) {
        alert('Minimum of 3 vertices are required to create a polygon')
        return
    }
    if (!completed) {
        // Create the polygon
        const polygon = createPolygon();

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
    completedPolygon.forEach(polygon => scene.remove(polygon));
    lines.forEach(line => scene.remove(line));
    vertices.forEach(vertex => scene.remove(vertex));
    completedPolygon = [];
    vertices = [];
    lines = [];
    completed = false;
}

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate)
}

function copyPolygon() {
    if(!completed) {
        alert('please complete the polygon');
        return
    }
    const clone = completedPolygon[0].clone();
    completedPolygon.push(clone)
    scene.add(clone);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(plane);

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

// starting the app
init();