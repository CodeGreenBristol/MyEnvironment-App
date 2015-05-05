var tutorial = {
    _startSwipeCoords: null,
    _endSwipeCoords: null,
    _activePage: 0,
    _titles: ["Title1", "Title2", "Title3", "Title4"],
    _descriptions: ["The quick brown fox jumped over the lazy dog",
                    "Lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
                    "Super cala fragilistic expealadoshus...!",
                    "One two three four five six seven eight nine ten eleven twelve!"],
    _startButton: $('#start-button'),
    _circles: $('#circles'),
    _circles: $('#circles'),
    _title: $('#title'),
    _descriptionText: $('#description-text'),
    _imageImg: $('#image img'),
    _startButtonDiv: $('#start-button div'),
    _app: $('#ui-layer, #map-layer, #map-select-layer'),
    _tutorial: $('#tutorial-layer'),
    
    init: function() {
        if(localStorage['display-tutorial'] == true ||
           localStorage['display-tutorial'] == undefined) {
            var _this = this;
            $('body').on('touchstart', function(e) { _this.startSwipe(e); });
            $('body').on('touchmove', function(e) { _this.moveSwipe(e); });
            $('body').on('touchend', function(e) { _this.endSwipe(e); });
            this._startButton.on('touchstart', function() { _this.styleLaunchButton(); });
            this._startButton.on('touchend', function() { _this.launchApp(); });
            this.updatePage(this._activePage);
        } else {
            this.launchApp();
        }
    },
    
    //called on touchstart: stores initial touch coords
    startSwipe: function(e) {
        this._startSwipeCoords = { 
            x: e.originalEvent.touches[0].pageX,
            y: e.originalEvent.touches[0].pageY
        }
    },
    
    //called on touchmove: updates endcoords at each call
    moveSwipe: function(e) {
        this._endSwipeCoords = { 
            x: e.originalEvent.touches[0].pageX,
            y: e.originalEvent.touches[0].pageY
        }
    },

    //called on touchend: detects a left or right swipe
    endSwipe: function(e) {
        var minSwipeDistX = 50;
        var maxSwipeDistY = 100;
        var swipeDistX = Math.abs(this._startSwipeCoords.x - this._endSwipeCoords.x);
        var swipeDistY = Math.abs(this._startSwipeCoords.y - this._endSwipeCoords.y);
        
        //swipe detected if x dist > 50px and y dist < 100px
        if(swipeDistX > minSwipeDistX && swipeDistY < maxSwipeDistY) {
            if(this._startSwipeCoords.x < this._endSwipeCoords.x) {
                this.swipeLeft();
            } else {
                this.swipeRight();
            }
        }
    },

    updateCircles: function(active) {
        this._circles.children().each(function(i, obj) {
            if(i == active) {
                $(obj).attr("src", "img/tutorial/bubble-full.png");
            } else {
                $(obj).attr("src", "img/tutorial/bubble-empty.png");
            }
        });
    },

    //updates the tutorial text and image
    //displays the start button if last page reached
    updatePage: function(active) {
        this._descriptionText.text(this._descriptions[active]);
        this._imageImg.attr("src","img/tutorial/tutorial-image"+active+".png");
        if(active == 3) {
            this._startButtonDiv.css("visibility","visible");
        }
    },

    //increments current active page, updates circle indicators and page text + image
    swipeRight: function() {
        this._activePage++;
        if(this._activePage > 3) {
            this._activePage = 3;
        }
        this.updateCircles(this._activePage);
        this.updatePage(this._activePage);
    },

    //decrements current active page, updates circle indicators and page text + image
    swipeLeft: function() {
        this._activePage--;
        if(this._activePage < 0) {
            this._activePage = 0;
        }
        this.updateCircles(this._activePage);
        this.updatePage(this._activePage);
    },

    //called on touchstart: style start button green
    styleLaunchButton: function() {
        this._startButtonDiv.css({
            "background-color": "#64b551",
            "color": "#fff",
            "border-color": "#64b551"
        });
    },

    //called when start button pressed: reset styling,
    //close tutorial and open app
    launchApp: function() {
        localStorage['display-tutorial'] = false;
        //reset button colour
        this._startButtonDiv.css({
            "background-color": "#fff",
            "color": "#424242",
            "border-color": "#424242"
        });
        
        this._tutorial.css("display","none");
        this._app.css("display","block");
    }
}