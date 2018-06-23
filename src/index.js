import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// wrap App in Route component to get the match, location, and history props.
ReactDOM.render(
  <Router>
    <Route path="/" render={props => (
      <App {...props} />
    )} />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
