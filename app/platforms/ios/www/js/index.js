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
    maxZoom: 18,
		//reuseTiles: true,
    detectRetina: true,
		//unloadInvisibleTiles: false
}).addTo(map);

var rightLayerData = 'ea:flood_warning_areas';
var leftLayerData = 'ea:flood_alert_areas';
var rightLayer;
var leftLayer;

function setRightLayer(rightLayerData) {
    rightLayer = L.tileLayer.wms("http://54.154.15.47/geoserver/ea/wms",{
        layers: rightLayerData,
        format: 'image/png8',
        transparent: true,
        tiled: true,
        srs: 'EPSG:4326',
        version: '1.1.0',
        //reuseTiles: true,
        detectRetina: true,
				//unloadInvisibleTiles: false
    }).addTo(map);
    
}
setRightLayer(rightLayerData);
$(rightLayer._container).attr("id", "rightData");

function setLeftLayer(rightLayerData) {
    leftLayer = L.tileLayer.wms("http://54.154.15.47/geoserver/ea/wms",{
        layers: leftLayerData,
        format: 'image/png8',
        transparent: true,
        tiled: true,
        srs: 'EPSG:4326',
        version: '1.1.0',
        //reuseTiles: true,
        detectRetina: true,
				//unloadInvisibleTiles: false
    }).addTo(map);
}
setLeftLayer(leftLayerData);
$(leftLayer._container).attr("id", "leftData").css("clip", "rect(0px, 0px, 0px, 0px)");

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

var sliderOffset = 0;

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
    range = sliderOffset / $(window).width(),
    clipX = nw.x + (se.x - nw.x) * range;
    
    $('#leftData').css("clip", 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)');
    $('#rightData').css("clip", 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)');
}
   
map.on('move', adjustDataContainer);

function generateButtonRules(){
    if($(window).width() <= 768) return {buttonLimit: 80};
    else if($(window).width() <= 1024) return {buttonLimit: 120}; 
    else return {buttonLimit: 150};
}
var sliderLimits = generateButtonRules();
    
function offsetFunc(){
    
    adjustDataContainer();
    
    // SHOW BUTTON IF SIDE IS VISIBLE
    if(sliderOffset >= sliderLimits.buttonLimit && !$('#left-button-block').is(':visible')){
        $('#left-button-block').fadeIn();
    }
    else if(sliderOffset < sliderLimits.buttonLimit && $('#left-button-block').is(':visible')){
        buttonExpand("left", true);
        $('#left-button-block').fadeOut();        
    }
    else if(sliderOffset <= $(window).width() - sliderLimits.buttonLimit && !$('#right-button-block').is(':visible')){
        $('#right-button-block').fadeIn();
    }
    else if(sliderOffset > $(window).width() - sliderLimits.buttonLimit && $('#right-button-block').is(':visible')){
        buttonExpand("right", true);
        $('#right-button-block').fadeOut();    
    }
    
    // SHOW ARROWS ON SIDE OF SLIDER
    if(sliderOffset / $(window).width() >= 0.1 && $('#drag-right').is(':visible')){
        $('#drag-right').fadeOut();
    }
    else if(sliderOffset / $(window).width() < 0.1 && !$('#drag-right').is(':visible')){
        $('#drag-right').fadeIn();        
    }
    if(sliderOffset / $(window).width() <= 0.9 && $('#drag-left').is(':visible')){
        $('#drag-left').fadeOut();
    }
    else if(sliderOffset / $(window).width() > 0.9 && !$('#drag-left').is(':visible')){
        $('#drag-left').fadeIn();        
    }
}
    
// DRAGGABLE SLIDER
$('#slider-bar').on('mousedown touchstart', function(){
    $(this).addClass('dragging');
});
$('#slider-bar').on('mouseup touchend', function(){
    $(this).removeClass('dragging');
    if($(this).offset().left < -25) $(this).offset({ left: -25 });
    else if($(this).offset().left > $(window).width() - 25) $(this).offset({ left: $(window).width() - 25 });
});

$('body').on('mousemove touchmove', function(e){
    
    if(e.type == "touchmove") var out = e.originalEvent.touches[0];
    else var out = e;
        
    if($('#slider-bar').hasClass('dragging')){      
  
        if(sliderOffset != out.pageX);{
        
            if(sliderOffset < 0) sliderOffset = 0;
            else if(sliderOffset > $(window).width()) sliderOffset = $(window).width();
            else sliderOffset = out.pageX;
            
            offsetFunc();
            $('#slider-bar').offset({
                left: sliderOffset - 25
            });
        }
    }
});

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
    $('#search-results .expanded-locations').empty();
    
    if(inp.val() == ""){
        $('#search-results').hide();
        $('#search-bar-empty').hide();
        return;
    }
    else {
        $('#search-results').show();
        $('#search-bar-empty').css("display", "inline-block");
    }
    
    //timer used so fast-typing doesn't trigger rapid requests
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function() {      
        $.ajax({
            //fetch from http://nominatim.openstreetmap.org/
            url: 'http://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=gb&q=' + inp.val(),
            dataType: 'json',
            success: updateSearchResults
        });
    }, 250); 
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
    if (items.length != 0) {
        $(items.join('')).appendTo('#search-results .expanded-locations');
        $('#search-results .expanded-title').text("Search results");
    } else {
        $('#search-results .expanded-title').text("No results found");
    }
}

//  FAVOURITE LOCATION
var savedLocations = [];    //holds loc data for all saved locs
localStorage.setItem("savedLocations", JSON.stringify(savedLocations));


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
    "Flood warning areas" : "ea:flood_warning_areas",
    "Flood alert areas" : "ea:flood_alert_areas",
    "Nitrate-sensitive areas" : "ea:nitrate_sensitive_areas",
    "Areas of outstanding natural beauty" : "ea:areasoutstgnaturalbeauty_eng",
    "Agricultural land" : "ea:agri_land_class",   
    "Flood risk areas" : "ea:flood_risk_areas"
};

// TOGGLE MAP TOPIC MENU
$('#right-topic-button, #left-topic-button').click(function() {
    $('#map-select-layer').show().animate({height: "100%"}, {duration: 750});
});

// SLIDE DOWN TOPIC MENU
$('#menu-icon').click(function() {
    $('#map-select-layer').animate({height: "0px"}, {duration: 750, complete: function(){
        $(this).hide();
    }});
});

function renderDataSets(){
    $.each(datasetsArray, function(key, val){
        $('#map-select-layer #menu-options ul').append('<li data-layer="' + val + '">' + key + '</li>');
    });
}    
renderDataSets();

/*
// GENERATE DATASET MENU RIGHT SIDE
$('#right-topic-button').click(function() {

    // Generate new list
    for (var datasetTitle in datasetsArray) {
        if (rightLayerData == datasetsArray[datasetTitle]) {
            $('#map-select-layer #menu-options ul').append('<li class = "topic-selected">'+ datasetTitle + '</li>');
        }
        else if (leftLayerData != datasetsArray[datasetTitle]) {
            $('#map-select-layer #menu-options ul').append('<li>'+ datasetTitle + '</li>');
        }        
    }

    // Click Handler
    $('#map-select-layer #menu-options ul li').click(function() {
        $('.topic-selected').removeClass('topic-selected');
        $(this).addClass('topic-selected');
        rightLayerData = datasetsArray[this.innerText];
        map.removeLayer(rightLayer);
        setRightLayer(rightLayerData);
    });
});

// GENERATE DATASET MENU LEFT SIDE
$('#left-topic-button').click(function() {
    // Clear previous data set menu
    $('#map-select-layer #menu-options ul').html('');
    // Generate new list
    for (var datasetTitle in datasetsArray) {
        if (leftLayerData == datasetsArray[datasetTitle]) {
            $('#map-select-layer #menu-options ul').append('<li class = "topic-selected">'+ datasetTitle + '</li>');
        }
        else if (rightLayerData != datasetsArray[datasetTitle]) {
            $('#map-select-layer #menu-options ul').append('<li>'+ datasetTitle + '</li>');
        }        
    }

    // Click Handler
    $('#map-select-layer #menu-options ul li').click(function() {
        $('.topic-selected').removeClass('topic-selected');
        $(this).addClass('topic-selected');
        leftLayerData = datasetsArray[this.innerText];
        map.removeLayer(leftLayer);
        setLeftLayer(leftLayerData);
    });
});
*/
