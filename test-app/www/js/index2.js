

var url = 'http://www.geostore.com/OGC/OGCInterface?SERVICE=WFS&' +
'UID=UDATAGOV2011&PASSWORD=datagov2011&INTERFACE=ENVIRONMENTWFS&VERSION=2.0.0&LC=4000&' +
'request=GetFeature&typeNames=ENVIRONMENTWFS:flood_warning_areas_010k_inspire&count=20';

var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

var lon = 5;
var lat = 40;
var zoom = 5;
var map, layer;

var aerial = new OpenLayers.Layer.Bing({
  key: apiKey,
  type: "Aerial"
});

function init(){
  map = new OpenLayers.Map('map');
  map.addLayer(layer);
  map.zoomToExtent(new OpenLayers.Bounds(-3.922119,44.335327,4.866943,49.553833));
  map.addLayer(new OpenLayers.Layer.Vector("GML", {
    protocol: new OpenLayers.Protocol.HTTP({
      url: "gml/polygon.xml",
      format: new OpenLayers.Format.GML()
    }),
    strategies: [new OpenLayers.Strategy.Fixed()]
  }));
}
