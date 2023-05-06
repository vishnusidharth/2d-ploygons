import * as THREE from 'three';

export default class Vertex {
    constructor( position, size = 0.1, color = 0x00ff00 ) {
        this.position = position;
        this.size = size;
        this.color = color;
    }

    generateVertex() {
        const vertex = new THREE.Mesh( new THREE.SphereGeometry(this.size), new THREE.MeshBasicMaterial({ color: this.color }) );
        vertex.position.copy(this.position);
        return vertex;
    }
}