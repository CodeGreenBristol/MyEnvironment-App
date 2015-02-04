

var url = 'http://www.geostore.com/OGC/OGCInterface?SERVICE=WFS&' +
'UID=UDATAGOV2011&PASSWORD=datagov2011&INTERFACE=ENVIRONMENTWFS&VERSION=2.0.0&LC=4000&' +
'request=GetFeature&typeNames=ENVIRONMENTWFS:flood_warning_areas_010k_inspire';


var vector = new ol.layer.Vector({
  source: new ol.source.StaticVector({
    format: new ol.format.WFS({
      featureNS: 'http://192.168.84.58:8090/ENVIRONMENTWFS',
      featureType: 'ENVIRONMENTWFS:flood_warning_areas_010k_inspire'
    }),
    projection: 'EPSG:4326',
    url: url
  })
})

var raster = new ol.layer.Tile({

  preload: Infinity,
    source: new ol.source.BingMaps({
      key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
      imagerySet: 'Aerial'
    })

});

var map = new ol.Map({
  layers: [raster, vector],
  target: document.getElementById('map'),
  view: new ol.View({
          center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
          zoom: 4
        })
});
