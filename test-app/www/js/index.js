// MAP FUNCTIONS

var map;
function initialize() {
    
    var mapStyles = [
    {
        featureType: "poi",
        stylers: [
          { visibility: "off" }
        ]   
      }
    ];
    
    // Create a simple map.
    map = new google.maps.Map(document.getElementById('map-layer'), {
        zoom: 15,
        center: {lat: 51.45, lng: -2.6},
        disableDefaultUI: true,
        styles: mapStyles 
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

// SEARCH BAR EXPAND
$('#search-bar input').click(function(){
    
    // IF HIDDEN, SHOW
    if(!$('#search-bar-expanded').is(':visible')){
        // SLIDE DOWN
        $('#search-bar-expanded').slideDown();
        
        // EXCHANGE ICON TO GO BACK
        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/left-arrow-icon.png').fadeIn();
        });
    }
});

// CLOSE SEARCH BAR
$('#search-icon').click(function(){
    
    // IF VISIBLE, HIDE
    if($('#search-bar-expanded').is(':visible')){
        $('#search-bar-expanded').slideUp();
        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/search-icon.png').fadeIn();
        });
    }
});

$('html').click(function() {
               
    // IF VISIBLE, HIDE
    if($('#search-bar-expanded').is(':visible')){
        $('#search-bar-expanded').slideUp();
        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/search-icon.png').fadeIn();
        });
    }
});

$('#search-bar, #search-bar-expanded').click(function(e){
    e.stopPropagation();
});
