import React, { Component } from 'react';
import logo from './logo.svg';
import Asteroids from 'asteroids'
import Tetris from 'angels-tetris'
import GameOfLife from './game-of-life'
import Graph from './graph'
import Maze3D from './maze'


function SidebarTab ({ onClick, onMouseOver, onMouseLeave, children }) {
  const outerTabStyle = {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  }
  const innerTabStyle = {
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  }
  return (
    <div style={outerTabStyle} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <div className="text-center" style={innerTabStyle}>
        {children}
      </div>
    </div>
  )
}

class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      highlightedTab: -1, // which tab is being highlighted (-1 <=> none; n-1 <=> nth tab highlighted)
    }
  }

  // tabIndex (n): nth tab
  onTabMouseOver = (tabIndex) => {
    if (this.state.highlightedTab !== tabIndex) {
      this.setState({
        highlightedTab: tabIndex,
      })
    }
  }

  // tabIndex (n): nth tab
  onTabMouseLeave = (tabIndex) => {
    if (this.state.highlightedTab === tabIndex) {
      this.setState({
        highlightedTab: -1,
      })
    }
  }

  // tabIndex (n): nth tab
  onTabMouseClick = (tabIndex) => {
    this.props.onTabMouseClick(tabIndex)
  }

  getTabWrapperStyle = (index) => {
    const style = {
      width: '100%',
      flex: '1 0',
    }
    if (this.state.highlightedTab === index) {
      style.backgroundColor = '#bbbbbb'
    }

    return style
  }

  render() {
    const sidebarStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flexStart',
    }
    const portraitWrapperStyle = {
      flex: '0 1',
    }
    const deadSpaceStyle={
      height: '10%',
      flex: '0 2 12pt',
    }

    const tabContent = [
      'Force-Directed Graph',
      'Game of Life',
      'Asteroids',
      'Tetris',
      'Maze',
    ]

    return (
      <div style={sidebarStyle}>
        <div className="text-center">
          <img alt="portrait" src={logo} style={portraitWrapperStyle}/>
        </div>

        <div style={deadSpaceStyle}>
          {/* dead space */}
        </div>

        {
          tabContent.map((content, index) => (
            <div key={content} style={this.getTabWrapperStyle(index)}>
              <SidebarTab
                onClick={() => this.onTabMouseClick(index)}
                onMouseOver={() => this.onTabMouseOver(index)}
                onMouseLeave={() => this.onTabMouseLeave(index)}
              >
                <div style={{ padding: 6 }}>
                  {content}
                </div>
              </SidebarTab>
            </div>
          ))
        }
      </div>
    )
  }
}


class GameOfLifeWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paused: false,
      protected: false,
      savedGrid: null,
      rows: 20,
      columns: 20,
    }
  }

  pause = () => {
    this.setState({ paused: !this.state.paused })
  }

  protect = () => {
    this.setState({ protected: !this.state.protected })
  }

  saveGrid = (grid) => {
    this.setState({ savedGrid: grid })
  }

  updateRows = (n) => {
    if (n < 0) {
      this.setState({ rows: 0 })
    } else {
      this.setState({ rows: n })
    }
  }

  updateColumns = (n) => {
    if (n < 0) {
      this.setState({ columns: 0 })
    } else {
      this.setState({ columns: n })
    }
  }

  getClearPromise = () => {
    let _resolve

    const createClearPromise = () => {
      return new Promise((resolve) => {
        _resolve = resolve
        if (this.state.clear !== clear) {
          this.setState({ clear })
        }
      })
    }

    function clear () {
      const resolve = _resolve
      resolve(createClearPromise)
    }

    return createClearPromise()
  }

  getResetPromise = () => {
    let _resolve

    const createResetPromise = () => {
      return new Promise((resolve) => {
        _resolve = resolve
        if (this.state.reset !== reset) {
          this.setState({ reset })
        }
      })
    }

    function reset () {
      const resolve = _resolve
      resolve(createResetPromise)
    }

    return createResetPromise()
  }

  render() {
    return (
      <div style={{
        width: '100%',
        height: '80%',
        //position: 'absolute',
        //top: '10%',
        //left: '10%',
        //backgroundColor: '#cceedd',
      }}>
        <GameOfLife
          width="100%"
          height="100%"
          rows={this.state.rows}
          columns={this.state.columns}
          startingGrid={this.state.savedGrid}
          paused={this.state.paused}
          protected={this.state.protected}
          saveGrid={this.saveGrid}
          clear={this.getClearPromise}
          reset={this.getResetPromise}
        />

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div>
            <button onClick={this.pause}>
              {this.state.paused ? 'unpause' : 'pause'}
            </button>
            <button onClick={this.protect}>
              {this.state.protected ? 'unprotect' : 'protect'}
            </button>
            <button onClick={this.state.clear}>clear</button>
            <button onClick={this.state.reset}>reset</button>
          </div>

          <div>
            rows: <input
              type="number"
              value={this.state.rows}
              onChange={(e) => this.updateRows(e.target.value)}
            />
            <button
              onClick={() => this.updateRows(this.state.rows - 1)}
            >
              -
            </button>
            <button
              onClick={() => this.updateRows(this.state.rows + 1)}
            >
              +
            </button>
          </div>

          <div>
            columns: <input
              type="number"
              value={this.state.columns}
              onChange={(e) => this.updateColumns(e.target.value)}
            />
            <button
              onClick={() => this.updateColumns(this.state.columns - 1)}
            >
              -
            </button>
            <button
              onClick={() => this.updateColumns(this.state.columns + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    )
  }
}


function Body ({ page }) {
  let content = ''

  if (page === 0) {
    content = <GraphWrapper />
  } else if (page === 1) {
    content = <GameOfLifeWrapper />
  } else if (page === 2) {
    content = <Asteroids />
  } else if (page === 3) {
    content = <Tetris />
  } else if (page === 4) {
    content = <Maze3D />
  }

  return (
    <div style={{ height: '100%' }}>
      {content}
    </div>
  )
}

class GraphWrapper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nodes: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
        4: { id: 4 },
        5: { id: 5 },
        6: { id: 6 },
        7: { id: 7 },
        8: { id: 8 },
        9: { id: 9 },
        10: { id: 10 },
        11: { id: 11 },
        12: { id: 12 },
        13: { id: 13 },
        14: { id: 14 },
        15: { id: 15 },
        16: { id: 16 },
        17: { id: 17 },
        18: { id: 18 },
        19: { id: 19 },
        20: { id: 20 },
      },
      edges: [
        { src: 1, dst: 2 },
        { src: 1, dst: 3 },
        { src: 1, dst: 4 },
        { src: 2, dst: 4 },
        { src: 5, dst: 6 },
        { src: 5, dst: 7 },
        { src: 5, dst: 8 },
        { src: 6, dst: 8 },
        { src: 9, dst: 10 },
        { src: 9, dst: 11 },
        { src: 9, dst: 12 },
        { src: 10, dst: 12 },
        { src: 13, dst: 14 },
        { src: 13, dst: 15 },
        { src: 13, dst: 16 },
        { src: 14, dst: 16 },
        { src: 17, dst: 18 },
        { src: 17, dst: 19 },
        { src: 17, dst: 20 },
        { src: 18, dst: 20 },
      ],
    }
  }

  render() {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          width: '80%',
          height: '80%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Graph
            nodes={this.state.nodes}
            edges={this.state.edges}
            zoom={200}
            interval={50}
          />
        </div>
      </div>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      //page: -1,            // which page is being shown (-1 <=> no pages selected); n-1 <=> nth page selected)
      page: 0,            // which page is being shown (-1 <=> no pages selected); n-1 <=> nth page selected)
    }
  }

  onTabMouseClick = (tabIndex) => {
    this.setState({
      page: tabIndex,
    })
  }

  render() {
    const appStyle = {
      height: '100vh',
      width:'100wh',
    }
    const sidebarWrapperStyle = {
      height: '100%',
      backgroundColor: '#888888',
    }
    const bodyWrapperStyle = {
      height: '100%',
      backgroundColor: 'rgb(200, 200, 200)',
    }

    return (
      <div style={appStyle}>
        <div className="row no-gutters" style={{ height: '100%' }}>
          <div className="col-2 col-2-sm" style={sidebarWrapperStyle}>
            <Sidebar onTabMouseClick={this.onTabMouseClick}/>
          </div>
          <div className="col-10 col-10-sm" style={bodyWrapperStyle}>
            <Body page={this.state.page}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
