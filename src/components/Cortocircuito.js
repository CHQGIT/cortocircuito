import React from 'react';
//toolbox
import Tooltip from 'rc-tooltip';
import {Button, IconButton} from 'react-toolbox/lib/button';
import {Input} from 'react-toolbox/lib/input';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import {Snackbar} from 'react-toolbox/lib/Snackbar';
import {AppBar} from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';

//own custom css
import theme from '../css/RedAppBar.scss';

//esri arcgis js api
import Map from 'esri/map';
import Search from 'esri/dijit/Search';
import BasemapToggle from "esri/dijit/BasemapToggle";

//own
import {mapConfig} from '../services/config';
import layers from '../services/layers-service';
import {factigisLoginVentaWeb} from '../services/parameters';
import $ from 'jquery';


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
      btnSubirDatosDisabled: false,
      activeSnackbar: false,
      snackbarIcon: '',
      snackbarMessage: ''
    }
  }

  componentDidMount(){
    /*let u ='vialactea\\usrgis';
    let p ="N3L4y5HZ";
    */
    factigisLoginVentaWeb('vialactea\\ehernanr',"Chilquinta9",(cb)=>{
      //show everything.
      if(cb[0]){
        var map = new Map("map",{
          basemap: mapConfig.basemap,
          center: mapConfig.center,
          zoom: mapConfig.zoom
        });


        // add layer for pipes
        var layerRotulos = new esri.layers.ArcGISDynamicMapServiceLayer(layers.read_rotulos(),{id:"factigis_rotulos"});
        layerRotulos.setImageFormat("png32");
        layerRotulos.setVisibleLayers([0]);
        var layerDefs = [];
        layerDefs[0] = "tipo_nodo ='ele!poste' or tipo_nodo='ele!camara'";
        layerRotulos.setLayerDefinitions(layerDefs);
        map.addLayer(layerRotulos,2);

        var toggle = new BasemapToggle({
          map: map,
          basemap: "hybrid"
        }, "BasemapToggle");
        toggle.startup();

        var search = new Search({
          map: map,
        }, "search");
        search.startup();

        search.on('select-result',(e)=>{
          console.log("seleccionado resultado",e);
          $(".paso2").css("visibility","visible")
        });

        search.on("clear-search",(e)=>{
            $(".paso2").css("visibility","hidden")
        });

      }else{
          this.setState({snackbarMessage: "Hubo un problema al inicializar la aplicación. Contáctese con el administrador/desarrollador del sistema.", activeSnackbar: true, snackbarIcon: 'error' });
      }

    });


  }

  handleChange(e){
    this.setState({elementoPoste: {rotulo: e} })
  }

  onClickPoste(e){

  }

  onClickSubirDatos(e){

  }

  handleSnackbarClick = () => {
    this.setState({activeSnackbar: false});
  };


  render(){
    return (
      <div className="wrapper_app">
        <AppBarTest />
        <div className="wrapper_body">
          <div className="wrapper_body_left">

            {/* step 1 */}
            <div className="element_container paso1">
              <div className="element_wrapperTitle">
                <h5 className="element_title">Paso 1/2: Ingrese su dirección y presione el botón buscar para encontrar su dirección en el mapa.</h5>
                <Tooltip className="element_tooltip" placement="right" trigger={['hover']} overlay={<span>Debe hacer zoom utilizando la rueda del mouse o los botones + / - del mapa hasta que pueda ver los recuadros de color gris  y rojo.<br/></span>}><IconButton icon='live_help'/></Tooltip>
              </div>
              <div className="element_search" id="search"></div>
            </div>

            {/* step 2 */}
            <div className="element_container paso2">
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

            {/* map */}
          </div>
          <div className="wrapper_body_right" id="map">
            <div id="BasemapToggle"></div>
          </div>
        </div>
        <Snackbar action='Aceptar' active={this.state.activeSnackbar} icon={this.state.snackbarIcon} label={this.state.snackbarMessage} onClick={this.handleSnackbarClick.bind(this)} type='cancel' />

      </div>
    );
  }
}

export default Cortocircuito;
