// MAP FUNCTIONS
var map;
  
//https://www.mapbox.com/developers/api/
var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
map = L.map('map-layer', {
    attributionControl: false,
    zoomControl:false,
    center: [51.45, -2.6],
    zoom: 15,
    minZoom: 8
});

L.tileLayer('http://{s}.tiles.mapbox.com/v4/mc13818.l2a71g35/{z}/{x}/{y}.png'.concat(accToken), {
    maxZoom: 18
}).addTo(map);



  var featureLayerRight = new L.GeoJSON();
 var featureLayerLeft = new L.GeoJSON();

  getData();

  window.loadGeoJson = function(data)
  {
    map.removeLayer(featureLayerLeft).removeLayer(featureLayerRight);
    featureLayerRight = L.geoJson(data, {
        style: { color: "#ff0000", fillColor: "#ff0000"}}
    );
    featureLayerLeft = L.geoJson(data, { style: {}});
    map.addLayer(featureLayerRight);
    // map.addLayer(featureLayerLeft);
  };
	
function getData(){
    
    var geoJsonUrl ='http://54.154.15.47/geoserver/postgis/ows';
    var defaultParameters = {
      service: 'WFS',
      version: '1.0.0',
      request: 'getFeature',
      srsName: 'urn:x-ogc:def:crs:EPSG:4326',
      //srsName: 'urn:x-ogc:def:crs:EPSG:4277',
      typeName: 'postgis:flood_warning_areas',
      maxFeatures: 100,
      outputFormat: 'text/javascript',
      format_options: 'callback:loadGeoJson'
    };

    var customParams = {
      bbox: map.getBounds().toBBoxString()
    };

    var parameters = L.Util.extend(defaultParameters, customParams);
    // console.log(geoJsonUrl + L.Util.getParamString(parameters));

    var url = geoJsonUrl + L.Util.getParamString(parameters);

    $.ajax({
        url: url,
        jsonp: "loadGeoJson",
        dataType: "jsonp"
    });
};

map.on('moveend', function(){
    if(map.getZoom() > 11){ getData(); }
    else { map.removeLayer(featureLayerLeft).removeLayer(featureLayerRight); };
});
      
// SEARCH BAR EXPAND
$('#search-bar input').click(function(){

    // IF HIDDEN, SHOW
    if(!$('#search-bar-expanded').is(':visible')){
        
        $('#search-mask').fadeIn();
        
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
    hideSearchBar();
});
$('html').click(function() {
    hideSearchBar();
});

function hideSearchBar() {
    // IF VISIBLE, HIDE
    if($('#search-bar-expanded').is(':visible')){
        $('#search-mask').fadeOut();
        $('#search-bar-expanded').slideUp();
        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/search-icon.png').fadeIn();
        });
    }
}

$('#search-bar, #search-bar-expanded').click(function(e){
    e.stopPropagation();
});

// BUTTONS EXPAND
function buttonExpand(side, override){

    // IF NOT VISIBLE, DISPLAY
    if(typeof override === "undefined" && !$('#' + side + '-legend-button').is(':visible') && !$('#' + side + '-topic-button').is(':visible')) {
        $('#' + side + '-legend-button').show("fast", function(){ $(this).addClass('btn-expanded'); });
        $('#' + side + '-topic-button').show("fast", function(){ $(this).addClass('btn-expanded'); });
        $('#' + side + '-button').attr('src', 'img/buttons/close-menu-icon.png');
    }

    // IF VISIBLE, HIDE
    else {
        $('#' + side + '-legend-button').removeClass("btn-expanded");
        $('#' + side + '-topic-button').removeClass("btn-expanded");
        
        setTimeout(function(){
            $('#' + side + '-legend-button').hide();
            $('#' + side + '-topic-button').hide();
        }, 500);
        
        $('#' + side + '-button').attr('src', 'img/buttons/'+ side +'-menu-icon.png');
    }
}
    
$('#left-button').click(function() {
    buttonExpand("left");
});

$('#right-button').click(function() {
    buttonExpand("right");
});

// TOGGLE MAP TOPIC MENU
$('#right-topic-button, #left-topic-button').click(function() {
    $('#map-select-layer').show().animate({marginTop: "0px"}, {queue: false, duration: 750});
    $('#map-select-layer').animate({height: "100%"}, {queue: false, duration: 750});
});

// SLIDE UP TOPIC MENU
$('#menu-icon').click(function() {
    $('#map-select-layer').animate({marginTop: "100%"}, {queue: false, duration: 750});
    $('#map-select-layer').animate({height: "0px"}, {queue: false, duration: 750}, function(){
        $(this).hide();
    });
});

function sliderOffset(offset){

    var newWidth = $(window).width() - offset;
    $('svg.leaflet-zoom-animated').attr("width", newWidth);
   // document.getElementsByTagName("svg")[0].getAttribute("viewBox").replace(document.getElementsByTagName("svg")[0].getAttribute("viewBox").split(" ")[2], newWidth)
    
    // SHOW BUTTON IF SIDE IS VISIBLE
    if(offset >= 135 && !$('#left-button-block').is(':visible')){
        $('#left-button-block').fadeIn();
    }
    else if(offset < 135 && $('#left-button-block').is(':visible')){
        buttonExpand("left", true);
        $('#left-button-block').fadeOut();        
    }
    else if(offset <= $(window).width() - 185 && !$('#right-button-block').is(':visible')){
        $('#right-button-block').fadeIn();
    }
    else if(offset > $(window).width() - 185 && $('#right-button-block').is(':visible')){
        buttonExpand("right", true);
        $('#right-button-block').fadeOut();    
    }
    
    // SHOW ARROWS ON SIDE OF SLIDER
    if(offset >= 50 && $('#drag-right').is(':visible')){
        $('#drag-right').fadeOut();
    }
    else if(offset < 50 && !$('#drag-right').is(':visible')){
        $('#drag-right').fadeIn();        
    }
    if(offset <= $(window).width() - 100 && $('#drag-left').is(':visible')){
        $('#drag-left').fadeOut();
    }
    else if(offset > $(window).width() - 100 && !$('#drag-left').is(':visible')){
        $('#drag-left').fadeIn();        
    }
}
    
// DRAGGABLE SLIDER
$('#slider-bar').on('mousedown', function(){
    $(this).addClass('dragging');
});
$('#slider-bar').on('mouseup', function(){
    $(this).removeClass('dragging');
});

$('body').on('mousemove', function(e){
    var leftOffset = 0;
    if($('#slider-bar').hasClass('dragging')){       
        if(leftOffset != e.pageX - 25);{
            leftOffset = e.pageX - 25;
            sliderOffset(leftOffset);
            $('#slider-bar').offset({
                left: leftOffset
            });
        }
    }
});


// ADDRESS SEARCH
// TODO: proper styling, (responsiveness etc)
var searchTimer;
$('#search-input').on('input', function() { 
    var inp = $("#search-input");
    $.ajax({
      //fetch from http://nominatim.openstreetmap.org/
      url: 'http://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=gb&q=' + inp.val(),
      dataType: 'json',
      success: addrSearch,
      timeout: 1000 //1 second timeout
    });
});

function addrSearch(data) {
    console.log("call");
  var inp = $("#search-input");
  if(typeof data === "undefined") {
    return;
  }
  var items = [];
  $.each(data, function(key, val) {
      items.push("<li data-lat='"+val.lat+"' data-lon='"+val.lon+"' data-type='"+val.type+"'>" + val.display_name +'</li>');
  });

  $('#search-results .expanded-locations').empty();
  if (items.length != 0) {
      $(items.join('')).appendTo('#search-results .expanded-locations');
      $('#search-results .expanded-title').text("Search results");
  } else {
      $('#search-results .expanded-title').text("No results found");
  }
}

$('#search-results').on('click', 'li', function(){
    
    var location = new L.LatLng($(this).attr('data-lat'), $(this).attr('data-lon'));
    map.panTo(location);
    var type = $(this).attr('data-type');
    $('#search-input').val($(this).text());
    console.log(type);
    //set zoom level based on type of location
    //known outliers: tadley = administrative?
    if(type == "administrative") {  //country
      map.setZoom(8);
    } else if(type == "city") {
      map.setZoom(12);
    } else if(type == "town") {
      map.setZoom(13);
    } else if(type == "village") {
      map.setZoom(14);
    } else {
      map.setZoom(13);
    }
    hideSearchBar();
});
    
  

