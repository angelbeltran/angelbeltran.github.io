import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import logo from './logo.svg';


class Navbar extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const collapsed = this.state.collapsed;

    return (
      <nav className="navbar navbar-expand-sm navbar-light" ref={this.props.setNavRef} style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,0.125)' }} >
        <div className="container-fluid col-md-10 offset-md-1">
          <Link to="/home" className="navbar-brand mr-auto">
            <img alt="portrait" className="d-block" width="48" height="48" src={logo}/>
          </Link>

          <button onClick={this.toggleNavbar} className={`navbar-toggler ${collapsed ? 'collapsed' : ''}`} type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`} id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <CustomNavListItemLink to="/home">Home</CustomNavListItemLink>
              <CustomNavListItemLink to="/about">About</CustomNavListItemLink>
              <CustomNavListItemLink to="/contact">Contact</CustomNavListItemLink>

              <CustomNavListItemDropdown to="/fun-stuff" label="Fun Stuff">
                <Link to="/fun-stuff/asteroids" className="dropdown-item">Asteroids</Link>
                <Link to="/fun-stuff/force-directed-graph" className="dropdown-item">Force-Directed Graph</Link>
                <Link to="/fun-stuff/game-of-life" className="dropdown-item">Game of Life</Link>
                <Link to="/fun-stuff/maze" className="dropdown-item">Maze</Link>
                <Link to="/fun-stuff/tetris" className="dropdown-item">Tetris</Link>
              </CustomNavListItemDropdown>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
// search form example
/*

          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
 */


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

class CustomNavListItemDropdown extends Component { 
  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleClickOutsideOfDropdown = this.handleClickOutsideOfDropdown.bind(this);

    this.state = {
      expanded: false,
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutsideOfDropdown);
  }

  componentWillMount() {
    window.removeEventListener('click', this.handleClickOutsideOfDropdown);
  }

  handleClickOutsideOfDropdown() {
    if (this.state.expanded) {
      this.setState({
        expanded: false,
      });
    }
  }

  toggleDropdown(e) {
    e.stopPropagation(); // so the dropdown isn't immediately close upon opening.

    this.setState({
      expanded: !this.state.expanded,
    })
  }

  render() {
    const expanded = this.state.expanded;

    return (
      <Route
        path={this.props.to}
        children={({ match }) => (
          <li className={`nav-item dropdown ${ match ? 'active' : '' }`}>
            <a onClick={this.toggleDropdown} className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ cursor: 'pointer' }}>
              {this.props.label}
            </a>
            <div onClick={this.toggleDropdown} className={`dropdown-menu ${expanded ? 'show' : '' }`} aria-labelledby="navbarDropdown">
              {this.props.children}
            </div>
          </li>
        )}
      />

    );
  }
}


export default Navbar;
