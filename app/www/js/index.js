// MAP FUNCTIONS
var map;
  
//https://www.mapbox.com/developers/api/
var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
map = L.map('map-layer', {
    attributionControl: false,
    zoomControl:false,
    //center: [51.45, -2.6],
    //zoom: 15,
    center: [51.396, -2.298],
    zoom: 14,
    minZoom: 8
});

L.tileLayer('http://{s}.tiles.mapbox.com/v4/mc13818.l2a71g35/{z}/{x}/{y}.png'.concat(accToken), {
    maxZoom: 18
}).addTo(map);

var rightLayer = L.tileLayer.wms("http://54.154.15.47/geoserver/ea/wms",{
    layers: 'ea:flood_warning_areas',
    format: 'image/png8',
    transparent: true,
    tiled: true,
    srs: 'EPSG:4326',
    version: '1.1.0',
    reuseTiles: true
}).addTo(map);

var leftLayer = L.tileLayer.wms("http://54.154.15.47/geoserver/ea/wms",{
    layers: 'ea:areasoutstgnaturalbeauty_eng',
    format: 'image/png8',
    transparent: true,
    tiled: true,
    srs: 'EPSG:4326',
    version: '1.1.0'
}).addTo(map);

$(rightLayer._tileContainer).parent().children('.leaflet-tile-container').addClass("rightData").width($(window).width()).height($(window).height()).css("overflow", "hidden");
$(leftLayer._tileContainer).parent().children('.leaflet-tile-container').addClass("leftData").width(0).height($(window).height()).css("overflow", "hidden");

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

var sliderOffset = 0;

function getTransform(el) {
    var results = $('.leaflet-map-pane').css('transform').match(/matrix\((-?\d+), ?(-?\d+), ?(-?\d+), ?(-?\d+), ?(-?\d+), ?(-?\d+)\)/);

    if(!results) return [0, 0];
    
    return results.slice(5, 7);
}

function adjustDataContainer(){
    $('.rightData').width($(window).width() - sliderOffset).css('left', sliderOffset).children().css('margin-left', -sliderOffset);
    $('.leftData').width(sliderOffset);
}

function adjustDataTiles(){
    var panCoords = getTransform($('.leaflet-map-pane'));
    var translateOuter = "translate3d(" + (-panCoords[0]) + "px, " + (-panCoords[1]) + "px, 0px)";
    var translateInner = "translate3d(" + panCoords[0] + "px, " + panCoords[1] + "px, 0px)";
    $('.rightData').css("transform", translateOuter).children().css({"transform": translateInner, "margin-left": -sliderOffset});
    $('.leftData').css("transform",  translateOuter).children().css({"transform": translateInner});
}
   
map.on('move', function(){
    adjustDataTiles();
});

map.on('zoomstart', function(){
    $('.rightData:last, .leftData:last').hide();
});

map.on('zoomend', function(){
    adjustDataContainer();
    adjustDataTiles();
    $('.rightData:last, .leftData:last').hide();
    $('.rightData:first, .leftData:first').show();
    
});

function offsetFunc(){
    
    adjustDataContainer();
    
    // SHOW BUTTON IF SIDE IS VISIBLE
    if(sliderOffset >= 135 && !$('#left-button-block').is(':visible')){
        $('#left-button-block').fadeIn();
    }
    else if(sliderOffset < 135 && $('#left-button-block').is(':visible')){
        buttonExpand("left", true);
        $('#left-button-block').fadeOut();        
    }
    else if(sliderOffset <= $(window).width() - 185 && !$('#right-button-block').is(':visible')){
        $('#right-button-block').fadeIn();
    }
    else if(sliderOffset > $(window).width() - 185 && $('#right-button-block').is(':visible')){
        buttonExpand("right", true);
        $('#right-button-block').fadeOut();    
    }
    
    // SHOW ARROWS ON SIDE OF SLIDER
    if(sliderOffset >= 50 && $('#drag-right').is(':visible')){
        $('#drag-right').fadeOut();
    }
    else if(sliderOffset < 50 && !$('#drag-right').is(':visible')){
        $('#drag-right').fadeIn();        
    }
    if(sliderOffset <= $(window).width() - 100 && $('#drag-left').is(':visible')){
        $('#drag-left').fadeOut();
    }
    else if(sliderOffset > $(window).width() - 100 && !$('#drag-left').is(':visible')){
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
    if($('#slider-bar').hasClass('dragging')){       
        if(sliderOffset != e.pageX);{
            sliderOffset = e.pageX;
            offsetFunc();
            $('#slider-bar').offset({
                left: sliderOffset - 25
            });
        }
    }
});

// ADDRESS SEARCH
// TODO: proper styling, (responsiveness etc)
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
    
  

