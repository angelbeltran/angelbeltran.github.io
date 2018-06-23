import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';


// TODO: consider some rewrite?
export default function Game(props) {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
}

