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
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import IdentifyTask from "esri/tasks/IdentifyTask";
import IdentifyParameters from "esri/tasks/IdentifyParameters";
import arrayUtils from "dojo/_base/array";
import InfoTemplate from "esri/InfoTemplate";

//own
import {mapConfig, creds} from '../services/config';
import layers from '../services/layers-service';
import {factigisLoginVentaWeb} from '../services/parameters';
import $ from 'jquery';
import {factigis_findRotulo} from '../services/factigis_find-service';
import env from '../services/config';

var map;
var gLayerPoste = new GraphicsLayer();

const AppBarTest = () => (
  <AppBar theme={theme} title='Cortocircuito'></AppBar>
);

class Cortocircuito extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posteDisabled: true,
      elementosPoste: '',
      btnPosteDisabled: false,
      btnSubirDatosDisabled: false,
      activeSnackbar: false,
      snackbarIcon: '',
      snackbarMessage: '',
      btnPoste: '',
      allElements: '',
      soloRotulo: '',
      comuna: ''
    }

  }

  componentDidMount(){

    factigisLoginVentaWeb(creds.u,creds.p,(cb)=>{
      //show everything.
      if(cb[0]){
        map = new Map("map",{
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
          zoomScale: 1000
        }, "search");
        search.startup();
        $(".paso2").css("visibility","visible");

        search.on('select-result',(e)=>{
          $(".paso2").css("visibility","visible")
        });

        search.on("clear-search",(e)=>{
            $(".paso2").css("visibility","visible");
            this.setState({soloRotulo: ""});
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
    $("#btnSeleccionarPoste").addClass("selected");
    $(".progressbar_status").css("visibility","visible");
    gLayerPoste.clear();
    //$(".factigisVE_progressBar").css('display','flex');
    //$(".factigisVE_btnPaso2").css('color','red');
    dojo.disconnect(this.state.btnPoste);

    if(this.state.activeSnackbar){
      this.setState({activeSnackbar: false});
    }

     var map_click_handle = dojo.connect(map, 'onClick', (event)=>{
      this.setState({btnPoste: map_click_handle});

    //   $('.drawer_progressBar2').css('visibility',"visible");
      var identifyTask, identifyParams;
        identifyTask = new IdentifyTask(layers.read_rotulos());
        identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 10;
        identifyParams.returnGeometry = true;
        identifyParams.layerIds = [0, 1];
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.width = map.width;
        identifyParams.height = map.height;
        identifyParams.geometry = event.mapPoint;
        identifyParams.mapExtent = map.extent;

        var that = this;
         //Usar promises para obtener resultados de parametros de identificación sobre los layers 0 y 1
          var deferred = identifyTask.execute(identifyParams, (callback)=>{
            console.log(callback,"tengo esto");
            if(!callback.length){
              console.log("no hay length", callback);
              //$('.drawer_progressBar2').css('visibility',"hidden");
              that.setState({snackbarMessage: "Rótulos de poste o cámara en este punto no han sido encontrados. Haga clic en un poste o cámara para ver su información nuevamente.", activeSnackbar: true, snackbarIcon: 'close' });
            }else{
              //this.onSaveData(callback);
              //console.log(callback);
              let soloPostes = callback.filter(ss=>{return ss.feature.attributes.tipo_nodo=='ele!poste' || ss.feature.attributes.tipo_nodo=='ele!camara'});
              console.log(soloPostes);

              that.setState({soloRotulo: soloPostes[0].feature.attributes.rotulo, comuna:  soloPostes[0].feature.attributes.comuna});
            }
            dojo.disconnect(this.state.btnPoste);
            $("#btnSeleccionarPoste").removeClass("selected");
            $(".progressbar_status").css("visibility","hidden");
          },(errback)=>{
            console.log("ee",errback);
            $("#btnSeleccionarPoste").removeClass("selected");
            $(".progressbar_status").css("visibility","hidden");
          });

          deferred.addCallback((response)=>{

          //filtra solo postes
          let soloPostes = response.filter(ss=>{return ss.feature.attributes.tipo_nodo=='ele!poste' || ss.feature.attributes.tipo_nodo=='ele!camara'});

          //retorna elemento a defered con su respectivo infotemplate
            return arrayUtils.map(soloPostes, function (result) {

              var feature = result.feature;
              var rotulo = result.feature.attributes.rotulo

              var luminariasTemplate = new InfoTemplate("Rotulo: ${rotulo}","Comuna: ${comuna} <br />");
              feature.setInfoTemplate(luminariasTemplate);
              return feature;
            });

        });

        map.infoWindow.setFeatures([deferred]);
        map.infoWindow.show(event.mapPoint);


    });

  }

  onClickSubirDatos(){

    if(!this.state.soloRotulo==""){
      window.location=env.WPHP+'?rotulo='+
            this.state.soloRotulo +
            '&certificadoCC=' + 1 + '&comuna=' + this.state.comuna;

      window.close();
    }else{
      this.setState({snackbarMessage: "Rótulos de poste o cámara en este punto no han sido encontrados. Haga clic en un poste o cámara para ver su información nuevamente.", activeSnackbar: true, snackbarIcon: 'close' });

    }

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
            <ProgressBar type="linear" mode="indeterminate" className="progressbar_status" />
            {/* step 1 */}
            <div className="element_container paso1">
              <div className="element_wrapperTitle">
                <h5 className="element_title">Paso 1/2: Ingrese su dirección y presione el botón buscar para localizarla en el mapa.</h5>
                <Tooltip className="element_tooltip" placement="right" trigger={['hover']} overlay={<span>Utilice el zoom usando la rueda del mouse o los botones + / - del mapa hasta que pueda ver los postes o cámaras de color gris o negro.<br/></span>}><IconButton icon='live_help'/></Tooltip>
              </div>
              <div className="element_search" id="search"></div>
            </div>

            {/* step 2 */}
            <div className="element_container paso2">
              <div className="element_wrapperTitle">
                <h5 className="element_title">Paso 2/2: Active el botón de este formulario y seleccione el poste aéreo o cámara subterránea más cercana a su dirección.</h5>
                <Tooltip className="element_tooltip" placement="right" trigger={['hover']} overlay={<span>Debe seleccionar un poste o cámara desde el mapa. Utilice el zoom para poder visualizar los elementos poste o cámara de color gris o negro.<br/></span>}><IconButton icon='live_help'/></Tooltip>
              </div>
              <div className="element_wrapperBody">
                <Input disabled={this.state.posteDisabled} onChange={this.handleChange.bind(this)}  type='text' label='* Rótulo de poste'
                  name='cortocircuito_rotuloPoste' value={this.state.soloRotulo} className="inputCss" />
                <Button id="btnSeleccionarPoste" onClick={this.onClickPoste.bind(this)} disabled={this.state.btnPosteDisabled} className="step2 btnSelect" raised icon= "format_size"></Button>
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
