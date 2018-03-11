import * as THREE from 'three';


const PI_2 = Math.PI / 2;


//export default function PointerLockControls(camera) {
export default class PointerLockControls {
  constructor(camera) {
    camera.rotation.set(0, 0, 0); // TODO: remove this if necessary

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);


    this.onMouseMove = this.onMouseMove.bind(this)
    document.addEventListener('mousemove', this.onMouseMove, false);

    this.enabled = false;

    // assumes the camera itself is not rotated
    this.direction = new THREE.Vector3(0, 0, - 1);
    this.rotation = new THREE.Euler(0, 0, 0, "YXZ");
  }

  onMouseMove (evt) {
    if (this.enabled) {
      const movementX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0;
      const movementY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0;

      this.yawObject.rotation.y -= movementX * 0.002;
      this.pitchObject.rotation.x -= movementY * 0.002;

      this.pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, this.pitchObject.rotation.x));
    }
  }

  dispose () {
    document.removeEventListener('mousemove', this.onMouseMove, false);
  }

  getObject () {
    return this.yawObject;
  }

  getDirection (v) {
    this.rotation.set(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0);
    v.copy(this.direction).applyEuler(this.rotation);

    return v;
  }

  getPlanarDirection (v) {
    const w = v.clone();
    w.applyEuler(new THREE.Euler(0, this.yawObject.rotation.y, 0, "YXZ"));

    return w;
  }

  getCoplanarDirection (v) {
    const w = v.clone();
    w.applyEuler(new THREE.Euler(0, - this.yawObject.rotation.y, 0, "YXZ"));

    return w;
  }
};
