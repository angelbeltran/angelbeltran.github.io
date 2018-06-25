import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import GameScreen from './GameScreen'
import * as shipActions from './actions/ship'
import * as asteroidActions from './actions/asteroids'
import * as bulletActions from './actions/bullets'
import * as experienceActions from './actions/frame-rate' // TODO: rename file
import * as keyActions from './actions/keys';
import * as focusActions from './actions/focus';
import * as mountActions from './actions/mount';
import * as touchActions from './actions/touch';

function mapStateToGameScreenProps (state) {
  return {
    ...state
  }
}

function mapDispatchToGameScreenProps (dispatch) {
  return bindActionCreators({
    ...shipActions,
    ...asteroidActions,
    ...bulletActions,
    ...experienceActions,
    ...keyActions,
    ...focusActions,
    ...mountActions,
    ...touchActions,
  }, dispatch)
}

const ConnectedGameScreen = connect(
  mapStateToGameScreenProps,
  mapDispatchToGameScreenProps,
)(GameScreen)

class App extends Component {
  render() {
    return (
      <ConnectedGameScreen />
    );
  }
}

export default App;
