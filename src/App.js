import React, { Component } from 'react';
import logo from './logo.svg';
//import './App.css';
import Asteroids from 'asteroids'
import Tetris from 'angels-tetris'


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
      'Asteroids',
      'Tetris',
      'Tab 3',
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


function Body ({ page }) {
  let content = ''
  if (page === 0) {
    content = <Asteroids />
  } else if (page === 1) {
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
      page: -1,            // which page is being shown (-1 <=> no pages selected); n-1 <=> nth page selected)
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
          <div className="col-1 col-2-xs" style={sidebarWrapperStyle}>
            <Sidebar onTabMouseClick={this.onTabMouseClick}/>
          </div>
          <div className="col-11 col-10-xs" style={bodyWrapperStyle}>
            <Body page={this.state.page}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
