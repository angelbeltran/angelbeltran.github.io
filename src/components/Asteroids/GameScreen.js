import React, { Component } from 'react'
import _ from 'lodash'

import SpaceShip from './components/SpaceShip'
import Asteroid from './components/Asteroid'
import Bullet from './components/Bullet'

import './GameScreen.css';


// TODO: make the sides of the canvas sensitive to touch, so touch screen / mobile user can turn the game

class GameScreen extends Component {
  constructor(props) {
    super(props);
    this.setFocusHandler = this.setFocusHandler.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);

    this.state = {};
  }

  componentDidMount() {
    this.props.gameDidMount(1); // TODO: manage game ids?
    this.rect.focus();
  }

  componentWillUnmount() {
    this.props.gameWillUnmount(); // TODO: eliminate the previous call
    this.rect = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gameFocused && !this.props.gameFocused) {
      // recieve focus implicitly, e.g. by pressing the 'p' button to pause/unpause the game
      if (document.activeElement === this.rect) {
      } else {
        this.rect.focus();
      }
    }
  }
  
  getRenderedObjectList = (entities) => {
    return _.reduce(entities, (list, entity) => {
      list.push(entity)

      let { position: { x, y } } = entity

      // duplicate to display on other horizontal end
      let hDuplicate
      if (x + entity.scale >= 100) { // TODO: save screen size to constants file?
        hDuplicate = { x: x - 100, y }
      } else if (x - entity.scale <= 0) {
        hDuplicate = { x: x + 100, y }
      }

      // duplicate to display on other vertical end
      let vDuplicate
      if (y + entity.scale >= 100) { // TODO: save screen size to constants file?
        vDuplicate = { x, y: y - 100 }
      } else if (y - entity.scale <= 0) {
        vDuplicate = { x, y: y + 100 }
      }

      // duplicate to display at opposite corner
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

  setFocusHandler(ref) {
    if (ref && this.rect !== ref) {
      this.rect = ref;
      ref.onfocus = this.handleFocus;
      ref.onblur = this.handleBlur;
    }
  }

  handleFocus() {
    this.props.gameReceivedFocus();
  }

  handleBlur() {
    this.props.gameLostFocus();
  }

  handleClick() {
    if (this.props.paused) {
      this.props.unpause();
    } else {
      this.props.pause();
    }
  }

  handleTouchStart(e) {
    e.preventDefault();

    if (this.props.paused) {
      this.props.unpause();
    }

    for (let i = 0; i < e.changedTouches.length; i += 1) {
      const touch = e.changedTouches[i];
      const pos = this.getTouchGameCoordinates(e, touch);

      if (pos.x <= 45) {
        this.props.moveTouchStarted(touch.identifier, pos);
      } else if (pos.x >= 55) {
        this.props.fireTouchStarted(touch.identifier);
      }
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i += 1) {
      const touch = e.changedTouches[i];
      const pos = this.getTouchGameCoordinates(e, touch);

      if (pos.x <= 45) {
        this.props.moveTouchEnded(touch.identifier, pos);
      } else if (pos.x >= 55) {
        this.props.fireTouchEnded(touch.identifier);
      }
    }
  }

  handleTouchMove(e) {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i += 1) {
      const touch = e.changedTouches[i];
      const pos = this.getTouchGameCoordinates(e, touch);

      if (pos.x <= 45) {
        this.props.moveTouchMoved(touch.identifier, pos);
      }
    }
  }

  getTouchGameCoordinates(e, touch) {
    const rect = e.target.getBoundingClientRect();
    const x = 100 * (touch.pageX - rect.x) / rect.width;
    const y = 100 * (touch.pageY - rect.y) / rect.height;

    return { x, y };
  }


  render() {
    const mobileLogging = false;
    //checkForCollisions(this.state.ship, this.state.asteroids)
    // duplicate ships, asteroids, and bullets that are near the edges
    const ships = this.getRenderedObjectList(this.props.ships);
    const asteroids = this.getRenderedObjectList(this.props.asteroids);
    const bullets = this.getRenderedObjectList(this.props.bullets);

    return (
      <svg
        version="1.1"
        baseProfile="full"
        width="100%" height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >

        {/* Background */}
        <rect
          width="100"
          height="100"
          fill="black"
          ref={this.setFocusHandler}
          tabIndex="-1"
          onClick={this.handleClick}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onTouchMove={this.handleTouchMove}
        />

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

        {mobileLogging && (this.props.logs || []).map((log, i) => (
          <text key={log + i} x="2" y={`${3 + (3*i)}`} fill="#888888" style={{ fontSize: '2.5px' }}>
            {log}
          </text>
        ))}

        <text x="2" y="95" fill="#888888" style={{ fontSize: '2.5px' }}>
          p to pause 
        </text>
        <text x="2" y="98" fill="#888888" style={{ fontSize: '2.5px' }}>
          r to restart
        </text>

        { this.props.paused && (
          <text 
            className="paused-display" x="50" y="50" fill="#aaaaaa" style={{ fontSize: '4px' }} textAnchor="middle" >
            Paused
          </text>
        )}


      </svg>
    )
  }
}

export default GameScreen;
