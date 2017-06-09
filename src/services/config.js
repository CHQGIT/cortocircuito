
/*
Compilate: 9.6.2017
Cortocircuito  : v0.2
Author: Evelyn Hernández
*/

const mapConfig = {
  basemap: "gray",
  center: [-71.5540, -32.9928],
  zoom: 11
};

const creds = {
  u:'vialactea\\usrgis' ,
  p: "N3L4y5HZ"
}


//bUILD EXTERNA PROD

const env = {
  ROOT: "css/",
  CSSDIRECTORY: 'css/',
  ROUTEPATH: '/Cortocircuito',
  ENVIRONMENT: 'PRODUCTION',
  SAVEAPPLICATIONMODULE: "CORTOCIRCUITO_PROD",
  SAVEAPPLICATIONNAME: 'REACT_CORTOCIRCUITO_PROD',
  BUILDFOR: 'EXTERNA',
  WPHP: "http://ventasbeta.chilquinta.cl/online/getParametros.php"
}

export default env;


export {mapConfig, creds};
