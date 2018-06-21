export default function createMazeAndWalls(width, length) {
  const maze = createMaze(width, length);
  //console.log(maze);

  // create the graph representing the walls of the maze
  // step 1: create every possible wall
  const wallGraph = new Graph();
  let prevCol = [];
  let col = [];

  for (let i = 0; i < width + 1; i++) {
    for (let j = 0; j < length + 1; j++) {
      let v = wallGraph.newVertice({ x: i, y: j });
      col.push(v);

      if (i > 0) {
        // horizontal wall
        wallGraph.connectVertices(prevCol[j], v, { from: { x: i - 1, y: j - 1 }, to: { x: i - 1, y: j } });
      }
      if (j > 0) {
        // vertical wall
        wallGraph.connectVertices(col[j - 1], v, { from: { x: i - 1, y: j - 1 }, to: { x: i, y: j - 1 } });
      }
    }

    prevCol = col;
    col = [];
  }

  //console.log(wallGraph.getEntrypoint());

  // step 2: remove every wall between connected cells of the maze
  const serializePoint = ({ x, y }) => `${x}-${y}`;
  const wallsToRemove = {};
  const mazeStart = maze.maze.getEntrypoint();
  maze.maze.walk(mazeStart, () => {}, (e) => {
    const src = serializePoint(e.src.data);
    const dst = serializePoint(e.dst.data);
    wallsToRemove[src] = wallsToRemove[src] || [];
    wallsToRemove[src].push(e.dst.data);
    wallsToRemove[dst] = wallsToRemove[dst] || [];
    wallsToRemove[dst].push(e.src.data);
  });
  //console.log('wallsToRemove:', wallsToRemove);
  const wallGraphStart = wallGraph.getEntrypoint();
  wallGraph.walk(wallGraphStart, () => {}, (e) => {
    let from = serializePoint(e.data.from);
    let to = serializePoint(e.data.to);

    if (wallsToRemove[from]) {
      wallsToRemove[from].forEach((data) => {
        if (data.x === e.data.to.x && data.y === e.data.to.y) {
          wallGraph.removeEdge(e);
        }
      });
    } else if (wallsToRemove[to]) {
      wallsToRemove[to].forEach((data) => {
        if (data.x === e.data.to.x && data.y === e.data.to.y) {
          wallGraph.removeEdge(e);
        }
      });
    }
  });

  //console.log('walls:', wallGraphStart);
  //console.log(wallGraph.getEntrypoint());
  return {
    maze,
    walls: wallGraph,
  }
}


function createMaze(n, m) {
  function randomBranchLengthLimit () {
    return Math.floor(Math.sqrt(n * m) + 1);
  }

  const visited = createZeroMatrix(n, m);
  const closed = createZeroMatrix(n, m);
  const graph = new Graph();
  const start = graph.newVertice({ x: 0, y: 0 });
  const end = graph.newVertice({ x: n - 1, y: m - 1 });  
  visited[0][0] = 1;
  closed[n - 1][m - 1] = 1;

  
  function computeBranch (branchStart) {
    let branchLengthLimit = randomBranchLengthLimit();
    let length = 0;
    let cell = branchStart;
    let nextCell;

    while (cell && length < branchLengthLimit) {
      let choicePriority = randomFourArray();
      const x = cell.data.x;
      const y = cell.data.y;
      
      for (let i = 0; i < choicePriority.length; i++) {
        const choice = choicePriority[i];

        if (choice === 0 && visited[x][y + 1] === 0) { // up
          visited[x][y + 1] = 1;
          if (x === n - 1 && y + 1 === m - 1) {
            // reached the end of the maze
            graph.connectVertices(cell, end);
            length++;
          } else {
            nextCell = graph.newVertice({ x, y: y + 1 });
            graph.connectVertices(cell, nextCell);
            length++;
          }
          break;
        } else if (choice === 1 && visited[x][y - 1] === 0) { // down
          visited[x][y - 1] = 1;
          nextCell = graph.newVertice({ x, y: y - 1 });
          graph.connectVertices(cell, nextCell);
          length++;
          break;
        } else if (choice === 2 && visited[x - 1] && visited[x - 1][y] === 0) { // left
          visited[x - 1][y] = 1;
          nextCell = graph.newVertice({ x: x - 1, y });
          graph.connectVertices(cell, nextCell);
          length++;
          break;
        } else if (choice === 3 && visited[x + 1] && visited[x + 1][y] === 0) { // right
          visited[x + 1][y] = 1;
          if (x + 1 === n - 1 && y === m - 1) {
            // reached the end of the maze
            graph.connectVertices(cell, end);
            length++;
          } else {
            nextCell = graph.newVertice({ x: x + 1, y });
            graph.connectVertices(cell, nextCell);
            length++;
          }
          break;
        }
      }

      cell = nextCell;
      nextCell = undefined;
    }

    return length;
  }

  // depth first (with no loops in the maze, we don't need to track what's been visited)
  function walkMaze (cell, onCell, visited = {}) {
    if (visited[cell.id]) {
      return
    }

    onCell(cell);
    visited[cell.id] = true;

    Object.keys(cell.edges).forEach(id => {
      walkMaze(cell.edges[id].dst, onCell, visited);
    })
  }

  let branchStart = start;
  let mazeComplete = false;

  while (!mazeComplete) {
    computeBranch(branchStart);

    let nextBranchStartChosen = false;
    walkMaze(start, (cell) => {
      const x = cell.data.x;
      const y = cell.data.y;

      if (!closed[x][y]) {
        if ((visited[x][y + 1] === 1 || visited[x][y + 1] === undefined) &&
            (visited[x][y - 1] === 1 || visited[x][y - 1] === undefined) &&
            (visited[x - 1] === undefined || visited[x - 1][y] === 1) &&
            (visited[x + 1] === undefined || visited[x + 1][y] === 1)) {
          closed[x][y] = 1;
        } else if (!nextBranchStartChosen) {
          branchStart = cell;
          nextBranchStartChosen = true;
        }
      }
    });

    if (!nextBranchStartChosen) {
      mazeComplete = true;
    }
  }

  return { maze: graph, start };
}


function createZeroMatrix(n, m) {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    matrix.push([]);
    for (let j = 0; j < m; j++) {
      matrix[i].push(0);
    }
  }

  return matrix
}


function Graph () {
  let nextVerticeId = 1;
  let nextEdgeId = 1;
  let entrypoint;
  const vertices = {};
  const edges = {};

  this.newVertice = function newVertice (data) {
    const v = { id: nextVerticeId++, data, edges: {} };
    if (!entrypoint) {
      entrypoint = v;
    }
    vertices[v.id] = v;
    return v;
  }

  function connectVertices (src, dst, data) {
    if (!src || !dst) {
      return;
    }
    const e = { id: nextEdgeId++, src, dst, data };
    edges[e.id] = e;
    src.edges[e.id] = e;
    dst.edges[e.id] = e;
    return e;
  }

  function removeVertice (v) {
    if (!v || !v.id) {
      return false;
    }

    // delete all edges connected to the vertice.
    Object.keys(v.edges).map(id => edges[id]).forEach(removeEdge);

    delete vertices[v.id];
  }

  function removeEdge (e) {
    if (!e || !e.id) {
      return false;
    }

    // remove ALL record of the edge
    delete e.src.edges[e.id];
    delete e.dst.edges[e.id];
    delete edges[e.id];
  }

  // the golden egg (breadth first)
  // onEdge := (data, src, dst) -> work
  // onVertice := (data) -> work
  // will exit if onVertice returns false. TODO: remove if not needed
  function walk (start, onVertice, onEdge) {
    if (!start || !start.id || !vertices[start.id]) {
      return false;
    }

    let visitedVertices = {};
    let visitedEdges = {};
    let verticeList = [start];
    let nextVertices = [];

    while (verticeList.length) {
      for (let i = 0, v = verticeList[i]; i < verticeList.length; i++, v = verticeList[i]) {
        const exit = onVertice(v);
        if (exit === false) {
          return;
        }
        visitedVertices[v.id] = true;

        const edges = Object.keys(v.edges).map(id => v.edges[id]);
        for (let i = 0; i < edges.length; i++) {
          const e = edges[i];

          if (!visitedEdges[e.id]) {
            onEdge(e, e.src, e.dst);
            visitedEdges[e.id] = true;

            const w = (e.src.id === v.id) ? e.dst : e.src;
            if (!visitedVertices[w.id]) {
              nextVertices.push(w);
            }
          }
        }
      }

      verticeList = nextVertices;
      nextVertices = [];
    }
  }

  function getEntrypoint() {
    return entrypoint;
  }

  this.removeVertice = removeVertice;
  this.connectVertices = connectVertices;
  this.removeEdge = removeEdge;
  this.walk = walk;
  this.getEntrypoint = getEntrypoint;
}


// returns [0, 1, 2, 3] randomly permuted
function randomFourArray() {
  const a = [0, 1, 2, 3];
  const b = [];

  for (let i = 0; i < 4; i++) {
    const x = Math.floor((4 - i) * Math.random());
    b.push(a[x]);
    a.splice(x, 1);
  }

  return b;
}
