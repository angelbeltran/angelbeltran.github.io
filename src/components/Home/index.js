import React, { Component } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import AspectRatio from 'react-aspect-ratio';
import portrait from './uoregon.jpg';


class HomePage extends Component {
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

            <p>
              If you're thinking there's not much here, you might be right.
              Otherwise, I'm flattered you stopped by.
            </p>
            <p>
              This is my personal site and is under contruction.
              Feel free to wander.
            </p>

          </div>

        </div>
      </div>
    );
  }
}


export default HomePage;
