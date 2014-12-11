
var projection = 'EPSG:3857';
var aerial = new ol.layer.Tile({

  preload: Infinity,
    source: new ol.source.BingMaps({
      key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
      imagerySet: 'Aerial'
    })

});

var road = new ol.layer.Tile({
  preload: Infinity,
  source: new ol.source.BingMaps({
    key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
    imagerySet: 'Road'
  })
});

var vector = new ol.layer.Vector({
  source: new ol.source.GeoJSON({
    projection: projection,
    url: 'test2.json'
  })
});

var map = new ol.Map({
  layers: [road, vector],
  target: document.getElementById('map'),
  view: new ol.View({
      center: [-300000, 7000000],
      zoom: 5
        })
});
