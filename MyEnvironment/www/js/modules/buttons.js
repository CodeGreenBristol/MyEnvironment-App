var buttons = {
    
    _leftSelectDiv: $('#outer-left-button'),
    _leftPinDiv: $('#left-pin'),
    
    _rightSelectDiv: $('#outer-right-button'),
    _rightPinDiv: $('#right-pin'),
    
    _pinDivs: $('#left-pin, #right-pin'),
    
    init: function(){
        
        var _this = this;
        
        // button listeners
        this._leftPinDiv.on('click', function(){ _this.pinListener('left'); });
        this._rightPinDiv.on('click', function(){ _this.pinListener('right'); });
        
        this._leftSelectDiv.on('click', function(){ datasetMenu.showMenu('left'); });
        this._rightSelectDiv.on('click', function(){ datasetMenu.showMenu('right'); });
    },
    
    adjustButtons: function(){
        
        // var offsetPercentage = slider.offset / $(window).width();
        
        // if(offsetPercentage >= 0.2){
        if(slider.offset >= 100){
            this._leftSelectDiv.fadeIn();
            if(this.checkStatus("left-pin")) this._leftPinDiv.fadeIn();
            
            if(prompts.getCurrentPrompt() == "select-map-prompt-left" || prompts.getCurrentPrompt() == "pin-map-prompt-left") prompts.showCurrentPrompt();
        }
        else {
            this._leftSelectDiv.fadeOut();
            this._leftPinDiv.fadeOut();
            
            if(prompts.getCurrentPrompt() == "select-map-prompt-left" || prompts.getCurrentPrompt() == "pin-map-prompt-left") prompts.hideCurrentPrompt();
        }
        
        if(slider.offset <= $(window).width() - 100){
        // if(offsetPercentage <= 0.8){
            this._rightSelectDiv.fadeIn();
            if(this.checkStatus("right-pin")) this._rightPinDiv.fadeIn();
            
            if(prompts.getCurrentPrompt() == "pin-map-prompt-right") prompts.showCurrentPrompt();
        }
        else {
            this._rightSelectDiv.fadeOut();
            this._rightPinDiv.fadeOut();
            
            if(prompts.getCurrentPrompt() == "pin-map-prompt-right") prompts.hideCurrentPrompt();
        }
    },
    
    checkStatus: function(button){
        if(button == "left-pin" && map.isLayerDefined("left") && (prompts.getCurrentPrompt() == "pin-map-prompt-right" || prompts.getCurrentPrompt() == "pin-map-prompt-left" || prompts.getCurrentPrompt() == "done")) return true;
        else if(button == "right-pin" && map.isLayerDefined("right") && (prompts.getCurrentPrompt() == "pin-map-prompt-right" || prompts.getCurrentPrompt() == "pin-map-prompt-left" || prompts.getCurrentPrompt() == "done")) return true; 4
        return false;
    },
    
    /* listeners */
    
    pinListener: function(side){
        
        var thisButton, otherButton;
        if(side == "right"){
            thisButton = this._rightPinDiv;
            otherButton = this._leftPinDiv;
        }
        else {
            thisButton = this._leftPinDiv;
            otherButton = this._rightPinDiv;
        }
        
        // if pinning
        if(!this.isPinned(side)){
        
            thisButton.attr('src', 'img/buttons/active-pin-icon-' + side + '.png').addClass('pin-active');
            otherButton.attr('src', 'img/buttons/inactive-pin-icon-' + ((side == "right") ? "left" : "right") + '.png').removeClass('pin-active');
            map.getLayer((side == "right") ? "left" : "right").bringToFront();
            
            if(prompts.getCurrentPrompt() == "pin-map-prompt-right" || prompts.getCurrentPrompt() == "pin-map-prompt-left") prompts.promptCallback();
        }
        // else unpinning
        else thisButton.attr('src', 'img/buttons/inactive-pin-icon-' + side + '.png').removeClass('pin-active');
        
        map.adjustClip();
        
    },
    
    loadingListener: function(side){
        (side == "right") ? this._rightSelectDiv.addClass('button-loading') : this._leftSelectDiv.addClass('button-loading');
    },
    
    loadedListener: function(side){
        // timeout to avoid glitch on fast load
        var _this = this;
        setTimeout(function(){
            (side == "right") ? _this._rightSelectDiv.removeClass('button-loading') : _this._leftSelectDiv.removeClass('button-loading');
        }, 300);
    },
    
    /* accessor functions */
    
    isPinned: function(side){
        return (side == "left") ? this._leftPinDiv.hasClass('pin-active') : this._rightPinDiv.hasClass('pin-active');
    }
}