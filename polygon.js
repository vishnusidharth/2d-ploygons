import { Vector2, Shape, ShapeGeometry, Float32BufferAttribute, Mesh, MeshBasicMaterial, DoubleSide } from 'three';

export default class Polygon {
    constructor(
        vertices,
        color = 0xff5500
    ) {
        this.vertices = vertices;
        this.color = color;
    }

    get vertexCordinates2D() {
        return this.vertices.map(vertex => new Vector2(vertex.position.x, vertex.position.y));
    }

    get shape() {
        return new Shape(this.vertexCordinates2D);
    }

    get geometry() {
        const geometry = new ShapeGeometry(this.shape);
        geometry.setAttribute('position', new Float32BufferAttribute(
            this.convertVertexListToFloat32Array(this.vertices),
            3
        ));
        return geometry
    }

    generatePolygon(side = DoubleSide) {
        return this.polygon = new Mesh(
            this.geometry,
            new MeshBasicMaterial({ color: this.color, side: side })
        )
    }

    convertVertexListToFloat32Array(vertices) {
        return vertices.reduce((acc, vertex) =>
            new Float32Array([...acc, ...[Number(vertex.position.x), Number(vertex.position.y), Number(vertex.position.z)]]),
            []
        )
    }
}