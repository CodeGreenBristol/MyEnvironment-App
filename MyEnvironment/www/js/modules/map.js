var map = {

    _containerDiv: $('#map-layer'),
    _containerID: $('#map-layer').attr('id'),
    _mapObj: null,
    _rightLayer: {
        obj: null,
        container: $('#rightData'),
        data: (localStorage['rightLayer'] !== undefined) ? localStorage['rightLayer'] : undefined
    },
    _leftLayer: {
        obj: null,
        container: $('#leftData'),
        data: (localStorage['leftLayer'] !== undefined) ? localStorage['leftLayer'] : undefined
    },
    _locationMarker: undefined,
    _markerIcon: L.icon({
        iconUrl: 'img/marker-icon.png', // also retina
        iconSize: [25, 41],
        iconAnchor: [12, 40]
    }),

    init: function(){
        
        // create map object
        this._mapObj = L.map(this._containerID, {
            attributionControl: false,
            zoomControl:false,
            center: [51.45, -2.59],
            zoom: 14,
            minZoom: 7,
            maxZoom: 16
        });
        
        // create scale indicator
        L.control.scale({position: 'topright', 'imperial': false}).addTo(this.getMap());
        
        // add mapbox map background
        var apiKey = 'pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
        L.tileLayer('http://{s}.tiles.mapbox.com/v4/mc13818.l2a71g35/{z}/{x}/{y}.png?access_token=' + apiKey, {
            reuseTiles: true,
            detectRetina: true,
            unloadInvisibleTiles: false
        }).addTo(this.getMap());
        
        // add data layers if exist
        if(this.isLayerDefined("right")) this.setLayer("right");
        if(this.isLayerDefined("left")) this.setLayer("left");
        
        // add move handler
        this.getMap().on('move', this.adjustClip);
        
        // pan to centre of map on marker click
        this._containerDiv.on('click', '.leaflet-marker-icon', function(){
            map.getMap().panTo(map._locationMarker.getLatLng());
        });
    },
    
    setLayer: function(side){
    
        var _this = this;
        var layer = (side == "right") ? this._rightLayer : this._leftLayer;
        
        if(this.getLayer(side)) this.getMap().removeLayer(this.getLayer(side));
        
        layer.obj = L.tileLayer.wms("http://54.154.15.47/geoserver/ea/wms", {
            layers: layer.data,
            format: 'image/png8',
            transparent: true,
            tiled: true,
            version: '1.1.0',
            reuseTiles: true,
            detectRetina: true,
            unloadInvisibleTiles: false,
            height: 512,
			width: 512
        }).addTo(this.getMap());
        
        $(layer.obj._container).attr("id", side + "Data");
        layer.container = $('#' + side + 'Data');
        
        // loading listeners
        layer.obj.on('loading', function(){ buttons.loadingListener(side); })
            .on('load', function(){ buttons.loadedListener(side); });
        
        // add to localstorage
        localStorage[side + 'Layer'] = layer.data;
        
        this.adjustClip();
    },
    
    adjustClip: function(){
        
        var mapObj = map.getMap();
        
        var nw = mapObj.containerPointToLayerPoint([0, 0]);
        var se = mapObj.containerPointToLayerPoint(mapObj.getSize());
        var clipX = nw.x + (se.x - nw.x) * (slider.offset / $(window).width());
        
        (!buttons.isPinned('right')) ? map._leftLayer.container.css("clip", 'rect(' + nw.y + "px, " + clipX + "px, " + se.y + "px, " + nw.x + 'px)') : map._leftLayer.container.css('clip', 'auto');
        (!buttons.isPinned('left')) ? map._rightLayer.container.css("clip", 'rect(' + nw.y + "px, " + se.x + "px, " + se.y + "px, " + clipX + 'px)') : map._rightLayer.container.css('clip', 'auto');
    },
        
    panToLocation: function(location, zoom) {

        (zoom !== undefined) ? this.getMap().setView(location, zoom) : this.getMap().panTo(location);
        
        // set marker for location
        (this._locationMarker === undefined) ? this._locationMarker = L.marker(location, {icon: this._markerIcon}).addTo(this.getMap()) : this._locationMarker.setLatLng(location); 
    },
        
    /* accessor functions */
    
    getMap: function(){
        return this._mapObj;
    },
    
    getLayer: function(layer){
        return (layer == "left") ? this._leftLayer.obj : this._rightLayer.obj;
    },
    
    getLayerName: function(layer){
        return (layer == "left") ? this._leftLayer.data : this._rightLayer.data;
    },
    
    setLayerName: function(layer, name){
        (layer == "left") ? this._leftLayer.data = name : this._rightLayer.data = name;
        
        // send to analytics
		
		if (window.analytics !== undefined){
			window.analytics.trackView(this.getLayerName('left') + 'AND' + this.getLayerName('right'))
		} else {
			ga('send', 'pageview', this.getLayerName('left') + 'AND' + this.getLayerName('right'));
		} 
	
	},
    
    isLayerDefined: function(layer){
        return (layer == "left") ? this._leftLayer.data !== undefined : this._rightLayer.data !== undefined;
    }
    
}