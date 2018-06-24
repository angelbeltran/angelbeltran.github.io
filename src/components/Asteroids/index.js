import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';


// TODO: consider some rewrite?
export default class Game extends Component {
  render() {
    return (
      <Provider store={store}>
        <App {...this.props} />
      </Provider>
    );
  }
}
