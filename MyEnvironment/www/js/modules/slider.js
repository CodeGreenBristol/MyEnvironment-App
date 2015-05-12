var slider = {
    
    offset: (localStorage['sliderOffset'] !== undefined) ? parseInt(localStorage['sliderOffset'], 10) : 0,    
    _containerDiv: $('#slider-bar'),
    _containerID: $('#slider-bar').attr('id'),
    _sliderLeft: - $('#slider-bar').width() / 2,
    _rightArrowDiv: $('#drag-right'),
    _leftArrowDiv: $('#drag-left'),
    _previousOffset: this.offset,
    _direction: undefined,
    
    init: function(){        
        this.setOffset(this.offset);
        
        if(map.isLayerDefined("right")) this.showSlider();
        
        // slider on drag handler
        this._containerDiv.on('mousedown touchstart', function(){
            $(this).addClass('dragging');

            if(prompts.getCurrentPrompt() == "slide-prompt") prompts.promptCallback();
        });
        
        // slider off drag handler
        this._containerDiv.on('mouseup touchend', function(){
            $(this).removeClass('dragging');
            
            slider.setOffset(slider.offset);
        });
        
        // slider whilst dragging handler
        $('body').on('mousemove touchmove', function(e){

            // standardise touch
            var out = (e.type == "touchmove") ? e.originalEvent.touches[0] : e;

            if(slider._containerDiv.hasClass('dragging')){

                // set offset + override since dragging
                slider.setOffset(out.pageX, true);
                slider.setDirection(out.pageX);
            }

            // don't prevent default if on dataset menu
            if(!datasetMenu.isExpanded()) e.preventDefault();
        });
        
        // resize/orientation change      
        $(window).resize(function(){
            slider._sliderLeft = - slider._containerDiv.width() / 2;
            slider.setOffset(0);
        });
        
    },
    
    adjustArrows: function(){
    
        var offsetPercentage = this.offset / $(window).width();
 
        (offsetPercentage >= 0.07) ? this._rightArrowDiv.fadeOut(200) : this._rightArrowDiv.fadeIn(200);
        (offsetPercentage <= 0.93) ? this._leftArrowDiv.fadeOut(200) : this._leftArrowDiv.fadeIn(200);
    },
    
    /* accessor functions */
    
    // getOffset: function(){ return this.offset; },
    
    setOffset: function(val, draggingOverride){ 
        
        /* 1035 */
        // if not dragging
        if(!draggingOverride) {
        
            var sliderOffset = val / $(window).width();
            if(sliderOffset <= 0.2) val = 0;
            else if(sliderOffset >= 0.8) val = $(window).width();
            else val = (this.getDirection() == "left") ? 0 : $(window).width();
            
            // update storage       
            localStorage['sliderOffset'] = val;
        }
 
        // update slider position
        this._containerDiv.offset({ left: val + this._sliderLeft });
        
        // update local val + adjust container clipping
        this.offset = val;
        map.adjustClip();     
        
        this.adjustArrows();
        buttons.adjustButtons();
    },
    
    setDirection: function(val){
        this._direction = (val > this._previousOffset) ? "right" : "left";
        this._previousOffset = val;
    },
    
    getDirection: function(){
        return this._direction;
    },
    
    showSlider: function(){
        this._containerDiv.show();
    },
    
    hideSlider: function(){
        this._containerDiv.hide();
    }
}