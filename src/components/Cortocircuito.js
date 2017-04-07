import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';

import theme from '../css/RedAppBar.scss';


const AppBarTest = () => (
  <AppBar title='Cortocircuito' theme={theme}></AppBar>
);

class Cortocircuito extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="wrapper_app">
        <AppBarTest />
        <div className="wrapper_body">
          <div className="wrapper_body_left">

          </div>
          <div className="wrapper_body_right" id="map">
          </div>
        </div>
      </div>
    );
  }
}

export default Cortocircuito;
