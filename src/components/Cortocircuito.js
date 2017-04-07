import React from 'react';
import {AppBar} from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';

import theme from '../css/RedAppBar.scss';

import Map from 'esri/map';
import Search from 'esri/dijit/Search';
import {mapConfig} from '../services/config';

import Tooltip from 'rc-tooltip';
import {Button, IconButton} from 'react-toolbox/lib/button';

const AppBarTest = () => (
  <AppBar title='Cortocircuito' theme={theme}></AppBar>
);

class Cortocircuito extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    var map = new Map("map",{
      basemap: mapConfig.basemap,
      center: mapConfig.center,
      zoom: mapConfig.zoom
    });

    var search = new Search({
            map: map
         }, "search");
         search.startup();
  }

  render(){
    return (
      <div className="wrapper_app">
        <AppBarTest />
        <div className="wrapper_body">
          <div className="wrapper_body_left">
            <div className="element_container">
              <div className="element_wrapperTitle">
                <h5 className="element_title">Busque su dirección</h5>
                <Tooltip className="element_tooltip" placement="right" trigger={['hover']} overlay={<span>Debe hacer zoom utilizando la rueda del mouse o los botones + / - del mapa hasta que pueda ver los recuadros de color gris  y rojo.<br/></span>}><IconButton icon='live_help'/></Tooltip>
              </div>
              <div className="element_search" id="search"></div>
            </div>
          </div>
          <div className="wrapper_body_right" id="map">
          </div>
        </div>
      </div>
    );
  }
}

export default Cortocircuito;
