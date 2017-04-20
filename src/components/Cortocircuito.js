import React from 'react';
import {AppBar} from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';


import theme from '../css/RedAppBar.css';


import Map from 'esri/map';
import Search from 'esri/dijit/Search';
import {mapConfig} from '../services/config';

import Tooltip from 'rc-tooltip';
import {Button, IconButton} from 'react-toolbox/lib/button';
import {Input} from 'react-toolbox/lib/input';

const AppBarTest = () => (
  <AppBar theme={theme} title='Cortocircuito'></AppBar>
);

class Cortocircuito extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posteDisabled: false,
      elementoPoste: {
        rotulo: 111111
      },
      btnPosteDisabled: false,
      btnSubirDatosDisabled: false
    }
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

  handleChange(e){
    this.setState({elementoPoste: {rotulo: e} })
  }

  onClickPoste(e){

  }

  onClickSubirDatos(e){

  }

  render(){
    return (
      <div className="wrapper_app">
        <AppBarTest />
        <div className="wrapper_body">
          <div className="wrapper_body_left">

            <div className="element_container">
              <div className="element_wrapperTitle">
                <h5 className="element_title">Paso 1/2: Ingrese su dirección y presione el botón buscar para encontrar su dirección en el mapa.</h5>
                <Tooltip className="element_tooltip" placement="right" trigger={['hover']} overlay={<span>Debe hacer zoom utilizando la rueda del mouse o los botones + / - del mapa hasta que pueda ver los recuadros de color gris  y rojo.<br/></span>}><IconButton icon='live_help'/></Tooltip>
              </div>
              <div className="element_search" id="search"></div>
            </div>

            <div className="element_container">
              <div className="element_wrapperTitle">
                <h5 className="element_title">Paso 2/2: Active el botón de este formulario y seleccione el poste aéreo o cámara subterránea más cercana a su dirección.</h5>
                <Tooltip className="element_tooltip" placement="right" trigger={['hover']} overlay={<span>Debe hacer zoom utilizando la rueda del mouse o los botones + / - del mapa hasta que pueda ver los recuadros de color gris  y rojo.<br/></span>}><IconButton icon='live_help'/></Tooltip>
              </div>
              <div className="element_wrapperBody">
                <Input disabled={this.state.posteDisabled} onChange={this.handleChange.bind(this)}  type='text' label='* Rótulo de poste'
                  name='cortocircuito_rotuloPoste' value={this.state.elementoPoste.rotulo} maxLength={200} />
                <Button onClick={this.onClickPoste.bind(this)} disabled={this.state.btnPosteDisabled} className="step2 btnSelect" raised icon= "format_size"></Button>
                </div>
            </div>
            <Button onClick={this.onClickSubirDatos.bind(this)} disabled={this.state.btnSubirDatosDisabled} className="step3 btnEnviar" label="Enviar Datos" raised primary icon= "send"></Button>

          </div>
          <div className="wrapper_body_right" id="map">
          </div>
        </div>
      </div>
    );
  }
}

export default Cortocircuito;
