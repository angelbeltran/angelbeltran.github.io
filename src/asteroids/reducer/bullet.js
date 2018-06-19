import _ from 'lodash'
import initialState from './initial-state'
import * as constants from '../constants'
//import { updateDuplicateBullets } from '../duplicate'

import { SHIP_WIDTH, SHIP_HEIGHT } from '../constants'


export default function (state = initialState, action) {
  switch (action.type) {

    case constants.DECREMENT_BULLET_TIMES_TO_LIVE: {
      const { bullets, duplicateBullets } = state
      // number of ticks passed is relative to the real vs ideal frame rate
      const ticksPassed = constants.IDEAL_FRAME_RATE / state.frameRate
      const updatedBullets = {}
      _.each(bullets, (bullet) => {
        updatedBullets[bullet.key] = {
          ...bullet,
          ttl: bullet.ttl - ticksPassed,
        };
      })

      const updatedDuplicateBullets = {}
      _.each(duplicateBullets, (bullets, key) => {
        updatedDuplicateBullets[key] = {}
        _.each(bullets, (bullet) => {
          updatedDuplicateBullets[key][bullet.key] = {
            ...bullet,
            ttl: bullet.ttl - ticksPassed,
          }
        })
      })

      return {
        ...state,
        bullets: updatedBullets,
        duplicateBullets: updatedDuplicateBullets,
      }
    }

    case constants.REMOVE_DEAD_BULLETS: {
      const { bullets, duplicateBullets } = state
      const updatedBullets = {}

      _.each(bullets, (bullet) => {
        if (bullet.ttl > 0) {
          updatedBullets[bullet.key] = bullet
        }
      })

      const updatedDuplicateBullets = {}
      _.each(duplicateBullets, (bullets, key) => {
        updatedDuplicateBullets[key] = {}
        _.each(bullets, (bullet) => {
          if (bullet.ttl > 0) {
            updatedDuplicateBullets[key][bullet.key] = bullet
          }
        })
      })

      return {
        ...state,
        bullets: updatedBullets,
        duplicateBullets: updatedDuplicateBullets,
      }
    }

    case constants.UPDATE_BULLET_POSITIONS: {
      // TODO: make this funciton general
      const updatedBullets = _.mapValues(state.bullets, (bullet) => {
        let dx = bullet.movement.x
        let dy = -bullet.movement.y

        // modify dx,dy for current frame rate
        dx *= constants.IDEAL_FRAME_RATE / state.frameRate
        dy *= constants.IDEAL_FRAME_RATE / state.frameRate
        
        const position = {
          x: bullet.position.x + dx,
          y: bullet.position.y + dy,
        }

        // swap asteroids that have are drifting off the map to the other side
        if (position.x > 100) {
          position.x -= 100
        } else if (position.x < 0) {
          position.x += 100
        }

        if (position.y > 100) {
          position.y -= 100
        } else if (position.y < 0) {
          position.y += 100
        }

        // update bullet's position
        return {
          ...bullet,
          position,
        }
      })

      return {
        ...state,
        bullets: updatedBullets,
      }

      /*
      const { bullets, duplicateBullets } = state
      const updatedBullets = {}
      const updatedDuplicateBullets = {}

      _.each(bullets.friendly, (bullet) => {
        // update bullets's position
        let updatedBullet = {
          ...bullet,
          position: {
            x: bullet.position.x + bullet.movement.x,
            y: bullet.position.y - bullet.movement.y,
          },
        };

        // create/update duplicate bullets or replace the bullet with a duplicate, if needed
        let updatedDuplicateBullets2
        ({ bullet: updatedBullet, duplicateBullets: updatedDuplicateBullets2 } = updateDuplicateBullets(updatedBullet, duplicateBullets))

        updatedBullets[bullet.key] = updatedBullet
        updatedDuplicateBullets[bullet.key] = updatedDuplicateBullets2
      })

      return {
        ...state,
        bullets: {
          ...bullets,
          friendly: updatedBullets,
        },
        duplicateBullets: updatedDuplicateBullets,
      }
      */
    }

    case constants.FIRE_BULLET_FROM_SHIP: {
      const ship = state.ships[action.key]
      const { bullets, nextBulletId } = state

      const distanceFromCenterToFrontOfShip = SHIP_HEIGHT - (SHIP_WIDTH / 2)
      const distanceFromCenterOfShipToBullet = distanceFromCenterToFrontOfShip + 2
      const { x: shipX, y: shipY } = ship.position
      const angle = (Math.PI * ship.rotation) / 180
      const bulletX = shipX + (distanceFromCenterOfShipToBullet * Math.cos(angle))
      const bulletY = shipY + (distanceFromCenterOfShipToBullet * Math.sin(angle))

      return {
        ...state,
        bullets: {
          ...bullets,
          [nextBulletId]: {
            key: nextBulletId,
            ttl: 70, // TODO: set this constant somewhere
            position: {
              x: bulletX,
              y: bulletY,
            },
            movement: {
              x: Math.cos(angle),
              y: -Math.sin(angle),
            },
            rotation: ship.rotation,
            points: [{
              x: -0.75,
              y: 0,
            }, {
              x: 0.75,
              y: 0,
            }],
            scale: 1,
          },
        },
        nextBulletId: nextBulletId + 1,
      }
    }

    case constants.REMOVE_BULLET: {
      const nextBullets = { ...state.bullets }

      delete nextBullets[action.key]

      return {
        ...state,
        bullets: nextBullets,
      }
    }
    
    default:
      return state

  }
}
