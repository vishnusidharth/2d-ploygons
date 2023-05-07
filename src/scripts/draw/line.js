import * as THREE from 'three';

export default class Line {
    constructor(
        vertices,
        color = 0x00ff00
    ) {
        this.vertices = vertices;
        this.color = color;
    }

    generateLine() {
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setFromPoints(this.vertices.map(vertex => vertex.position));
        return new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: this.color }));
    }
}