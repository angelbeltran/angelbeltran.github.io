import React, { Component } from 'react';
import logo from './logo.svg';
import Asteroids from 'asteroids'
import Tetris from 'angels-tetris'
import GameOfLife from 'angels-game-of-life'


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
      'Game of Life',
      'Asteroids',
      'Tetris',
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
    content = <GameOfLifeWrapper />
  } else if (page === 1) {
    content = <Asteroids />
  } else if (page === 2) {
    content = <Tetris />
  }

  return (
    <div style={{ height: '100%' }}>
      {content}
    </div>
  )
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
