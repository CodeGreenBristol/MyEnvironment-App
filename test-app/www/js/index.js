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


    map.data.loadGeoJson("http://54.154.15.47/test.geojson");

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

// BUTTONS EXPAND
$('#left-button').click(function() {

    // IF NOT VISIBLE, DISPLAY
    if(!$('#left-legend-button').is(':visible') && !$('#left-topic-button').is(':visible')) {
        $('#left-legend-button').toggle("scale");
        $('#left-topic-button').toggle("scale");
        $('#left-button img').attr('src', 'img/buttons/close-menu-icon.png');
    }

    // IF VISIBLE, HIDE
    else {
        $('#left-legend-button').toggle("scale");
        $('#left-topic-button').toggle("scale");
        $('#left-button img').attr('src', 'img/buttons/left-menu-icon.png');
    }
});

$('#right-button').click(function() {

    // IF NOT VISIBLE, DISPLAY
    if(!$('#right-legend-button').is(':visible') && !$('#right-topic-button').is(':visible')) {
        $('#right-legend-button').toggle("scale");
        $('#right-topic-button').toggle("scale");
        $('#right-button img').attr('src', 'img/buttons/close-menu-icon.png');
    }

    // IF VISIBLE, HIDE
    else {
        $('#right-legend-button').toggle("scale");
        $('#right-topic-button').toggle("scale");
        $('#right-button img').attr('src', 'img/buttons/right-menu-icon.png');
    }
});

// TOGGLE MAP TOPIC MENU
$('#right-topic-button').click(function() {

    // IF MENU NOT VISIBLE, DISPLAY
    if(!$('#map-select-layer').is(':visible')) {
        $('#map-select-layer').slideDown(500);
    }
});

$('#left-topic-button').click(function() {

    // IF MENU NOT VISIBLE, DISPLAY
    if(!$('#map-select-layer').is(':visible')) {
        $('#map-select-layer').slideDown(500);
    }
});


// SLIDE UP TOPIC MENU
    $('#menu-icon').click(function() {
        $('#map-select-layer').slideUp(500);
    });

// SELECT TOPIC FROM MENU