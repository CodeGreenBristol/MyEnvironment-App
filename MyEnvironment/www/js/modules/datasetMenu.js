var datasetMenu = {

    _containerDiv: $('#map-select-layer'),
    _containerID: $('#map-select-layer').attr('id'),
    _currentMenu: null,
    _datasets: null,
    _datasetIndices: null,

    init: function(){

        var _this = this;

        // call datasets
        $.ajax({
            url: 'http://54.154.15.47/',
            async: false,
            dataType: 'json',
            success: function(data){
                _this._datasetIndices = data.typeNames;
                _this._datasets = data.layers;
                _this.renderDatasets();
            },
            error: function(){
                alert('Error, couldn\'t retrieve datasets!');
            }
        });

        //if on a mobile device use the deviceready event, else trigger manually
        (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) ? document.addEventListener("deviceready", this.onDeviceReady, false) : this.onDeviceReady();

        // button listeners
        $('#menu-icon').on('click', function(){ _this.hideMenu(); });

        this._containerDiv.find('#menu-options ul').on("click", "li", function(e) { _this.datasetListener($(this), e); });
    },

    // enable the android backbutton and get current position
    onDeviceReady: function() {
        var _this = datasetMenu;
        document.addEventListener("backbutton", function(){ _this.hideMenu(); }, false);
    },

    renderDatasets: function(){

        var _this = this;
        var dataContainers = [];

        $.each(this._datasetIndices, function(key, val){
            _this._containerDiv.children('#menu-options').append('<div class="dataset-type-label">' + val + '</div><ul id="datasets-' + key + '"></ul>');
            dataContainers.push(_this._containerDiv.find('#datasets-' + key));
        });

        $.each(this._datasets, function(key, val){
            dataContainers[parseInt(val.type, 10) - 1].append('<li data-name="' + val.name + '"><div class="dataset-title">' + val.title + '</div><img class="dataset-info" src="img/info-icon.png" alt="Info" /><div class="clearfix"></div><div class="dataset-description">' + val.description + '<br /><br />Source - <a href="' + val.sourceURL + '" target="_blank">' + val.sourceName + '</a></div></li>');
        });
    },

    showMenu: function(side){

        this._containerDiv.find('li.topic-selected').removeClass('topic-selected');

        // add tick to current selected topic based on left/right select
        this._containerDiv.find('li[data-name="' + (map.isLayerDefined(side) ? map.getLayerName(side) : undefined) +'"]').addClass('topic-selected');

        this._currentMenu = side;
        this._containerDiv.addClass('menu-expanded');

    },

    hideMenu: function(){
        this._containerDiv.removeClass('menu-expanded');
    },

    /* accessor functions */

    isExpanded: function(){
        return this._containerDiv.hasClass('menu-expanded');
    },

    getDataset: function(name){
        for(var i = 0; i < this._datasets.length; i++){
            if(name == this._datasets[i].name) return this._datasets[i];
        }
    },

    /* event listeners */

    datasetListener: function(dataset, e){

        // if description expand
        if($(e.target).hasClass('dataset-info')) {
            var descriptionDiv = $(e.target).siblings('.dataset-description');

            var toExpand = !descriptionDiv.hasClass('description-expanded');

            $('.description-expanded').removeClass('description-expanded').slideUp(300);

            if(toExpand) descriptionDiv.addClass('description-expanded').slideDown(300);

        }
        // else change new dataset
        else {

            if(dataset.hasClass('topic-selected')){ this.hideMenu(); return; }

            $('.topic-selected').removeClass('topic-selected');
            dataset.addClass('topic-selected');

            $('.description-expanded').removeClass('description-expanded').slideUp(300);

            map.setLayerName(this._currentMenu, dataset.attr('data-name'));
            map.setLayer(this._currentMenu);

            if(this._currentMenu == "left" && prompts.getCurrentPrompt() == "select-map-prompt-left") prompts.promptCallback();
            else if(this._currentMenu == "right" && prompts.getCurrentPrompt() == "select-map-prompt-right") prompts.promptCallback();

            slider.showSlider();
            buttons.adjustButtons();
            this.hideMenu();
        }
    }
}
