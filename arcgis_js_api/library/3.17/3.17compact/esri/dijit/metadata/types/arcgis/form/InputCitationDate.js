// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.17/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/types/arcgis/form/InputCitationDate","dojo/_base/declare dojo/_base/lang dojo/has ../../../../../kernel ../../../base/etc/docUtil ./InputDate".split(" "),function(a,b,d,e,f,g){a=a([g],{allowTime:!0,postCreate:function(){this.inherited(arguments)},emitInteractionOccurred:function(a){this.inherited(arguments);try{if("pubDate"!==this.parentXNode.target){var c=f.findInputWidget(this.parentXNode.parentElement.gxePath+"/pubDate",this.parentXNode.domNode.parentNode);c&&c.emitInteractionOccurred()}}catch(b){console.error(b)}}});
d("extend-esri")&&b.setObject("dijit.metadata.types.arcgis.form.InputCitationDate",a,e);return a});