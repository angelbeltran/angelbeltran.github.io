import _ from 'lodash'
import BaseSprite from './BaseSprite'


export default class Asteroid extends BaseSprite {
  constructor(props) {
    super(props)

    const state = {}
    if (props.outline) {
      state.outline = props.outline
    } else {
      state.outline = this.generateOutline(props)
    }

    this.state = state
  }

  componentWillReceiveProps(nextProps) {
    let newOutline

    if (nextProps.outline && nextProps.outline !== this.state.outline) {
      newOutline = nextProps.outline
    } else {
      if (!_.isEqual(nextProps.points, this.props.points)) {
        newOutline = this.generateOutline(nextProps)
      }
    }

    if (newOutline) {
      this.setState({
        outline: newOutline,
      })
    }
  }
}

Asteroid.propTypes = {
  ...BaseSprite.propTypes,
}
