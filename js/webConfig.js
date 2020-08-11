var jsConfig = {
   ArcGISProxyUrl:'http://10.180.2.21/DotNet/proxy.ashx',
   mapZoom: 4,
   mapCenter: [-100, 39]
};

var GISServices = {
	WmsUrl: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
	printServiceUrl: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
};

var calCitemapServices = {
	dojoBootstrapUrl: 'https://esri.github.io/calcite-maps/dist/vendor/dojo-bootstrap',
	dojoUrl: 'https://esri.github.io/calcite-maps/dist/js/dojo',
	arcGISJSUrl: 'https://js.arcgis.com/4.14/'
};


(function() {
/* create the link element */
var linkCalciteMapsBootstrap = document.createElement('link');
linkCalciteMapsBootstrap.setAttribute('rel', 'stylesheet');
linkCalciteMapsBootstrap.setAttribute('href', 'https://esri.github.io/calcite-maps/dist/css/calcite-maps-bootstrap.min-v0.10.css');
document.getElementsByTagName('head')[0].appendChild(linkCalciteMapsBootstrap);

var linkCalciteMapsArcgis = document.createElement('link');
linkCalciteMapsArcgis.setAttribute('rel', 'stylesheet');
linkCalciteMapsArcgis.setAttribute('href', 'https://esri.github.io/calcite-maps/dist/css/calcite-maps-arcgis-4.x.min-v0.10.css');
document.getElementsByTagName('head')[0].appendChild(linkCalciteMapsArcgis);

var linkEsriMain = document.createElement('link');
linkEsriMain.setAttribute('rel', 'stylesheet');
linkEsriMain.setAttribute('href', 'https://js.arcgis.com/4.14/esri/themes/light/main.css');
document.getElementsByTagName('head')[0].appendChild(linkEsriMain);

var linkEsriFavicon = document.createElement('link');
linkEsriFavicon.setAttribute('rel', 'stylesheet');
linkEsriFavicon.setAttribute('href', 'https://esri.github.io/calcite-web/assets/img/favicon.ico');
document.getElementsByTagName('head')[0].appendChild(linkEsriFavicon);

})();
