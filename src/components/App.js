import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './Home';
import AboutPage from './About';
import ContactPage from './Contact';
import Asteroids from './Asteroids';
import GameOfLife from './GameOfLife';
import Graph from './Graph';
import Maze3D from './Maze';
import Tetris from './Tetris';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.setHomeState = this.setHomeState.bind(this);
    this.setAboutState = this.setAboutState.bind(this);
    this.setContactState = this.setContactState.bind(this);
    this.setNavRef = this.setNavRef.bind(this);

    this.state = {
      home: {},
      about: {},
      contact: {},
    };
  }

  setHomeState(update) {
    if (update && typeof update === 'object') {
      this.setState({
        home: update,
      });
    }
  }

  setAboutState(update) {
    if (update && typeof update === 'object') {
      this.setState({
        about: update,
      });
    }
  }

  setContactState(update) {
    if (update && typeof update === 'object') {
      this.setState({
        contact: update,
      });
    }
  }

  setNavRef(element) {
    if (element && this.state.navHeight !== element.clientHeight) {
      this.setState({
        navHeight: element.clientHeight,
      });
    }
  }

  render() {
    const navHeight = this.state.navHeight || 0;
    const bodyStyle = {};

    if (this.props.location && this.props.location.pathname.indexOf('/fun-stuff') === 0) {
      bodyStyle.maxHeight = `calc(100vh - ${navHeight + 3}px)`;
    }

    return (
      <div className="container-fluid p-0 m-0 bg-light" style={{ minHeight: '100vh' }}>

        <Navbar setNavRef={this.setNavRef}/>

        <div className="container-fluid col-md-10 offset-md-1" style={bodyStyle} >
          <Switch>

            <Route path="/home" render={() => (
              <Switch>
                <Route exact path="/home" component={HomePage} />
                <Redirect to="/home" />
              </Switch>
            )} />

            <Route path="/about" render={() => (
              <Switch>
                <Route exact path="/about" render={() => (
                  <AboutPage {...this.state.about} setGlobalState={this.setAboutState} />
                )} />
                <Redirect to="/about" />
              </Switch>
            )} />

            <Route path="/contact" render={() => (
              <Switch>
                <Route exact path="/contact" render={() => (
                  <ContactPage {...this.state.contact} setGlobalState={this.setContactState} />
                )} />
                <Redirect to="/contact" />
              </Switch>
            )} />

            <Route path="/fun-stuff" render={() => (
              <Switch>

                <Route path="/fun-stuff/asteroids" render={() => (
                  <Switch>
                    <Route exact path="/fun-stuff/asteroids" render={() => (
                      <Asteroids />
                    )}/>
                    <Redirect to="/fun-stuff/asteroids" />
                  </Switch>
                )} />

                <Route path="/fun-stuff/force-directed-graph" render={() => (
                  <Switch>
                    <Route exact path="/fun-stuff/force-directed-graph" component={Graph}/>
                    <Redirect to="/fun-stuff/force-directed-graph" />
                  </Switch>
                )} />

                <Route path="/fun-stuff/game-of-life" render={() => (
                  <Switch>
                    <Route exact path="/fun-stuff/game-of-life" component={GameOfLife}/>
                    <Redirect to="/fun-stuff/game-of-life" />
                  </Switch>
                )} />

                <Route path="/fun-stuff/maze" render={() => (
                  <Switch>
                    <Route exact path="/fun-stuff/maze" component={Maze3D}/>
                    <Redirect to="/fun-stuff/maze" />
                  </Switch>
                )} />

                <Route path="/fun-stuff/tetris" render={() => (
                  <Switch>
                    <Route exact path="/fun-stuff/tetris" component={Tetris}/>
                    <Redirect to="/fun-stuff/tetris" />
                  </Switch>
                )} />

                <Redirect to="/" />

              </Switch>
            )} />

            <Redirect from="/" to="/home" />

          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
