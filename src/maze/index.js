import React, { Component } from 'react';
import * as THREE from 'three';
import PointerLockControls from './PointerLockControls';
//import './App.css';
import createMazeAndWalls from './maze';



class Maze3D extends Component {
  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.pointerLockChange = this.pointerLockChange.bind(this);
    this.pointerlockerror = this.pointerlockerror.bind(this);
    this.onInstructionsClick = this.onInstructionsClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    // rendered objects
    this.boxes = [];
    this.walls = [];

    // raycasters about body of player/camera
    this.bodyRaycasters = [];

    // maze
    const { maze, walls } = createMazeAndWalls(30, 30);

    this.state = {
      havePointerLock: true, // keep true, hiding failure message until needed
      showInstructions: true,
      controlsEnabled: true,

      moveForward: false,
      moveLeft: false,
      moveBackward: false,
      moveRight: false,
      canJump: true,

      maze,
      walls,
    }
  }

  componentDidMount() {
    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
    let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    this.setState({ havePointerLock });

    if (havePointerLock) {
      // Hook pointer lock state change events
      document.addEventListener('pointerlockchange', this.pointerLockChange, false);
      document.addEventListener('mozpointerlockchange', this.pointerLockChange, false);
      document.addEventListener('webkitpointerlockchange', this.pointerLockChange, false);
      document.addEventListener('pointerlockerror', this.pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', this.pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', this.pointerlockerror, false);
    }

    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.init();
    this.animate();
  }

  componentWillUnmount() {
    document.removeEventListener('pointerlockchange', this.pointerLockChange, false);
    document.removeEventListener('mozpointerlockchange', this.pointerLockChange, false);
    document.removeEventListener('webkitpointerlockchange', this.pointerLockChange, false);
    document.removeEventListener('pointerlockerror', this.pointerlockerror, false);
    document.removeEventListener('mozpointerlockerror', this.pointerlockerror, false);
    document.removeEventListener('webkitpointerlockerror', this.pointerlockerror, false);

    // TODO: save the state between transitions
    /*
    if (this.props.saveState) {
      this.props.saveState({
        state: this.state,
      });
    }
    */
  }

  pointerLockChange () {
    const body = document.body;

    if (document.pointerLockElement === body || document.mozPointerLockElement === body || document.webkitPointerLockElement === body) {
      this.controls.enabled = true;
      this.setState({
        showInstructions: false,
        controlsEnabled: true,

        // prevent player/camera from continuing to move after moving focus
        moveForward: false,
        moveLeft: false,
        moveBackward: false,
        moveRight: false,
      });
    } else {
      this.controls.enabled = false;
      this.setState({
        showInstructions: true,
        // note when game is paused for fluid movements
        paused: true,
      });
    }
  }

  pointerlockerror () {
    this.setState({ showInstructions: false });
  }

  onInstructionsClick() {
    const body = document.body
    this.setState({ showInstructions: false });

    // Ask the browser to lock the pointer
    body.requestPointerLock = body.requestPointerLock || body.mozRequestPointerLock || body.webkitRequestPointerLock;
    body.requestPointerLock();
  }

  init () {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.fog = new THREE.Fog(0xffffff, 0, 750);

    this.light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    this.light.position.set(0.5, 1, 0.75);
    this.scene.add(this.light);

    this.controls = new PointerLockControls(this.camera);
    this.scene.add(this.controls.getObject());

    document.addEventListener('keydown', this.onKeyDown, false);
    document.addEventListener('keyup', this.onKeyUp, false);

    // box top collision detection
    //this.boxRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

    // wall collision detection
    this.updateBodyRaycasters();

    // floor
    const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(- Math.PI / 2);
    for (let i = 0, l = floorGeometry.vertices.length; i < l; i ++ ) {
      const vertex = floorGeometry.vertices[ i ];
      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;
    }
    for (let i = 0, l = floorGeometry.faces.length; i < l; i ++ ) {
      const face = floorGeometry.faces[ i ];
      face.vertexColors[ 0 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      face.vertexColors[ 1 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      face.vertexColors[ 2 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    }

    const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.scene.add(this.floor);

    // boxes
    /*
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    for (let i = 0, l = boxGeometry.faces.length; i < l; i ++ ) {
      const face = boxGeometry.faces[ i ];
      face.vertexColors[ 0 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      face.vertexColors[ 1 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      face.vertexColors[ 2 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    }
    for (let i = 0; i < 500; i ++ ) {
      const boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors });
      boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.x = Math.floor(Math.random() * 20 - 10 ) * 20;
      box.position.y = Math.floor(Math.random() * 20 ) * 20 + 10;
      box.position.z = Math.floor(Math.random() * 20 - 10 ) * 20;
      this.scene.add(box);
      this.boxes.push(box);
    }
    */

    // walls
    const wallGeometry = new THREE.PlaneGeometry(20, 20, 2, 2); // parallel with x axis
    const rotatedWallGeometry = new THREE.PlaneGeometry(20, 20, 2, 2); // parallel with z axis
    [wallGeometry, rotatedWallGeometry].forEach((geometry) => {
      geometry.faces.forEach((face) => {
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      })
    });
    rotatedWallGeometry.rotateY(Math.PI / 2);

    const serializeEdge = (e) => `(${e.data.from.x},${e.data.from.y})->(${e.data.to.x},${e.data.to.y})`;
    const visitedEdges = {};
    this.state.walls.walk(this.state.walls.getEntrypoint(), () => {}, (e) => {
      const key = serializeEdge(e);
      if (!visitedEdges[key]) {
        visitedEdges[key] = true;

        let wall;
        const wallMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, /* color: 0xffff00, */ side: THREE.DoubleSide });
        wallMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        const rotated = e.src.data.x === e.dst.data.x;
        const x = 10 * (e.src.data.x + e.dst.data.x);
        const z = - 10 * (e.src.data.y + e.dst.data.y);

        if (rotated) {
          wall = new THREE.Mesh(rotatedWallGeometry, wallMaterial);
          wall.position.x = x - 10;
          wall.position.z = z + 10;
        } else {
          wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.x = x - 10;
          wall.position.z = z + 10;
        }
        wall.position.y = 10;
        this.scene.add(wall);
        this.walls.push(wall);
      }
    });

    /*
    for (let i = 0; i < 100; i++) {
      const wallMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, side: THREE.DoubleSide });
      wallMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      const rotated = randomBool();
      let wall;
      const x = Math.floor(Math.random() * 20 - 10) * 20;
      const z = Math.floor(Math.random() * 20 - 10) * 20;
      if (rotated) {
        wall = new THREE.Mesh(rotatedWallGeometry, wallMaterial);
        wall.position.x = x + 10;
        wall.position.z = z;
      } else {
        wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.x = x;
        wall.position.z = z + 10;
      }
      wall.position.y = 10;
      this.scene.add(wall);
      this.walls.push(wall);
    }
    */

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.appendRenderer()

    window.addEventListener('resize', this.onWindowResize, false);
  }

  onKeyDown (evt) {
    switch (evt.keyCode) {
      case 38: // up
      case 87: // w
        if (!this.state.moveForward) {
          this.setState({ moveForward: true });
        }
        break;

      case 37: // left
      case 65: // a
        if (!this.state.moveLeft) {
          this.setState({ moveLeft: true });
        }
        break;

      case 40: // down
      case 83: // s
        if (!this.state.moveBackward) {
          this.setState({ moveBackward: true });
        }
        break;

      case 39: // right
      case 68: // d
        if (!this.state.moveRight) {
          this.setState({ moveRight: true });
        }
        break;

      case 32: // space
        if (this.state.canJump) {
          this.velocity.y += 350;
          this.setState({ canJump: false });
        }
        break;

      default:
        break;
    }
  };

  onKeyUp (evt) {
    switch(evt.keyCode) {
      case 38: // up
      case 87: // w
        if (this.state.moveForward) {
          this.setState({ moveForward: false });
        }
        break;

      case 37: // left
      case 65: // a
        if (this.state.moveLeft) {
          this.setState({ moveLeft: false });
        }
        break;

      case 40: // down
      case 83: // s
        if (this.state.moveBackward) {
          this.setState({ moveBackward: false });
        }
        break;

      case 39: // right
      case 68: // d
        if (this.state.moveRight) {
          this.setState({ moveRight: false });
        }
        break;

      default:
        break;
    }
  }

  onWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate () {
    requestAnimationFrame(this.animate);

    //if (this.state.controlsEnabled === true) {
    if (this.controls.enabled === true) {
      /*
      this.boxRaycaster.ray.origin.copy(this.controls.getObject().position);
      this.boxRaycaster.ray.origin.y -= 10;
      */

      this.updateBodyRaycasters();

      // time step
      const time = performance.now();
      let delta;
      if (this.state.paused) {
        // track if was recently paused for fluid movement
        this.setState({ paused: false });
        delta = this.prevDelta;
      } else {
        delta = (time - this.prevTime) / 1000;
      }

      // friction
      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;

      // gravity
      this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      // unit vector of direction of travel implied from keys pressed
      this.direction.z = Number(this.state.moveForward) - Number(this.state.moveBackward);
      this.direction.x = Number(this.state.moveLeft) - Number(this.state.moveRight);
      this.direction.normalize(); // this ensures consistent movements in all directions

      // adjust velocity be direction of travel
      if (xor(this.state.moveForward, this.state.moveBackward)) {
        this.velocity.z -= this.direction.z * 400.0 * delta;
      }
      if (xor(this.state.moveLeft, this.state.moveRight)) {
        this.velocity.x -= this.direction.x * 400.0 * delta;
      }

      this.controls.getObject().translateX(this.velocity.x * delta);
      this.controls.getObject().translateY(this.velocity.y * delta);
      this.controls.getObject().translateZ(this.velocity.z * delta);

      for (let i = 0; i < this.bodyRaycasters.length; i++) {
        const raycaster = this.bodyRaycasters[i];
        const intersections = raycaster.intersectObjects(this.walls);
        const closestIntersection = intersections[0];
        if (closestIntersection) {
          const wall = closestIntersection.object;
          const v1 = wall.geometry.vertices[0];
          const v2 = wall.geometry.vertices[6];
          const v3 = wall.geometry.vertices[8];
          const n = v1.clone().sub(v3).cross(v2.clone().sub(v3)).normalize();
          const p = this.controls.getObject().position.clone().sub(wall.position);
          let d = n.dot(p);
          if (d < 0) {
            n.negate();
            d *= -1;
          }
          n.multiplyScalar(5 - d);
          this.controls.getObject().position.add(n);
          const m = this.controls.getCoplanarDirection(n);
          m.divideScalar(5 - d);
          this.velocity.add(m.multiplyScalar(25));
        }
      }

      if (this.controls.getObject().position.y < 10 ) {
        this.velocity.y = 0;
        this.controls.getObject().position.y = 10;
        if (!this.state.canJump) {
          this.setState({ canJump: true });
        }
      }

      this.prevTime = time;
      this.prevDelta = delta;
    }

    this.renderer.render(this.scene, this.camera);
  }
  
  // 8 points around unit circle in xz-plane starting from (x=0, z=-1) counterclockwise
  static bodyRaycasterDirections = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const angle = i * Math.PI / 4;
    const x = - Math.sin(angle);
    const z = - Math.cos(angle);
    return new THREE.Vector3(x, 0, z);
  })

  updateBodyRaycasters() {
    Maze3D.bodyRaycasterDirections//.slice(0, 1) // TODO: update later
    .map((direction) => this.controls.getPlanarDirection(direction))
    .forEach((direction, i) => {
      if (this.bodyRaycasters[i]) {
        this.bodyRaycasters[i].ray.direction.copy(direction);
        this.bodyRaycasters[i].ray.origin.copy(this.controls.getObject().position);
      } else {
        this.bodyRaycasters.push(new THREE.Raycaster(this.controls.getObject().position, direction, 0, 5)); // TODO: reduce to 10 or something
      }
    });
  }

  updateRef(root) {
    if (root && this.root !== root) {
      this.root = root;
      this.appendRenderer()
    }
  }

  appendRenderer() {
    if (this.root && this.renderer && this.renderer.domElement) {
      this.root.appendChild(this.renderer.domElement);
    }
  }

  render() {
    const blockerStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: this.state.showInstructions ? 'rgba(0,0,0,0.5)' : '',
    };
    const instructionsStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      textAlign: 'center',
      cursor: 'pointer',
    };

    return (
      <div style={{ width: '100%', height: '100%' }} ref={(root) => this.updateRef(root)}>
        <div id="blocker" style={blockerStyle}>
          {this.state.havePointerLock ?
            this.state.showInstructions ?
              <div id="instructions" style={instructionsStyle} onClick={this.onInstructionsClick}>
                <div>
                  <span style={{ fontSize: "40px" }}>Click to play</span>
                  <br />
                  (W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)
                </div>
              </div> :
              '' :
            "Your browser doesn't seem to support Pointer Lock API"
          }
        </div>
      </div>
    );
  }
}


/*
function randomBool () {
  return Boolean(Math.floor(Math.random() * 2));
}
*/


function xor (a, b) {
  return (a && !b) || (!a && b);
}


export default Maze3D;
