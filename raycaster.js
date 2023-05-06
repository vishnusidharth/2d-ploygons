import { Raycaster } from 'three';

export default class RaycasterIntersections{
    constructor(mouse, camera, intersectingObject) {
        this.mouse = mouse;
        this.camera = camera;
        this.intersectingObject = intersectingObject
    }

    get intersectionPoints() {
        const raycaster = new Raycaster();
        raycaster.setFromCamera(this.mouse, this.camera);
        return raycaster.intersectObject(this.intersectingObject);
    }
}