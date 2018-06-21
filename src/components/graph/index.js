import React, { Component } from 'react';
import MobileDetect from 'mobile-detect'


const md = new MobileDetect(window.navigator.userAgent)


function zeroVector () {
  return { x: 0, y: 0 }
}

class Node extends Component {
  render() {
    return (
      <circle
        cx={this.props.x}
        cy={this.props.y}
        r={this.props.r}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onClick={this.props.onClick}
        fill={this.props.selected ? "#5555ff" : "#aaaaaa"}
      />
    )
  }
}


class Edge extends Component {
  static defaultProps = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    thickness: 1,
  }

  render() {
    // get two src and dst
    const x1 = this.props.x1
    const y1 = this.props.y1
    const x2 = this.props.x2
    const y2 = this.props.y2

    // don't draw an edge between nodes on top of each other
    if (x1 === x2 && y1 === y2) {
      return ""
    }

    const w = this.props.thickness

    // get slope of normal of line containing (x1, y1) and (x2, y2)
    let points = ""
    if (x1 === x2) {
      points = `${x1 - w},${y1} ${x1 + w},${y1} ${x2 + w},${y2} ${x2 - w},${y2}`
    } else if (y1 === y2) {
      points = `${x1},${y1 - w} ${x1},${y1 + w} ${x2},${y2 + w} ${x2},${y2 - w}`
    } else {
      const m = (x1 - x2)/(y2 - y1)
      const mag = Math.sqrt(1 + m*m)
      //const ux = 1 / mag
      //const uy = m / mag
      const wux = w / mag
      const wuy = (w * m) / mag
      points = `${x1 - wux},${y1 - wuy} ${x1 + wux},${y1 + wuy} ${x2 + wux},${y2 + wuy} ${x2 - wux},${y2 - wuy}`
    }


    return (
      <polygon
        points={points}
        fill="#555555"
      />
    )
  }
}


class Graph extends Component {
  static defaultProps = {
    nodes: {},
    edges: [],
    width: '100%',
    height: '100%',
    zoom: 100,
    interval: 100,
    wiggleInterval: 2000,
  }

  static NODE_RADIUS = 1
  static NODE_MASS = 1
  static EDGE_THICKNESS = 0.2
  static SPRING_CONSTANT = 25
  static SPRING_RESTING_LENGTH = 4
  static REPULSION_CONSTANT = 2000
  static ATTRACTION_CONSTANT = 100
  static DRAG_COEFFICIENT = 0.5
  static MAX_FRICTION = 10
  static CENTER_ATTRACTION_COEFFICIENT = 10

  static NEXT_ZOOM_LEVEL = {
    10: 12,
    12: 15,
    15: 20,
    20: 25,
    25: 35,
    35: 45,
    45: 60,
    60: 75,
    75: 100,
    100: 110,
    110: 125,
    125: 150,
    150: 175,
    175: 200,
    200: 250,
    250: 300,
    300: 400,
    400: 500,
    500: 750,
    750: 1000,
    1000: 1000,
  }
  static PREVIOUS_ZOOM_LEVEL = {
    10: 10,
    12: 10,
    15: 12,
    20: 15,
    25: 20,
    35: 25,
    45: 35,
    60: 45,
    75: 60,
    100: 75,
    110: 100,
    125: 110,
    150: 125,
    175: 150,
    200: 175,
    250: 200,
    300: 250,
    400: 300,
    500: 400,
    750: 500,
    1000: 750,
  }

  constructor(props) {
    super(props)

    this.state = {
      nodes: {}, // [id]: { id: String||Number, [value: String||Number] }
      edges: [], // String||Number
      positions: {}, // keeps coordinate of each node
      velocities: {}, // keeps coordinate of each node
      heldNodeId: '',
      selectedNodeId: '',
      connectButtonPushed: false,
      disconnectButtonPushed: false,
      zoom: this.props.zoom || 100,
      touchscreen: Boolean(md.mobile() || md.phone() || md.tablet()),
    }
  }

  componentWillMount() {
    // TODO: decide on how to allot coordinates
    // enumerate the nodes
    //const nodeList = this.getNodeList()
    const nodeList = Object.keys(this.props.nodes).map((k) => this.props.nodes[k])

    // find smallest cube w/ integer sides w/ area >= (# nodes) * (3 * node radius / 2)^2
    const smallestIntegerSquareRoot = Math.ceil(Math.sqrt(nodeList.length))

    // arrange nodes in cube
    const positions = {}
    for (let y = 0; y < smallestIntegerSquareRoot; y += 1) {
      for (let x = 0, i = (y * smallestIntegerSquareRoot) + x; x < smallestIntegerSquareRoot && i < nodeList.length; x += 1, i += 1) {
        positions[nodeList[i].id] = {
          id: nodeList[i].id,
          x: x * (3 * Graph.NODE_RADIUS) + Graph.NODE_RADIUS,
          y: y * (3 * Graph.NODE_RADIUS) + Graph.NODE_RADIUS,
        }
      }
    }

    // translate "cube" of nodes to center of grid
    const exactCubeWidth = (3 * smallestIntegerSquareRoot - 1) * Graph.NODE_RADIUS
    const avex = (this.getViewSideLength() - exactCubeWidth) / 2
    const avey = avex
    nodeList.forEach(({ id }) => {
      positions[id].x += avex
      positions[id].y += avey
    })

    // set all velocities to 0
    const velocities = {}
    nodeList.forEach(({ id }) => {
      velocities[id] = zeroVector()
      velocities[id].id = id
    })

    this.setState({
      ...this.state,
      nodes: { ...this.props.nodes },
      edges: [ ...this.props.edges ],
      positions,
      velocities,
    })

    setTimeout(() => this.tick(), this.props.interval)
    setInterval(() => this.wiggle(), this.props.wiggleInterval)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.zoom !== this.state.zoom) {
      this.setState({ zoom: nextProps.zoom })
    }
  }

  // move the nodes around
  tick() {
    const dt = this.props.interval / 1000
    const nodeList = this.getNodeList()
    const positions = this.state.positions
    const forces = {}
    nodeList.forEach(({ id }) => {
      forces[id] = zeroVector()
    })

    // calculate force of spring (edge) between each node
    this.state.edges.forEach(edge => {
      const src = positions[edge.src]
      const dst = positions[edge.dst]

      const force = this.computeForceOfSpring(src, dst)

      forces[src.id].x += force.x
      forces[src.id].y += force.y

      forces[dst.id].x -= force.x
      forces[dst.id].y -= force.y
    })

    // calculate repulsion between nodes
    for (let i = 0; i < nodeList.length; i += 1) {
      for (let j = i + 1; j < nodeList.length; j += 1) {
        const srcId = nodeList[i].id
        const src = positions[srcId]
        const dstId = nodeList[j].id
        const dst = positions[dstId]

        const force = this.computeForceOfRepulsion(src, dst)
        
        forces[src.id].x += force.x
        forces[src.id].y += force.y

        forces[dst.id].x -= force.x
        forces[dst.id].y -= force.y
      }
    }

    // we need a weak force of attraction, in case the graph isn't connected, so it doesn't fly apart forever
    // calculate repulsion between nodes
    for (let i = 0; i < nodeList.length; i += 1) {
      for (let j = i + 1; j < nodeList.length; j += 1) {
        const srcId = nodeList[i].id
        const src = positions[srcId]
        const dstId = nodeList[j].id
        const dst = positions[dstId]

        const force = this.computeForceOfAttraction(src, dst)
        
        forces[src.id].x += force.x
        forces[src.id].y += force.y

        forces[dst.id].x -= force.x
        forces[dst.id].y -= force.y
      }
    }

    // find center of mass and accelerate graph as a whole towards center
    const massPositionSum = nodeList.reduce((sum, { id }) => {
      sum.x += Graph.NODE_MASS * positions[id].x
      sum.y += Graph.NODE_MASS * positions[id].y
      return sum
    }, { x: 0, y: 0 })
    const center = {
      x: massPositionSum.x / nodeList.length,
      y: massPositionSum.y / nodeList.length,
    }
    const centralForce = this.computeForceBetweenCenters(center)
    for (let i = 0; i < nodeList.length; i += 1) {
      const id = nodeList[i].id
      
      forces[id].x += centralForce.x
      forces[id].y += centralForce.y
    }

    // calculate friction on each node
    for (let i = 0; i < nodeList.length; i += 1) {
      const id = nodeList[i].id
      const v = this.state.velocities[id]

      const force = this.computeForceOfFriction(v)
      
      forces[id].x += force.x
      forces[id].y += force.y
    }

    // apply individual forces
    const nextVelocities = { ...this.state.velocities }
    Object.keys(forces)
      .filter(id => '' + id !== '' + this.state.heldNodeId) // don't accelerate held node
      .map(id => ({ id, ...forces[id] }))
      .forEach(({ id, x, y}) => {
        const v = { ...this.state.velocities[id] }
        // f = m*a <=> a = f/m
        const dx = x / Graph.NODE_MASS
        const dy = y / Graph.NODE_MASS

        // dv = a * dt
        v.x += (dx * dt)
        v.y += (dy * dt)

        nextVelocities[id] = v
      })

    // apply velocities
    const nextPositions = { ...positions }
    Object.keys(nextVelocities)
      .filter(id => '' + id !== '' + this.state.heldNodeId) // don't move held node
      .map(id => nextVelocities[id])
      .forEach(({ id, x: dx, y: dy}) => {
        const pos = { ...positions[id] }

        // dr = v * dt
        pos.x += (dx * dt)
        pos.y += (dy * dt)

        nextPositions[id] = pos
      })

    this.setState({ velocities: nextVelocities })
    this.setState({ positions: nextPositions })


    setTimeout(() => this.tick(), this.props.interval)
  }

  wiggle() {
    const nodeList = this.getNodeList()
    const wiggleNodes = []
    for (let i = 0; i < nodeList.length; i += 1) {
      if (Math.random() < 0.05) {
        wiggleNodes.push(nodeList[i])
      }
    }

    const nextVelocities = { ...this.state.velocities }
    for (let i = 0; i < wiggleNodes.length; i += 1) {
      const id = wiggleNodes[i].id
      const v = { ...nextVelocities[id] }

      const r = 10 * Math.random()
      const theta = 2 * Math.PI * Math.random()
      const dx = r * Math.cos(theta)
      const dy = r * Math.sin(theta)

      v.x += dx
      v.y += dy
      
      nextVelocities[id] = v
    }

    this.setState({ velocities: nextVelocities })
  }

  computeForceOfSpring({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    const y = (y2 - y1)
    const x = (x2 - x1)
    const r = Math.sqrt(x*x + y*y)
    const f = Graph.SPRING_CONSTANT * (r - Graph.SPRING_RESTING_LENGTH)

    return {
      x: f*x/r,
      y: f*y/r,
    }
  }

  computeForceOfRepulsion({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    const y = (y2 - y1)
    const x = (x2 - x1)
    const r = Math.sqrt(x*x + y*y)
    // if/when nodes begin to have different masses, their masses can be inserted here
    const m1 = Graph.NODE_MASS
    const m2 = Graph.NODE_MASS
    const f = - (Graph.REPULSION_CONSTANT * m1 * m2) / (r * r)

    return {
      x: f*x/r,
      y: f*y/r,
    }
  }

  computeForceOfAttraction({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    const y = (y2 - y1)
    const x = (x2 - x1)
    const r = Math.sqrt(x*x + y*y)
    // if/when nodes begin to have different masses, their masses can be inserted here
    const m1 = Graph.NODE_MASS
    const m2 = Graph.NODE_MASS
    const f = (Graph.ATTRACTION_CONSTANT * m1 * m2) / r

    return {
      x: f*x/r,
      y: f*y/r,
    }
  }

  computeForceOfFriction({ x, y }) { // vector is velocity, not position
    let f = Graph.DRAG_COEFFICIENT * Math.sqrt(x*x + y*y)

    // cap it so we don't get wacky jump behavior
    f = (f > Graph.MAX_FRICTION) ? Graph.MAX_FRICTION : f

    return {
      x: - f*x,
      y: - f*y,
    }
  }

  computeForceBetweenCenters({ x: x1, y: y1 }) {
    const x2 = this.getViewSideLength() / 2
    const y2 = x2
    const y = (y2 - y1)
    const x = (x2 - x1)
    const r = Math.sqrt(x*x + y*y)
    const f = Graph.CENTER_ATTRACTION_COEFFICIENT * r

    return {
      x: f*x/r,
      y: f*y/r,
    }
  }

  onNodeMouseDown(id, e) {
    e.preventDefault()

    this.moveNodeToMouseLocation(id, e)
    this.stopNode(id)
    this.setState({ heldNodeId: id })
  }

  moveNodeToMouseLocation(id, e) {
    // get client dimension of app/svg and mouse click
    const appWidth = e.target.parentNode.clientWidth
    const appHeight = e.target.parentNode.clientHeight
    const clickX = e.nativeEvent.offsetX
    const clickY = e.nativeEvent.offsetY

    // transform mouse click location to viewbox coordinates
    const viewSideLength = this.getViewSideLength()
    const x = viewSideLength * clickX / appWidth
    const y = viewSideLength * clickY / appHeight

    this.setState({
      positions: {
        ...this.state.positions,
        [id]: {
          ...this.state.positions[id],
          x,
          y,
        },
      },
    })
  }

  stopNode(id) {
    this.setState({
      velocities: {
        ...this.state.velocities,
        [id]: {
          ...this.state.velocities[id],
          x: 0,
          y: 0,
        },
      },
    })
  }

  onNodeMouseUp(e) {
    e.preventDefault()

    this.setState({ heldNodeId: '' })
  }

  onNodeClick(id, e) {
    e.preventDefault()
    e.stopPropagation()
    if (this.state.connectButtonPushed) {
      this.connectNodes(this.state.selectedNodeId, id)
      this.setState({ connectButtonPushed: false })
    } else if (this.state.disconnectButtonPushed) {
      this.disconnectNodes(this.state.selectedNodeId, id)
      this.setState({ disconnectButtonPushed: false })
    } else {
      this.setState({ selectedNodeId: id })
    }
  }

  onBackgroundMouseClick(e) {
    e.preventDefault()

    if (this.state.touchscreen) {
      if (this.state.selectedNodeId !== undefined && this.state.selectedNodeId !== '') {
        this.moveNodeToMouseLocation(this.state.selectedNodeId, e)
      }
    } else {
      this.setState({ selectedNodeId: '' })
    }
  }

  onMouseMove(e) {
    e.preventDefault()

    if (this.state.heldNodeId !== undefined && this.state.heldNodeId !== '') {
      this.moveNodeToMouseLocation(this.state.heldNodeId, e)
    }
  }

  addNode() {
    const id = this.state.selectedNodeId
    if (id === undefined || id === '') {
      return
    }

    const newId = 10 * Math.random()

    // add node
    const nodes = { ...this.state.nodes }
    nodes[newId] = { id: newId }

    // add edge
    const edges = [ ...this.state.edges, { src: id, dst: newId } ]

    // add position, random but close to neighbor
    const positions = { ...this.state.positions }
    const pos = positions[id]
    const theta = 2 * Math.PI * Math.random()
    const dx = Math.cos(theta)
    const dy = Math.sin(theta)
    const newPos = {
      id: newId,
      x: pos.x + dx,
      y: pos.y + dy,
    }
    positions[newId] = newPos

    // zero velocity
    const velocities = { ...this.state.velocities }
    velocities[newId] = zeroVector()
    velocities[newId].id = newId
    
    this.setState({
      nodes,
      edges,
      positions,
      velocities,
    })
  }

  removeNode() {
    const id = this.state.selectedNodeId
    if (id === undefined || id === '') {
      return
    }

    const nodes = { ...this.state.nodes }
    delete nodes[id]
    const edges = this.state.edges.filter(({ src, dst }) => '' + src !== '' + id && '' + dst !== '' + id)
    const positions = { ...this.state.positions }
    delete positions[id]
    const velocities = { ...this.state.velocities }
    delete velocities[id]

    this.setState({
      nodes,
      edges,
      positions,
      velocities,
      heldNodeId: '',
      selectedNodeId: '',
    })
  }

  prepareToConnectNodes() {
    this.setState({ connectButtonPushed: true })
  }

  connectNodes(srcId, dstId) {
    const edges = [ ...this.state.edges, { src: srcId, dst: dstId } ]

    this.setState({ edges })
  }

  prepareToDisconnectNodes() {
    this.setState({ disconnectButtonPushed: true })
  }

  disconnectNodes(srcId, dstId) {
    const edges = this.state.edges.filter(({ src, dst }) => {
      if (src === srcId && dst === dstId) {
        return false
      } else if (src === dstId && dst === srcId) {
        return false
      }
      return true
    })

    this.setState({ edges })
  }

  zoomIn() {
    this.setState({ zoom: this.state.zoom * 1.1 })
  }

  zoomOut() {
    this.setState({ zoom: this.state.zoom * 0.9 })
  }

  getNodeList() {
    return Object.keys(this.state.nodes).map((k) => this.state.nodes[k])
  }

  getNodes() {
    return Object.keys(this.state.positions).map(id => this.state.positions[id]).map(p =>
      <Node
        key={p.id}
        x={p.x}
        y={p.y}
        r={Graph.NODE_RADIUS}
        selected={p.id === this.state.selectedNodeId}
        onMouseDown={(e) => this.onNodeMouseDown(p.id, e)}
        onMouseUp={(e) => this.onNodeMouseUp(e)}
        onClick={(e) => this.onNodeClick(p.id, e)}
      />
    )
  }

  getEdges() {
    return this.state.edges
      .map(({ src, dst }) => ({
        src: this.state.positions[src],
        dst: this.state.positions[dst]
      }))
      .map(({ src: { id: id1, x: x1, y: y1 }, dst: { id: id2, x: x2, y: y2 } }) =>
        <Edge key={`{src: ${id1}, dst: ${id2}}`} x1={x1} y1={y1} x2={x2} y2={y2} thickness={Graph.EDGE_THICKNESS} />
      )
  }

  getViewSideLength = () => 10000/this.state.zoom

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <div>
          <svg
            version="1.1"
            baseProfile="full"
            width={this.props.width} height={this.props.height}
            viewBox={`0 0 ${this.getViewSideLength()} ${this.getViewSideLength()}`}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth="0.1" stroke="rgba(0, 0, 0, 0.5)"
            onMouseMove={(e) => this.onMouseMove(e)}
            onClick={(e) => this.onBackgroundMouseClick(e)}
          >
            {this.getEdges()}
            {this.getNodes()}
          </svg>
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItem: 'center',
        }}>
          <div>
            <label>nodes: </label>
            <button
              onClick={() => this.addNode()}
              disabled={this.state.selectedNodeId === undefined || this.state.selectedNodeId === ''}
            >
              +
            </button>
            <button
              onClick={() => this.removeNode()}
              disabled={this.state.selectedNodeId === undefined || this.state.selectedNodeId === ''}
            >
              -
            </button>
          </div>

          <div>
            <button
              onClick={() => this.prepareToConnectNodes()}
              disabled={this.state.selectedNodeId === undefined || this.state.selectedNodeId === ''}
              style={{
                backgroundColor: this.state.connectButtonPushed ? '#888888' : '',
              }}
            >
              connect
            </button>
            <button
              onClick={() => this.prepareToDisconnectNodes()}
              disabled={this.state.selectedNodeId === undefined || this.state.selectedNodeId === ''}
              style={{
                backgroundColor: this.state.disconnectButtonPushed ? '#888888' : '',
              }}
            >
              disconnect
            </button>
          </div>

          <div>
            <label>zoom: </label>
            <button
              onClick={() => this.zoomIn()}
            >
              +
            </button>
            <button
              onClick={() => this.zoomOut()}
            >
              {"-"}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Graph
