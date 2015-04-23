// MAP FUNCTIONS
var map;

//https://www.mapbox.com/developers/api/
var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
map = L.map('map-layer', {
    attributionControl: false,
    zoomControl:false,
    center: [51.45, -2.59],
    zoom: 14,
    minZoom: 7,
    maxZoom: 17
});

//add scale indicator
//L.control.scale({position: 'topright'}).addTo(map);

L.tileLayer('http://{s}.tiles.mapbox.com/v4/mc13818.l2a71g35/{z}/{x}/{y}.png'.concat(accToken), {
    reuseTiles: true,
    detectRetina: true,
    unloadInvisibleTiles: false
}).addTo(map);

var rightLayerData = (typeof localStorage['rightLayer'] !== "undefined") ? localStorage['rightLayer'] : undefined;
var leftLayerData = (typeof localStorage['leftLayer'] !== "undefined") ? localStorage['leftLayer'] : undefined;
var rightLayer;
var leftLayer;
var locationMarker;

function setRightLayer() {
    rightLayer = L.tileLayer.wms("http://54.154.15.47/geoserver/ea/wms",{
        layers: rightLayerData,
        format: 'image/png8',
        transparent: true,
        tiled: true,
        srs: 'EPSG:4326',
        version: '1.1.0',
        reuseTiles: true,
        detectRetina: true,
        unloadInvisibleTiles: false
    }).addTo(map);
    $(rightLayer._container).attr("id", "rightData");

    // add to localstorage
    localStorage['rightLayer'] = rightLayerData;

    adjustDataContainer();
}
if(typeof rightLayerData !== "undefined") setRightLayer();


function setLeftLayer() {
    leftLayer = L.tileLayer.wms("http://54.154.15.47/geoserver/ea/wms",{
        layers: leftLayerData,
        format: 'image/png8',
        transparent: true,
        tiled: true,
        srs: 'EPSG:4326',
        version: '1.1.0',
        reuseTiles: true,
        detectRetina: true,
				unloadInvisibleTiles: false
    }).addTo(map);
    $(leftLayer._container).attr("id", "leftData");

    // add to localstorage
    localStorage['leftLayer'] = leftLayerData;

    adjustDataContainer();
}
if(typeof leftLayerData !== "undefined") setLeftLayer();

// SEARCH BAR EXPAND
$('#search-bar input').click(function(){

    // IF HIDDEN, SHOW
    if(!$('#search-bar-expanded').is(':visible')){

        addrSearch();

        $('#search-mask').fadeIn();

        // SLIDE DOWN
        $('#search-bar-expanded').slideDown();

        // EXCHANGE ICON TO GO BACK
        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/left-arrow-icon.png').fadeIn();
        });
    }

});

$('#search-bar input').bind("enter", enterPressed);

$('#search-bar input').keyup(function(e){
    if(e.keyCode == 13)
    {
      $(this).trigger("enter");
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

/*
function getTransform() {
    var results = $('.leaflet-map-pane').css('transform').match(/matrix\((-?\d+), ?(-?\d+), ?(-?\d+), ?(-?\d+), ?(-?\d+), ?(-?\d+)\)/);

    if(!results) return [0, 0];

    return results.slice(5, 7);
}

function adjustDataContainer(){
    var panCoords = getTransform();
    $('.rightData').css("clip","rect("+(-parseInt(panCoords[1]))+"px, "+($(window).width() - parseInt(panCoords[0]))+"px, "+($(window).height() - parseInt(panCoords[1]))+"px, "+(sliderOffset - parseInt(panCoords[0]))+"px)");
    $('.leftData').css("clip", "rect("+(-parseInt(panCoords[1]))+"px, "+(sliderOffset - parseInt(panCoords[0]))+"px, "+($(window).height() - parseInt(panCoords[1]))+"px, "+(-parseInt(panCoords[0]))+"px)");
}
*/

function adjustDataContainer(){
    var nw = map.containerPointToLayerPoint([0, 0]),
    se = map.containerPointToLayerPoint(map.getSize()),
    clipX = nw.x + (se.x - nw.x) * (sliderOffset / $(window).width());

    if(!$('#left-pin').hasClass('pin-active')) $('#leftData').css("clip", 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)');
    if(!$('#right-pin').hasClass('pin-active')) $('#rightData').css("clip", 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)');
}

map.on('move', adjustDataContainer);

// REDUNDANCY, SEE IF WE CAN MAKE IT PERCENTAGES
function generateButtonRules(){
    if($(window).width() <= 768) return 80;
    else if($(window).width() <= 1024) return 120;
    return 150;
}
var sliderLimit = generateButtonRules();

function generateLabelRules(){
	if($(window).width() <= 400) return 160;
    else if($(window).width() <= 768) return 300;
    else if($(window).width() <= 1024) return 350;
    return 440;
}
var labelLimit = generateLabelRules();

function offsetFunc(){

    adjustDataContainer();

    // SHOW BUTTON IF SIDE IS VISIBLE
    if(sliderOffset >= sliderLimit && !$('#left-button').is(':visible')){
        $('#left-button, #left-pin').fadeIn();
    }
    else if(sliderOffset < sliderLimit && $('#left-button').is(':visible')){
        $('#left-button, #left-pin').fadeOut();
    }
    if(sliderOffset <= $(window).width() - sliderLimit && !$('#right-button').is(':visible')){
        $('#right-button, #right-pin').fadeIn();
    }
    else if(sliderOffset > $(window).width() - sliderLimit && $('#right-button').is(':visible')){
        $('#right-button, #right-pin').fadeOut();
    }

    // SHOW ARROWS ON SIDE OF SLIDER
    if(sliderOffset / $(window).width() >= 0.07 && $('#drag-right').is(':visible')){
        $('#drag-right').fadeOut();
    }
    else if(sliderOffset / $(window).width() < 0.07 && !$('#drag-right').is(':visible')){
        $('#drag-right').fadeIn();
    }
    if(sliderOffset / $(window).width() <= 0.93 && $('#drag-left').is(':visible')){
        $('#drag-left').fadeOut();
    }
    else if(sliderOffset / $(window).width() > 0.93 && !$('#drag-left').is(':visible')){
        $('#drag-left').fadeIn();
    }
	
	// SHOW LABEL IF SIDE IS MORE THAN 1/3 VISIBLE
	if(sliderOffset >= labelLimit && !$('#dataset-label-left').is(':visible')){
        $('#dataset-label-left').fadeIn(300);
    }
    else if(sliderOffset < labelLimit && $('#dataset-label-left').is(':visible')){
        $('#dataset-label-left').fadeOut(300);
    }
    if(sliderOffset <= $(window).width() - labelLimit && !$('#dataset-label-right').is(':visible')){
        $('#dataset-label-right').fadeIn(300);
    }
    else if(sliderOffset > $(window).width() - labelLimit && $('#dataset-label-right').is(':visible')){
        $('#dataset-label-right').fadeOut(300);
    }
}

// DRAGGABLE SLIDER
$('#slider-bar').on('mousedown touchstart', function(){
    $(this).addClass('dragging');

    // hide prompt if first time
    if($('#slide-prompt').is(":visible")){
        $('#slide-prompt').fadeOut();
		$('#select-map-prompt-left').fadeIn();
        localStorage['userReturning'] = true;
    }
});
$('#slider-bar').on('mouseup touchend', function(){
    $(this).removeClass('dragging');
    if(sliderOffset / $(window).width() < 0.1){
        sliderOffset = 0;
    }
    else if(sliderOffset / $(window).width() > 0.90){
        sliderOffset = $(window).width();
    }

    $(this).offset({ left: sliderOffset + sliderLeft });
    offsetFunc();

    // add offset to localstorage
    localStorage['sliderOffset'] = sliderOffset;
});

// CAN OPTIMISE, NO NEED FOR OFFSETFUNC WHEN PAST THRESHOLD
$('body').on('mousemove touchmove', function(e){

    if(e.type == "touchmove") var out = e.originalEvent.touches[0];
    else var out = e;

    if($('#slider-bar').hasClass('dragging')){

        if(sliderOffset != out.pageX);{

            if(sliderOffset < 0) sliderOffset = 0;
            else if(sliderOffset > $(window).width()) sliderOffset = $(window).width();
            else sliderOffset = out.pageX;

            offsetFunc();
            $('#slider-bar').offset({ left: sliderOffset + sliderLeft });
        }
    }

    // don't prevent default if choosing topic
    if(!$('#map-select-layer').hasClass('menu-expanded')){
        e.preventDefault();
    }
});

// on startup, set slider if in localstorage
var sliderOffset = (typeof localStorage['sliderOffset'] !== "undefined") ? parseInt(localStorage['sliderOffset']) : 0 ;
if(sliderOffset > $(window).width()) sliderOffset = 0;
sliderLeft = parseInt($('#slider-bar').css('left'), 10);

$('#slider-bar').offset({ left: sliderOffset + sliderLeft });
offsetFunc();

// on startup, set dataset labels if in localstorage
/*if (typeof localStorage['rightLayer'] !== "undefined"){
	$('#dataset-label-right').fadeIn();
	$('#dataset-label-right').text(datasetsArray[rightLayerData]);
}*/

// ADDRESS SEARCH
var curLocData; //object for the current location data
var searchTimer;

//search bar text changed
$('#search-input').on('input', function() {

    //reset fav icon & curloc
    $('#search-bar-favourite img').attr("src","img/search/favourite-empty-icon.png");
    curLocData = undefined;

    addrSearch();
});

//Update the dropdown box with the search results (given by 'data')
function addrSearch() {

    // no API call if empty
    var inp = $("#search-input");
    var query = "";
    $('#search-results .expanded-locations').empty();

    if(inp.val() == ""){
        $('#search-results').hide();
        $('#search-bar-empty').hide();
        return;
    }
    else {
        $('#search-results').show();
        $('#search-bar-empty').css("display", "inline-block");
        //clean commas from query string to optimise processing on nominatim's end
        query = inp.val().replace(", ", " ").replace(","," ");
    }

    //timer used so fast-typing doesn't trigger rapid requests
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function() {
        $.ajax({
            //fetch from http://nominatim.openstreetmap.org/
            url: 'http://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=gb&q=' + query,
            dataType: 'json',
            beforeSend: displayLoadingIcon,
            success: updateSearchResults,
            error: function() {
                console.log("Request failed.");
            },
            complete: function() {
                console.log("Request complete.");
            }         
        });
    }, 250);
}

function displayLoadingIcon() {
    $('#search-results .expanded-title').empty();
    $('#search-results .expanded-title').append('<div class="loading-icon"></div><span></span>');
    $('#search-results .expanded-title span').text("Searching for locations...");
}

function updateSearchResults(data){
    if(typeof data === "undefined") {
        return;
    }
    var items = [];
    var displayedResults = [];

    $.each(data, function(key, val) {
        if($.inArray(val.display_name.toLowerCase(), displayedResults) == -1){
            items.push("<li data-lat='"+val.lat+"' data-lon='"+val.lon+"' data-type='"+val.type+"'>" + val.display_name +'</li>');
            displayedResults.push(val.display_name.toLowerCase());
        }
    });

    $('#search-results .expanded-locations').empty();
    //remove loading icon and text
    $('#search-results .expanded-title').empty();
    if (items.length != 0) {
        $(items.join('')).appendTo('#search-results .expanded-locations');
        //add new text
        $('#search-results .expanded-title').text("Search results");
    } else {
        $('#search-results .expanded-title').text("No results found");
    }
}

// go to first search result if enter is pressed
function enterPressed() {
    if($('#search-results .expanded-locations li').length != 0) {
        goToLocation($('#search-results .expanded-locations li').first());
    }
}

//  FAVOURITE LOCATION
var savedLocations = (typeof localStorage['savedLocations'] !== "undefined") ? JSON.parse(localStorage['savedLocations']) : [];    //holds loc data for all saved locs

// add saved location
function addSavedLocation(){
    var val = savedLocations[savedLocations.length - 1];
    $('#saved-locations .expanded-locations').append("<li data-lat='"+val.lat+"' data-lon='"+val.lng+"' data-type='"+val.type+"'><div>" + val.dispname +
        '</div><img class="favourite-delete" src="img/search/favourite-delete-icon.png" alt="Delete favourite" /><div class="clearfix"></div></li>');

    if(savedLocations.length == 1){
        $('#saved-locations .expanded-title').text("Saved locations");
    }
}

// remove saved location
function removeSavedLocation(index){
    $('#saved-locations .expanded-locations li:eq(' + index + ')').remove();
    if(savedLocations.length == 0){
        $('#saved-locations .expanded-title').text("No saved locations");
    }
}

//updates saved location ui with contents of 'savedLocations'
function renderSavedLocations() {

    var items = [];
    $.each(savedLocations, function(key, val) {
        items.push("<li data-lat='"+val.lat+"' data-lon='"+val.lng+"' data-type='"+val.type+"'><div>" + val.dispname +
            '</div><img class="favourite-delete" src="img/search/favourite-delete-icon.png" alt="Delete favourite" /><div class="clearfix"></div></li>');
    });

    $('#saved-locations .expanded-locations').empty();

    if (items.length != 0) {
        $(items.join('')).appendTo('#saved-locations .expanded-locations');
        $('#saved-locations .expanded-title').text("Saved locations");
    } else {
        $('#saved-locations .expanded-title').text("No saved locations");
    }
}
renderSavedLocations();

// search/saved result item is clicked
$('#search-results, #saved-locations').on('click', 'li', function(){
    goToLocation(this);
});

//click on delete saved location item
$('#saved-locations').on('click', 'li .favourite-delete', function(e) {
    var index = savedLocIndex($(this).text());
    savedLocations.splice(index, 1);
    removeSavedLocation(index);
    e.stopPropagation();
});

// pan map on marker click
$('#map-layer').on('click', '.leaflet-marker-icon', function(){
    map.panTo(locationMarker.getLatLng());
});

function panToLocation(location) {
  // set marker for location
  if(typeof locationMarker === "undefined"){
      locationMarker = L.marker(location).addTo(map);
  }
  else {
      locationMarker.setLatLng(location);
  }

  map.panTo(location);
}

//pans map to location given by 'data'
function goToLocation(data) {
    //update current location
    curLocData = {
        lat: $(data).attr('data-lat'),
        lng: $(data).attr('data-lon'),
        dispname: $(data).text(),
        type: $(data).attr('data-type')
    };

    var location = new L.LatLng(curLocData.lat, curLocData.lng);

    panToLocation(location);

    $('#search-input').val($(data).text());

    //set zoom level based on type of location
    console.log(curLocData.type);
    if(curLocData.dispname == "England, United Kingdom" || curLocData.dispname == "Scotland, United Kingdom") {
        map.setZoom(8);
    } else if(curLocData.type == "administrative") {  // country/county
        map.setZoom(10);
    } else if(curLocData.type == "city") {
        map.setZoom(12);
    } else if(curLocData.type == "town") {
        map.setZoom(13);
    } else if(curLocData.type == "village" || curLocData.type == "residential" || curLocData.type == "hamlet") {
        map.setZoom(14);
    } else {    //unclassified, river, stream, 
        map.setZoom(13);
    }
    hideSearchBar();
    updateFavIcon();
}

//location is favourited
$('#search-bar-favourite').on('click', function() {
    toggleFavourite();
});

//pan to location if geolocation was successful
var geolocationSuccess = function(location) {
  panToLocation(new L.LatLng(location.coords.latitude, location.coords.longitude));
}

function geolocationError() {
  window.alert("Sorry, we couldn't find your location!");
}

//sets marker and pans to location on click
$('#search-bar-location').on('click', function() {
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
});

//adds/removes from savedLocations, updates icon and the ui
function toggleFavourite() {
    if(typeof curLocData === "undefined") {
        return;
    }
    if(savedLocations.length == 0) {
        savedLocations.push(curLocData); addSavedLocation();
    } else {
        var index = savedLocIndex(curLocData.dispname);
        if(index != -1) {
            savedLocations.splice(index, 1); removeSavedLocation(index);
        } else {
            savedLocations.push(curLocData); addSavedLocation();
        }
    }
    toggleFavIcon();
    localStorage["savedLocations"] = JSON.stringify(savedLocations);
}

//finds the index of the input loc data in savedLocations
function savedLocIndex(dispName) {
    var ind = -1;
    $.each(savedLocations, function(index, value) {
        if(dispName == value.dispname) {
            ind = index;
            return false;
        }
    });
    return ind;
}

//sets the fav icon according to whether curLocData is in savedLocations
function updateFavIcon() {
    if(savedLocIndex(curLocData.dispname) == -1) {
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

// empty search string
$("#search-bar-empty").click(function(){
    $('#search-input').val("").focus();
    $('#search-results').hide();
    $("#search-bar-empty").hide();
});

var datasetsArray = {
    "Areas at risk of flooding" : {"type": "natural", "link" : "ea:flood_alert_areas", "description" : "Large expanses of floodplain that are at risk of low-impact flooding such as floodplain inundation, road flooding and farmland flooding.", "source" : "[Source: http://www.geostore.com/environment-agency/]"},
    "Historically flooded landfills" : {"type": "natural", "link" : "ea:landfill_in_hfm", "description" : "Areas representing landfills that have flooded in the past.", "source" : "[Source: Environment Agency]"},
    "Flood defences" : {"type": "natural", "link" : "ea:spatial_flood_defences", "description" : "Lines representing flood defences protecting against river floods or sea floods.", "source" : "[Source: Environment Agency]"},
    "Nitrate-sensitive areas" : {"type": "man", "link" : "ea:nitrate_sensitive_areas", "description" : "Nitrate sensitive areas are areas where the concentration of nitrates in drinking water sources is particularly high.", "source" : "[Source: http://www.geostore.com/environment-agency/]"},
    "Oil and gas wells" : {"type": "man", "link" : "decc_on_wells", "description" : "Oil and gas wells in onshore licence areas.", "source" : "[Source: https://www.gov.uk/oil-and-gas/licensing]"},
	"Outfall and discharge points" : {"type": "man", "link" : "outfall_discharge_points", "description" : "Points at which waste is discharged into bodies of water.", "source" : "[Source: http://www.geostore.com/environment-agency/]"},
	"Areas of outstanding natural beauty" : {"type": "recreation", "link" : "ea:areasoutstgnaturalbeauty_eng", "description" : "Areas of countryside designated for conservation due to their significant landscape value.", "source" : "[Source: http://www.geostore.com/environment-agency/]"},
    "Registered parks and gardens" : {"type": "recreation", "link" : "registered_parks_and_gardens", "description" : "Parks and Gardens as included on the Register of Historic Parks and Gardens.", "source" : "[Source: http://www.geostore.com/environment-agency/]"},
    "World Heritage Sites" : {"type": "recreation", "link" : "world_heritage_sites", "description" : "Properties in England with special cultural or physical significance, as inscribed by the World Heritage Committee of UNESCO.", "source" : "[Source: http://www.geostore.com/environment-agency/]"}
};

// TOGGLE MAP TOPIC MENU
var dataVal;
var menuViewed;
$('#right-button, #left-button').click(function() {

    // hide right button prompt if first time and show left prompt
    if($('#select-map-prompt-right').is(":visible")){
        $('#select-map-prompt-right').fadeOut();
		$('#slider-bar').fadeIn();
        $('#slide-prompt').fadeIn();
    }
	
	// hide left button prompt if first time and show pin prompt
    if($('#select-map-prompt-left').is(":visible")){
        $('#select-map-prompt-left').fadeOut();
        $('#pin-map-prompt').fadeIn();
    }

    $('#map-select-layer #menu-options ul li.topic-selected').removeClass('topic-selected');

    if($(this).attr("id") == "right-button") { dataVal = rightLayerData; menuViewed = 1; }
    else { dataVal = leftLayerData; menuViewed = 0; }

    // add tick to current selected topic based on left/right select
    $('#map-select-layer #menu-options ul li[data-link="'+dataVal+'"]').addClass('topic-selected');

    $('#map-select-layer').addClass('menu-expanded');
});

$('#right-pin, #left-pin').click(function(){

	// hide pin prompt if first time
	if($('#pin-map-prompt').is(":visible")){
		$('#pin-map-prompt').fadeOut();
	}

    // if pinning
    if(!$(this).hasClass('pin-active')){

        $(this).attr('src', 'img/buttons/active-pin-icon.png').addClass('pin-active');

        if($(this).attr('id') == "right-pin"){
            $('#left-pin').fadeOut();
            $('#rightData').css('clip', 'auto');
            if(typeof rightLayer !== "undefined") rightLayer.bringToFront();
        }
        else {
            $('#right-pin').fadeOut();
            $('#leftData').css('clip', 'auto');
            if(typeof leftLayer !== "undefined") leftLayer.bringToFront();
        }
    }
    // else unpinning
    else {
        $(this).attr('src', 'img/buttons/inactive-pin-icon.png').removeClass('pin-active');

        if($(this).attr('id') == "right-pin"){
            $('#left-pin').fadeIn();
        }
        else {
            $('#right-pin').fadeIn();
        }
        adjustDataContainer();
    }
});

// SLIDE DOWN TOPIC MENU
function hideTopicMenu(){
    $('#map-select-layer').removeClass('menu-expanded');
}

$('#menu-icon').click(hideTopicMenu);

//if on a mobile device use the deviceready event, else trigger manually
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    onDeviceReady();
}

// enable the android backbutton and get current position
function onDeviceReady() {
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    document.addEventListener("backbutton", hideTopicMenu, false);
}

function renderDataSets(){
    $.each(datasetsArray, function(key, val){
        $('#map-select-layer #menu-options #datasets-' + val['type'] + '').append('<li data-link="'+val['link']+'"><div class="dataset-title">' + key + '</div><img class="dataset-info" src="img/info-icon.png" alt="Info" /><div class="clearfix"></div><div class="dataset-description">' + val["description"] + '</div><div class="dataset-source">' + val["source"] + '</div></li>');
   });
}
renderDataSets();

$('#map-select-layer #menu-options ul').on("click", "li", function(e) {
	if($(e.target).hasClass('dataset-info')) {
		if(!$(e.target).hasClass('description-expanded')){
			$(e.target).addClass('description-expanded');
			$(e.target).siblings('.dataset-description').slideDown(300);
		}
		else {
			$('.description-expanded').removeClass('description-expanded');
			$(e.target).siblings('.dataset-description').slideUp(300);
		}
	}
	else {
		if($(this).hasClass('topic-selected')){ hideTopicMenu(); return; }

		$('.topic-selected').removeClass('topic-selected');
		$(this).addClass('topic-selected');

		$('.description-expanded').removeClass('description-expanded');
		$('.dataset-description').slideUp(300);

		if(menuViewed == 0){
			leftLayerData = datasetsArray[$(this).children('.dataset-title').text()]["link"];
			if(typeof leftLayer !== "undefined") map.removeLayer(leftLayer);
			setLeftLayer();
			// update left dataset label
			if(!$('#dataset-label-left').is(':visible')){
				$('#dataset-label-left').html($(this).children('.dataset-title').text()+'<img class="prompt-arrow" src="img/prompt-arrow-left.png" alt="Prompt arrow" />');
				$('#dataset-label-left').fadeIn();
			}
			else $('#dataset-label-left').html($(this).children('.dataset-title').text()+'<img class="prompt-arrow" src="img/prompt-arrow-left.png" alt="Prompt arrow" />');
		}
		else {
			rightLayerData = datasetsArray[$(this).children('.dataset-title').text()]["link"];
			if(typeof rightLayer !== "undefined") map.removeLayer(rightLayer);
			setRightLayer();
			// update right dataset label
			if(!$('#dataset-label-right').is(':visible')){
				$('#dataset-label-right').html($(this).children('.dataset-title').text()+'<img class="prompt-arrow" src="img/prompt-arrow-right.png" alt="Prompt arrow" />');
				$('#dataset-label-right').fadeIn();
			}
			else $('#dataset-label-right').html($(this).children('.dataset-title').text()+'<img class="prompt-arrow" src="img/prompt-arrow-right.png" alt="Prompt arrow" />');
		}

		hideTopicMenu();
	}
});

/* IF FIRST TIME, SHOW PROMPTS */

if(typeof localStorage['userReturning'] === "undefined"){
	$('#slider-bar').hide();
    $('#select-map-prompt-right').show();
}
