import React, { Component } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import AspectRatio from 'react-aspect-ratio';
import portrait from './uoregon.jpg';


class AboutPage extends Component {
  componentDidMount() {
    if (!this.props.facts) {
      // fetch random facts for the first time
      fetch('http://angelbeltran.com/api/about/random-fact/?quantity=3')
        .then(res => res.json())
        .then(facts => {
          this.props.setGlobalState({
            facts: facts,
          });
        });
    }
  }

  render() {
    return (
      <div className="container pt-4 no-gutters">
        <div className="row d-flex">

          <div className="col-sm-5 col-md-4 d-flex justify-content-center">
            <AspectRatio ratio="200/300" style={{ maxWidth: '200px', minWidth: '100px', maxHeight: '300px', flexGrow: 1 }}>
              <img src={portrait} alt="portrait" />
            </AspectRatio>
          </div>

          <div className="col-sm-7 col-md-8 d-flex flex-column align-items-center justify-content-center text-center">
            <strong>Random Facts</strong>
            <hr />

            { this.props.facts && this.props.facts.map(fact => (
                <p key={fact}>{fact}</p>
              ))
            }

          </div>

        </div>
      </div>
    );
  }
}


export default AboutPage;
