import React, { Component } from 'react';
import logo from './logo.svg';
//import './App.css';


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
    console.log('TEST')
    if (this.state.highlightedTab === tabIndex) {
      this.setState({
        highlightedTab: -1,
      })
    }
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

    return (
      <div style={sidebarStyle}>
        <div className="text-center">
          <img alt="portrait" src={logo} style={portraitWrapperStyle}/>
          (Insert photo)
          Angel Beltran
        </div>

        <div style={deadSpaceStyle}>
          {/* dead space */}
        </div>

        <div style={this.getTabWrapperStyle(0)}>
          <SidebarTab
            onClick={() => console.log('YOLO')}
            onMouseOver={() => this.onTabMouseOver(0)}
            onMouseLeave={() => this.onTabMouseLeave(0)}
          >
            <div style={{ padding: 6 }}>
              Asteroids
            </div>
          </SidebarTab>
        </div>
        <div style={this.getTabWrapperStyle(1)}>
          <SidebarTab
            onClick={() => console.log('YOLO')}
            onMouseOver={() => this.onTabMouseOver(1)}
            onMouseLeave={() => this.onTabMouseLeave(1)}
          >
            <div style={{ padding: 6 }}>
              Tetris
            </div>
          </SidebarTab>
        </div>
        <div style={this.getTabWrapperStyle(2)}>
          <SidebarTab
            onClick={() => console.log('YOLO')}
            onMouseOver={() => this.onTabMouseOver(2)}
            onMouseLeave={() => this.onTabMouseLeave(2)}
          >
            <div style={{ padding: 6 }}>
              Tab 3
            </div>
          </SidebarTab>
        </div>
      </div>
    )
  }
}

function Body () {
  return (
    <div>
      body
    </div>
  )
}


class App extends Component {
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
      backgroundColor: '#bbbbbb',
    }

    return (
      <div style={appStyle}>
        <div className="row no-gutters" style={{ height: '100%' }}>
          <div className="col-1 col-2-xs" style={sidebarWrapperStyle}>
            <Sidebar />
          </div>
          <div className="col-11 col-10-xs" style={bodyWrapperStyle}>
            <Body />
          </div>
        </div>
      </div>
    );
  }
}

/*
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}
*/

export default App;
