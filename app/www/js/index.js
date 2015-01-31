// MAP FUNCTIONS

var map;
function initialize() {
    //https://www.mapbox.com/developers/api/
    var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
    map = L.map('map-layer', {
        attributionControl: false,
        zoomControl:false,
        center: [51.45, -2.6],
        zoom: 13
    });
    
    L.tileLayer('http://{s}.tiles.mapbox.com/v4/mc13818.l2a71g35/{z}/{x}/{y}.png'.concat(accToken), {
        maxZoom: 18
    }).addTo(map);
  
    var bounds = map.getBounds();
  
    featureStyle = {
        fillColor: 'green',
        visible: true,
        strokeWeight: 1
    };
    var rootUrl = "http://54.154.15.47/geoserver/ea/ows";
    var defaultParameters = {
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        typeName: 'ea:Flood_Warning_Areas',
        outputFormat : 'text/javascript',
        format_options : 'callback:getJson',
        maxfeatures: 5,
        bbox: bounds._southWest.lat+","+bounds._southWest.lng+","+bounds._northEast.lat+","+bounds._northEast.lng,
        SrsName : 'EPSG:41001'
    };
    
    var parameters = L.Util.extend(defaultParameters);
  //FROM SAM:
    _url = "http://54.154.15.47/geoserver/ea/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=ea%3Aflood_warning_areas&srsName=EPSG%3A3857&maxFeatures=1&outputFormat=application%2Fjson&bbox=-280065.271637%2C6665193.142305%2C-270281.332016%2C6687726.302866";
    console.log("using url: " + _url);
}
window.onload = initialize;

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
var curLocData;	//object for the current location data
var searchTimer;
$('#search-input').on('click', function() {
  displaySavedLocations();
});

//search bar text changed
$('#search-input').on('input', function() {
    //reset fav icon & curloc
    $('#search-bar-favourite img').attr("src","img/search/favourite-empty-icon.png");
    curLocData = undefined;
    //timer used so fast-typing doesnt trigger rapid requests
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function() {
      var inp = $("#search-input");
      var req = $.ajax({
        //fetch from http://nominatim.openstreetmap.org/
        url: 'http://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=gb&q=' + inp.val(),
        dataType: 'json',
        success: addrSearch
      });
    }, 250);
});

//Update the dropdown box with the search results (given by 'data')
function addrSearch(data) {
  var inp = $("#search-input");
  if(typeof data === "undefined") {
    return;
  }
  var items = [];
  $.each(data, function(key, val) {
      items.push("<li data-lat='"+val.lat+"' data-lon='"+val.lon+"' data-dispname='"+val.display_name+"' data-type='"+val.type+"'>" + val.display_name +'</li>');
  });

  $('#search-results .expanded-locations').empty();
  if (items.length != 0) {
      $(items.join('')).appendTo('#search-results .expanded-locations');
      $('#search-results .expanded-title').text("Search results");
  } else {
      $('#search-results .expanded-title').text("No results found");
  }
}

//updates saved location ui with contents of 'savedLocations'
function displaySavedLocations() {
	var inp = $("#search-input");
  var items = [];
  $.each(savedLocations, function(key, val) {
      items.push("<li data-lat='"+val.lat+"' data-lon='"+val.lng+"' data-dispname='"+val.dispname+"' data-type='"+val.type+"'>" + val.dispname + 
                  '<img class="favourite-delete" src="img/search/favourite-delete-icon.png" alt="Delete favourite" /><div class="clearfix"></div></li>');
  });
  $('#saved-locations .expanded-locations').empty();
  if (items.length != 0) {
      $(items.join('')).appendTo('#saved-locations .expanded-locations');
      $('#saved-locations .expanded-title').text("Saved locations");
  } else {
      $('#saved-locations .expanded-title').text("No saved locations");
  }
}

//search result item is clicked
$('#search-results').on('click', 'li', function(){
	goToLocation(this);
});

//click on saved location item
$('#saved-locations').on('click', 'li', function() {
	goToLocation(this);
});

//click on delete saved location item
//TODO: clicking this still triggers the above event to fire..
$('#saved-locations').on('click', 'li .favourite-delete', function() {
  var index = savedLocIndex({	
    lat: $(this).attr('data-lat'),
    lng: $(this).attr('data-lon'),
    dispname: $(this).attr('data-dispname'),
    type: $(this).attr('data-type')
  });
  savedLocations.splice(index, 1);
  displaySavedLocations();
});

//pans map to location given by 'data'
function goToLocation(data) {
	//update current location
 	curLocData = {lat: $(data).attr('data-lat'),
								lng: $(data).attr('data-lon'),
								dispname: $(data).attr('data-dispname'),
								type: $(data).attr('data-type') };
  var location = new L.LatLng(curLocData.lat, curLocData.lng);
  map.panTo(location);
  $('#search-input').val($(data).text());
  
	//set zoom level based on type of location
  //known outliers: tadley = administrative?
  if(curLocData.type == "administrative") {  //country
    map.setZoom(8);
  } else if(curLocData.type == "city") {
    map.setZoom(12);
  } else if(curLocData.type == "town") {
    map.setZoom(13);
  } else if(curLocData.type == "village") {
    map.setZoom(14);
  } else {
    map.setZoom(13);
  }
  hideSearchBar();
  updateFavIcon();
}

//	FAVOURITE LOCATION
var savedLocations = [];	//holds loc data for all saved locs
localStorage.setItem("savedLocations", JSON.stringify(savedLocations));

//location is favourited
$('#search-bar-favourite').on('click', function() {
  toggleFavourite();
});

//adds/removes from savedLocations, updates icon and the ui
function toggleFavourite() {
  if(typeof curLocData === "undefined") {
		return;
	}
  if(savedLocations.length == 0) {
		savedLocations.push(curLocData);
	} else {  
    var index = savedLocIndex(curLocData);
    if(index != -1) {
      savedLocations.splice(index, 1);
    } else {
      savedLocations.push(curLocData);
    }
  }
  toggleFavIcon();
  localStorage["savedLocations"] = JSON.stringify(savedLocations);
	displaySavedLocations();
}

//finds the index of the input loc data in savedLocations
function savedLocIndex(data) {
  var ind = -1;
  $.each(savedLocations, function(index, value) {
    if(data.dispname == value.dispname) {
      ind = index;
    }
  });
  return ind;
}

//sets the fav icon according to whether curLocData is in savedLocations
function updateFavIcon() {
  if(savedLocIndex(curLocData) == -1) {
    $('#search-bar-favourite img').attr("src","img/search/favourite-empty-icon.png");
  } else {
    $('#search-bar-favourite img').attr("src","img/search/favourite-icon.png");
  }
}

function toggleFavIcon() {
  if($('#search-bar-favourite img').attr("src") == "img/search/favourite-icon.png") {
    $('#search-bar-favourite img').attr("src","img/search/favourite-empty-icon.png");
  } else {
    $('#search-bar-favourite img').attr("src","img/search/favourite-icon.png");
  }
}