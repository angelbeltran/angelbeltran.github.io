import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import Asteroids from './asteroids';
import GameOfLife from './game-of-life';
import Graph from './graph';
import Maze3D from './maze';
import Tetris from './tetris';


class GameOfLifeWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paused: false,
      protected: false,
      savedGrid: null,
      rows: 20,
      columns: 20,
    }
  }

  pause = () => {
    this.setState({ paused: !this.state.paused })
  }

  protect = () => {
    this.setState({ protected: !this.state.protected })
  }

  saveGrid = (grid) => {
    this.setState({ savedGrid: grid })
  }

  updateRows = (n) => {
    if (n < 0) {
      this.setState({ rows: 0 })
    } else {
      this.setState({ rows: n })
    }
  }

  updateColumns = (n) => {
    if (n < 0) {
      this.setState({ columns: 0 })
    } else {
      this.setState({ columns: n })
    }
  }

  getClearPromise = () => {
    let _resolve

    const createClearPromise = () => {
      return new Promise((resolve) => {
        _resolve = resolve
        if (this.state.clear !== clear) {
          this.setState({ clear })
        }
      })
    }

    function clear () {
      const resolve = _resolve
      resolve(createClearPromise)
    }

    return createClearPromise()
  }

  getResetPromise = () => {
    let _resolve

    const createResetPromise = () => {
      return new Promise((resolve) => {
        _resolve = resolve
        if (this.state.reset !== reset) {
          this.setState({ reset })
        }
      })
    }

    function reset () {
      const resolve = _resolve
      resolve(createResetPromise)
    }

    return createResetPromise()
  }

  render() {
    return (
      <div style={{
        width: '100%',
        height: '80%',
        //position: 'absolute',
        //top: '10%',
        //left: '10%',
        //backgroundColor: '#cceedd',
      }}>
        <GameOfLife
          width="100%"
          height="100%"
          rows={this.state.rows}
          columns={this.state.columns}
          startingGrid={this.state.savedGrid}
          paused={this.state.paused}
          protected={this.state.protected}
          saveGrid={this.saveGrid}
          clear={this.getClearPromise}
          reset={this.getResetPromise}
        />

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div>
            <button onClick={this.pause}>
              {this.state.paused ? 'unpause' : 'pause'}
            </button>
            <button onClick={this.protect}>
              {this.state.protected ? 'unprotect' : 'protect'}
            </button>
            <button onClick={this.state.clear}>clear</button>
            <button onClick={this.state.reset}>reset</button>
          </div>

          <div>
            rows: <input
              type="number"
              value={this.state.rows}
              onChange={(e) => this.updateRows(e.target.value)}
            />
            <button
              onClick={() => this.updateRows(this.state.rows - 1)}
            >
              -
            </button>
            <button
              onClick={() => this.updateRows(this.state.rows + 1)}
            >
              +
            </button>
          </div>

          <div>
            columns: <input
              type="number"
              value={this.state.columns}
              onChange={(e) => this.updateColumns(e.target.value)}
            />
            <button
              onClick={() => this.updateColumns(this.state.columns - 1)}
            >
              -
            </button>
            <button
              onClick={() => this.updateColumns(this.state.columns + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    )
  }
}


class GraphWrapper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nodes: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
        4: { id: 4 },
        5: { id: 5 },
        6: { id: 6 },
        7: { id: 7 },
        8: { id: 8 },
        9: { id: 9 },
        10: { id: 10 },
        11: { id: 11 },
        12: { id: 12 },
        13: { id: 13 },
        14: { id: 14 },
        15: { id: 15 },
        16: { id: 16 },
        17: { id: 17 },
        18: { id: 18 },
        19: { id: 19 },
        20: { id: 20 },
      },
      edges: [
        { src: 1, dst: 2 },
        { src: 1, dst: 3 },
        { src: 1, dst: 4 },
        { src: 2, dst: 4 },
        { src: 5, dst: 6 },
        { src: 5, dst: 7 },
        { src: 5, dst: 8 },
        { src: 6, dst: 8 },
        { src: 9, dst: 10 },
        { src: 9, dst: 11 },
        { src: 9, dst: 12 },
        { src: 10, dst: 12 },
        { src: 13, dst: 14 },
        { src: 13, dst: 15 },
        { src: 13, dst: 16 },
        { src: 14, dst: 16 },
        { src: 17, dst: 18 },
        { src: 17, dst: 19 },
        { src: 17, dst: 20 },
        { src: 18, dst: 20 },
      ],
    }
  }

  render() {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          width: '80%',
          height: '80%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Graph
            nodes={this.state.nodes}
            edges={this.state.edges}
            zoom={200}
            interval={50}
          />
        </div>
      </div>
    )
  }
}


const CustomNavListItemLink = ({ children, to, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
      <li className={ match ? "nav-item active" : "nav-item"}>
        <Link to={to} className="nav-link">
          {children}
          { match ? <span className="sr-only">(current)</span> : "" }
        </Link>
      </li>
    )}
  />
);


const CustomNavListItemDropdown = ({ children, label }) => (
  <li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {label}
    </a>
    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
      {children}
    </div>
  </li>
);


class App extends Component {
  render() {
    return (
      <div className="container-fluid p-0 m-0">

        <nav className="navbar navbar-expand-md navbar-light bg-light">
          <Link to="/home" className="navbar-brand">
            <img alt="portrait" className="d-block" width="48" height="48" src={logo}/>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <CustomNavListItemLink to="/home">Home</CustomNavListItemLink>
              <CustomNavListItemLink to="/about">About</CustomNavListItemLink>
              <CustomNavListItemLink to="/contact">Contact</CustomNavListItemLink>

              <CustomNavListItemDropdown label="Fun Stuff">
                <Link to="/fun-stuff/asteroids" className="dropdown-item">Asteroids</Link>
                <Link to="/fun-stuff/force-directed-graph" className="dropdown-item">Force-Directed Graph</Link>
                <Link to="/fun-stuff/game-of-life" className="dropdown-item">Game of Life</Link>
                <Link to="/fun-stuff/maze" className="dropdown-item">Maze</Link>
                <Link to="/fun-stuff/tetris" className="dropdown-item">Tetris</Link>
              </CustomNavListItemDropdown>
            </ul>

            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>

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
                      <Route exact path="/fun-stuff/force-directed-graph" component={GraphWrapper}/>
                      <Redirect to="/fun-stuff/force-directed-graph" />
                    </Switch>
                  )} />

                  <Route path="/fun-stuff/game-of-life" render={() => (
                    <Switch>
                      <Route exact path="/fun-stuff/game-of-life" component={GameOfLifeWrapper}/>
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
