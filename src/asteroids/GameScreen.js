import React, { Component } from 'react'
import _ from 'lodash'
import { style, LEFT, RIGHT, FORWARD, BACKWARD } from './constants'

import SpaceShip from './components/SpaceShip'
import Asteroid from './components/Asteroid'
import Bullet from './components/Bullet'


// TODO: find a way to allow for multiplayer / map different direction keys to different ship actions
function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

class GameScreen extends Component {
  constructor(props) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)

    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
  }
  
  handleKeyDown(e) {
    const code = e.keyCode

    _.each(this.props.ships, (ship, key) => {
      switch (code) {
        case 37:
          this.props.startTurningShip(key, LEFT)
          break
        case 39:
          this.props.startTurningShip(key, RIGHT)
          break
        case 38:
          this.props.startAcceleratingShip(key, FORWARD)
          break
        case 40:
          this.props.startAcceleratingShip(key, BACKWARD)
          break
        case 32:
          this.props.startFiringFromShip(key)
          break
        default:
          break
      }
    })
  }

  handleKeyUp(e) {
    const code = e.keyCode

    _.each(this.props.ships, (ship, key) => {
      switch (code) {
        case 37:
          this.props.stopTurningShip(key, LEFT)
          break
        case 39:
          this.props.stopTurningShip(key, RIGHT)
          break
        case 38:
          this.props.stopAcceleratingShip(key, FORWARD)
          break
        case 40:
          this.props.stopAcceleratingShip(key, BACKWARD)
          break
        case 32:
          this.props.stopFiringFromShip(key)
          break
        default:
          break
      }
    })
  }

  handleDirectionButtonMouseDownOrTouchStart = (direction) => {
    _.each(this.props.ships, (ship, key) => {
      switch (direction) {
        case FORWARD:
          this.props.startAcceleratingShip(key, FORWARD)
          break
        case BACKWARD:
          this.props.startAcceleratingShip(key, BACKWARD)
          break
        case LEFT:
          this.props.startTurningShip(key, LEFT)
          break
        case RIGHT:
          this.props.startTurningShip(key, RIGHT)
          break
        default:
          break
      }
    })
  }

  handleDirectionButtonMouseUpOrTouchEnd = (direction) => {
    _.each(this.props.ships, (ship, key) => {
      switch (direction) {
        case FORWARD:
          this.props.stopAcceleratingShip(key, FORWARD)
          break
        case BACKWARD:
          this.props.stopAcceleratingShip(key, BACKWARD)
          break
        case LEFT:
          this.props.stopTurningShip(key, LEFT)
          break
        case RIGHT:
          this.props.stopTurningShip(key, RIGHT)
          break
        default:
          break
      }
    })
  }

  handleFireButtonMouseDownOrTouchStart = () => {
    _.each(this.props.ships, (ship, key) => {
      this.props.startFiringFromShip(key)
    })
  }

  handleFireButtonMouseUpOrTouchEnd = () => {
    _.each(this.props.ships, (ship, key) => {
      this.props.stopFiringFromShip(key)
    })
  }

  getRenderList = (entities) => {
    return _.reduce(entities, (list, entity) => {
      list.push(entity)

      let { position: { x, y } } = entity

      let hDuplicate
      if (x + entity.scale >= 100) { // TODO: save screen size to constants file?
        hDuplicate = { x: x - 100, y }
      } else if (x - entity.scale <= 0) {
        hDuplicate = { x: x + 100, y }
      }

      let vDuplicate
      if (y + entity.scale >= 100) { // TODO: save screen size to constants file?
        vDuplicate = { x, y: y - 100 }
      } else if (y - entity.scale <= 0) {
        vDuplicate = { x, y: y + 100 }
      }

      let dDuplicate
      if (hDuplicate && vDuplicate) {
        dDuplicate = { x: hDuplicate.x, y: vDuplicate.y }
      }

      if (hDuplicate) {
        list.push({
          ...entity,
          key: `${entity.key}-h`,
          position: hDuplicate,
        })
      }
      if (vDuplicate) {
        list.push({
          ...entity,
          key: `${entity.key}-v`,
          position: vDuplicate,
        })
      }
      if (dDuplicate) {
        list.push({
          ...entity,
          key: `${entity.key}-d`,
          position: dDuplicate,
        })
      }

      return list
    }, [])
  }

  // button bar
  getButtonInterface = () => {
    // TODO: revamp
    const buttonProps = {}
    const defaultStyle = { width: `${100 / 7}%` }

    buttonProps.reset = {
      style: defaultStyle,
      onClick: (e) => {
        e.preventDefault()
        this.props.reset()
      },
      onTouchStart: (e) => {
        e.preventDefault()
        this.props.reset()
      },
    }

    buttonProps.up = {
      style: defaultStyle,
      onMouseDown: () => this.handleDirectionButtonMouseDownOrTouchStart(FORWARD),
      onMouseUp: () => this.handleDirectionButtonMouseUpOrTouchEnd(FORWARD),
      onTouchStart: (e) => {
        e.preventDefault()
        this.handleDirectionButtonMouseDownOrTouchStart(FORWARD)
      },
      onTouchEnd: (e) => {
        e.preventDefault()
        this.handleDirectionButtonMouseUpOrTouchEnd(FORWARD)
      },
    }

    buttonProps.left = {
      style: defaultStyle,
      onMouseDown: () => this.handleDirectionButtonMouseDownOrTouchStart(LEFT),
      onMouseUp: () => this.handleDirectionButtonMouseUpOrTouchEnd(LEFT),
      onTouchStart: (e) => {
        e.preventDefault()
        this.handleDirectionButtonMouseDownOrTouchStart(LEFT)
      },
      onTouchEnd: (e) => {
        e.preventDefault()
        this.handleDirectionButtonMouseUpOrTouchEnd(LEFT)
      },
    }

    buttonProps.right = {
      style: defaultStyle,
      onMouseDown: () => this.handleDirectionButtonMouseDownOrTouchStart(RIGHT),
      onMouseUp: () => this.handleDirectionButtonMouseUpOrTouchEnd(RIGHT),
      onTouchStart: (e) => {
        e.preventDefault()
        this.handleDirectionButtonMouseDownOrTouchStart(RIGHT)
      },
      onTouchEnd: (e) => {
        e.preventDefault()
        this.handleDirectionButtonMouseUpOrTouchEnd(RIGHT)
      },
    }

    buttonProps.down = {
      style: defaultStyle,
      onMouseDown: () => this.handleDirectionButtonMouseDownOrTouchStart(BACKWARD),
      onMouseUp: () => this.handleDirectionButtonMouseUpOrTouchEnd(BACKWARD),
      onTouchStart: (e) => {
        e.preventDefault()
        this.handleDirectionButtonMouseDownOrTouchStart(BACKWARD)
      },
      onTouchEnd: (e) => {
        e.preventDefault()
        this.handleDirectionButtonMouseUpOrTouchEnd(BACKWARD)
      },
    }

    buttonProps.fire = {
      style: defaultStyle,
      onMouseDown: this.handleFireButtonMouseDownOrTouchStart,
      onMouseUp: this.handleFireButtonMouseUpOrTouchEnd,
      onTouchStart: (e) => {
        e.preventDefault()
        this.handleFireButtonMouseDownOrTouchStart()
      },
      onTouchEnd: (e) => {
        e.preventDefault()
        this.handleFireButtonMouseUpOrTouchEnd()
      },
    }

    const buttons = {}
    const divStyle = {
      ...defaultStyle,
      backgroundColor: 'rgb(200, 200, 200)',
      border: 'solid 1px black',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }

    buttons.up = (<div {...buttonProps.up} style={divStyle}>
      UP
    </div>);
    buttons.down = (<div {...buttonProps.down} style={divStyle}>
      DOWN
    </div>);
    buttons.left = (<div {...buttonProps.left} style={divStyle}>
      LEFT
    </div>);
    buttons.right = (<div {...buttonProps.right} style={divStyle}>
      RIGHT
    </div>);
    buttons.fireLeft = (<div {...buttonProps.fire} style={divStyle}>
      FIRE
    </div>);
    buttons.fireRight = (<div {...buttonProps.fire} style={divStyle}>
      FIRE
    </div>);
    buttons.reset = (<div {...buttonProps.reset} style={divStyle}>
      RESET
    </div>);

    return (
      <div style={{ height: '20%', width: '50%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '33.3%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {buttons.up}
        </div>
        <div style={{ height: '33.3%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {buttons.reset}
          <div style={defaultStyle}>
          </div>
          {buttons.left}
          <div style={defaultStyle}>
          </div>
          {buttons.right}
          <div style={defaultStyle}>
          </div>
          {buttons.fireRight}
        </div>
        <div style={{ height: '33.3%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {buttons.down}
        </div>
      </div>
    )
  }

  render() {
    //checkForCollisions(this.state.ship, this.state.asteroids)
    // duplicate ships, asteroids, and bullets that are near the edges
    const ships = this.getRenderList(this.props.ships)
    const asteroids = this.getRenderList(this.props.asteroids)
    const bullets = this.getRenderList(this.props.bullets)

    // TODO: make the height the of the container or page the limiting factor in the dimensions of the svg
    return (
      <div
        className="container-fluid m-0 p-0"
      >
        <div className="row no-gutters justify-content-center">
          <div className="col align-self-center">
            <svg
              version="1.1"
              baseProfile="full"
              height="100%"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >

              {/* Background */}
              <rect width="100" height="100" fill="black" />

              {/* Space ship */}
              {_.map(ships, (data) =>
                <SpaceShip {...data} />
              )}

              {/* Asteroids */}
              {_.map(asteroids, (data) =>
                <Asteroid {...data} />
              )}

              {/* Bullets */}
              {_.map(bullets, (bullet) => (
                <Bullet {...bullet} />
              ))}

            </svg>
          </div>
        </div>

        <div className="row no-gutters justify-content-center position-absolute"
          style={{
            bottom: '50px',
          }}
        >
          <div className="col">
            { isMobileDevice() ? this.getButtonInterface() :
                <button
                  className="btn"
                  style={{
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    this.props.reset()
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    this.props.reset()
                  }}
                >
                  RESET
                </button>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default GameScreen

