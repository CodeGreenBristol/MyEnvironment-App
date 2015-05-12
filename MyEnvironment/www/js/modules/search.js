var search = {

    _containerDiv: $('#search-bar'),
    _searchInput: $('#search-input'),
    _expandedDiv: $('#search-bar-expanded'),
    _searchMask: $('#search-mask'),
    _searchDiv: $('#search-results'),
    _searchHeader: $('#search-results .expanded-title'),
    _savedHeader: $('#saved-locations .expanded-title'),
    _searchResults: $('#search-results .expanded-locations'),
    _savedResults : $('#saved-locations .expanded-locations'),
    _emptySearchDiv: $('#search-bar-empty'),
    _favouritedDiv: $('#search-bar-favourite'),
    _geolocationDiv: $('#search-bar-location'),

    _searchDelay: null,
    _currentLocation: undefined,
    _savedLocations: (localStorage['savedLocations'] !== undefined) ? JSON.parse(localStorage['savedLocations']) : [],

    init: function(){

        var _this = this;

        this.renderSavedLocations();

        // button listeners
        this._searchInput.on('click', function(){ _this.expandSearch(); });

        $('#search-icon').on('click', function(){
            (_this._expandedDiv.is(':visible')) ? _this.collapseSearch() : _this.expandSearch();
        });

        $('html').on('click', function() { _this.collapseSearch(); });

        this._containerDiv.on('click', function(e){ e.stopPropagation(); });
        this._expandedDiv.on('click', function(e){ e.stopPropagation(); });

        // input listener
        this._searchInput.on('input', function() {

            //reset fav icon & curloc
            _this.setFavouriteIcon(false);
            _this.currentLocation = undefined;
            _this.triggerSearch();

        });

        this._searchInput.bind("enter", function(){
            if(_this._searchResults.children('li').length == 0) return;
            _this.goToResult(_this._searchResults.children('li').first());
        });

        this._searchInput.keyup(function(e){ if(e.keyCode == 13) $(this).trigger("enter"); });

        // search/saved result item listener
        this._searchResults.on('click', 'li', function(){ _this.goToResult($(this)); });
        this._savedResults.on('click', 'li', function(){ _this.goToResult($(this)); });

        // empty searchbar
        this._emptySearchDiv.on('click', function(){
            _this._searchInput.val("").focus();
            _this._searchDiv.hide();
            _this._emptySearchDiv.hide();
            _this.setFavouriteIcon(false);
            _this.expandSearch();
        });

        // favourite button listener
        this._favouritedDiv.on('click', function(){ _this.favouriteListener(); });

        // delete favourite listener
        this._savedResults.on('click', 'li .favourite-delete', function(e) {
            _this.removeSavedLocation({name: $(this).parent().text() });
            e.stopPropagation();
        });

        // geolocation listener
        this._geolocationDiv.on('click', function() {
            navigator.geolocation.getCurrentPosition(function(pos){ _this.geolocationSuccess(pos); }, function(){ _this.geolocationError(); });
        });

        //if on a mobile device use the deviceready event, else trigger manually
        (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) ? document.addEventListener("deviceready", this.onDeviceReady, false) : this.onDeviceReady();

    },

    expandSearch: function(){

        // ignore if already open
        if(this._expandedDiv.is(':visible')) return;

        this.triggerSearch();

        this._searchMask.fadeIn();
        this._expandedDiv.slideDown();

        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/left-arrow-icon.png').fadeIn();
        });
    },

    collapseSearch: function(){

        // ignore if already closed
        if(!this._expandedDiv.is(':visible')) return;

        this._searchMask.fadeOut();
        this._expandedDiv.slideUp();

        $('#search-icon img').fadeOut(100, function(){
            $(this).attr('src', 'img/search/search-icon.png').fadeIn();
        });
    },

    triggerSearch: function() {

        var _this = this;
        var searchQuery = this._searchInput.val();
        this._searchResults.empty();

        // no API call if empty
        if(searchQuery == ""){
            this._searchDiv.hide();
            this._emptySearchDiv.hide();
            return;
        }

        this._searchDiv.show();
        this._emptySearchDiv.css("display", "inline-block");

        //clean commas from query string to optimise processing on nominatim's end
        // searchQuery = inp.val().replace(", ", " ").replace(","," ");

        // show loading
        this.updateSearchHeader("loading");

        //timer used so fast-typing doesn't trigger rapid requests
        clearTimeout(this._searchDelay);
        this._searchDelay = setTimeout(function() {
            $.ajax({
                url: 'http://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=gb&q=' + searchQuery,
                dataType: 'json',
                success: function(data){ _this.updateSearchResults(data); }
            });
        }, 250);
    },

    updateSearchResults: function(data){

        // if no data
        if(data === undefined) return;

        var _this = this;
        var displayedResults = [];
        this._searchResults.empty();

        $.each(data, function(key, val) {

            // ignore duplicates
            var parsedName = val.display_name.toLowerCase();
            if($.inArray(parsedName, displayedResults) != -1) return true;

            _this._searchResults.append("<li data-lat='" + val.lat + "' data-lon='" + val.lon + "' data-type='" + val.type + "'>" + val.display_name + '</li>');
            displayedResults.push(parsedName);
        });

        // update search header
        (displayedResults.length != 0) ? this.updateSearchHeader("results") : this.updateSearchHeader("no-results");
    },

    goToResult: function(data){

        //update current location
        currentLocation = {
            lat: parseFloat(data.attr('data-lat')),
            lng: parseFloat(data.attr('data-lon')),
            name: data.text(),
            type: data.attr('data-type')
        };
        this.setCurrentLocation(currentLocation);

        this._searchInput.val(currentLocation.name);

        //set zoom level based on type of location
        if(currentLocation.name == "England, United Kingdom" || currentLocation.name == "Scotland, United Kingdom") var newZoom = 8;
        else if(currentLocation.type == "administrative") var newZoom = 10;
        else if(currentLocation.type == "city") var newZoom = 12;
        else if(currentLocation.type == "village" || currentLocation.type == "residential" || currentLocation.type == "hamlet") var newZoom = 14;
        else var newZoom = 13;

        map.panToLocation(new L.LatLng(currentLocation.lat, currentLocation.lng), newZoom);

        this.collapseSearch();
        (this.isSaved(currentLocation)) ? this.setFavouriteIcon(true) : this.setFavouriteIcon(false);
    },

    updateSearchHeader: function(type){
        if(type == "loading") this._searchHeader.html('<img id="loading-icon" src="img/search/loading.gif" alt="Loading icon"></div>Searching for locations...');
        else if(type == "results") this._searchHeader.text("Search results");
        else this._searchHeader.text("No results found");
    },

    updateSavedHeader: function(){
        (this._savedLocations.length > 0) ? this._savedHeader.text("Saved locations") : this._savedHeader.text("No saved locations");
    },

    renderSavedLocations: function(){

        var _this = this;
        this._savedResults.empty();

        $.each(this._savedLocations, function(key, val) {
            _this._savedResults.append("<li data-lat='" + val.lat + "' data-lon='" + val.lng + "' data-type='" + val.type+"'><div>" + val.name +
                '</div><img class="favourite-delete" src="img/search/favourite-delete-icon.png" alt="Delete favourite" /><div class="clearfix"></div></li>');
        });

        this.updateSavedHeader();
    },

    favouriteListener: function() {

        var currentLocation = this.getCurrentLocation();
        if(currentLocation === undefined) return;

        (this.isSaved(currentLocation)) ? this.removeSavedLocation(currentLocation) : this.addSavedLocation(currentLocation);
    },

    /* accessor functions */

    setFavouriteIcon: function(bool){
        bool ? this._favouritedDiv.addClass('favourite-toggled') : this._favouritedDiv.removeClass('favourite-toggled');
    },

    setCurrentLocation: function(data){
        this._currentLocation = data;
    },

    getCurrentLocation: function(){
        return this._currentLocation;
    },

    isSaved: function(location){
        for(var i = 0; i < this._savedLocations.length; i++){
            if(location.name == this._savedLocations[i].name) return true;
        }
        return false;
    },

    addSavedLocation: function(location){

        this._savedLocations.push(location);
        $('#saved-locations .expanded-locations').append("<li data-lat='" + location.lat+"' data-lon='" + location.lng + "' data-type='" + location.type + "'><div>" + location.name +
            '</div><img class="favourite-delete" src="img/search/favourite-delete-icon.png" alt="Delete favourite" /><div class="clearfix"></div></li>');

        this.updateSavedHeader();
        this.setFavouriteIcon(true);
        localStorage["savedLocations"] = JSON.stringify(this._savedLocations);
    },

    removeSavedLocation: function(location){

        for(var i = 0; i < this._savedLocations.length; i++){

            if(location.name != this._savedLocations[i].name) continue;

            this._savedLocations.splice(i, 1);
            this._savedResults.children('li:eq(' + i + ')').remove();
            if(this.getCurrentLocation() !== undefined && location.name == this.getCurrentLocation().name) this.setFavouriteIcon(false);
            break;
        }

        this.updateSavedHeader();
        localStorage["savedLocations"] = JSON.stringify(this._savedLocations);
    },

    /* mobile functions */

    geolocationSuccess: function(location) {
        map.panToLocation(new L.LatLng(location.coords.latitude, location.coords.longitude));
    },

    geolocationError: function() {
        alert("Sorry, we couldn't find your location!");
    },

    // enable the android backbutton and get current position
    onDeviceReady: function() {
        var _this = search;

        navigator.geolocation.getCurrentPosition(function(pos){ _this.geolocationSuccess(pos); }, function(){  _this.geolocationError();  });
        document.addEventListener("backbutton", function(){ _this.collapseSearch(); }, false);

        // analytics
        if (window.analytics !== undefined){
			window.analytics.startTrackerWithId('UA-61968992-6');
		} else {
			ga('create', 'UA-61968992-7', 'auto');
		}
    }
}
