var map;
function initialize() {
    // Create a simple map.
    map = new google.maps.Map(document.getElementById('map-layer'), {
        zoom: 15,
        center: {lat: 51.45, lng: -2.6},
        disableDefaultUI: true
    });

    $.getJSON( "test.geojson", function( data ) {
        map.data.addGeoJson(data);
    });
    // Load a GeoJSON from the same server as our demo.
    var featureStyle = {
        fillColor: 'green',
        visible: true,
        strokeWeight: 1
    };
    map.data.setStyle(featureStyle);

}

google.maps.event.addDomListener(window, 'load', initialize);
