import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import Asteroids from './Asteroids';
import GameOfLife from './GameOfLife';
import Graph from './Graph';
import Maze3D from './Maze';
import Tetris from './Tetris';


class App extends Component {
  render() {
    return (
      <div className="container-fluid p-0 m-0">

        <Navbar />

        <div className="row no-gutters">
          <div className="col">
            <Switch>

              <Route path="/home" render={() => (
                <Switch>
                  <Route exact path="/home" render={() => (
                    <div>
                    </div>
                  )} />
                  <Redirect to="/home" />
                </Switch>
              )} />

              <Route path="/about" render={() => (
                <Switch>
                  <Route exact path="/about" render={() => (
                    <div>
                    </div>
                  )} />
                  <Redirect to="/about" />
                </Switch>
              )} />

              <Route path="/contact" render={() => (
                <Switch>
                  <Route exact path="/contact" render={() => (
                    <div>
                    </div>
                  )} />
                  <Redirect to="/contact" />
                </Switch>
              )} />

              <Route path="/fun-stuff" render={() => (
                <Switch>

                  <Route path="/fun-stuff/asteroids" render={() => (
                    <Switch>
                      <Route exact path="/fun-stuff/asteroids" component={Asteroids}/>
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
      </div>
    );
  }
}

export default App;
