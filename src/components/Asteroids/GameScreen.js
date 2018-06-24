import React, { Component } from 'react'
import _ from 'lodash'

import SpaceShip from './components/SpaceShip'
import Asteroid from './components/Asteroid'
import Bullet from './components/Bullet'

import './GameScreen.css';


// TODO: make the sides of the canvas sensitive to touch, so touch screen / mobile user can turn the game

class GameScreen extends Component {
  componentDidMount() {
    this.props.unpause();
  }

  componentWillUnmount() {
    this.props.pause();
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

  render() {
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

        <text x="2" y="95" fill="#888888" style={{ fontSize: '2.5px' }}>
          p to pause 
        </text>
        <text x="2" y="98" fill="#888888" style={{ fontSize: '2.5px' }}>
          r to restart
        </text>

        { this.props.paused && (
          <text className="paused-display" x="50" y="50" fill="#aaaaaa" style={{ fontSize: '4px' }} textAnchor="middle" >
            Paused
          </text>
        )}

      </svg>
    )
  }
}

export default GameScreen;
