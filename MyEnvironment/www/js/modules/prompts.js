function Prompt(ID, arrowPos, text) {
    this.ID = ID;
    this.arrowPos = arrowPos;
    this.text = text;
}

var prompts = {

    _containerDiv: $('.user-prompt'),
    _pulseDiv: undefined,
    
    /* set prompts */
    
    _slidePrompt: new Prompt('slide-prompt', 'left', 'Slide to compare maps'),
    _selectMapRight: new Prompt('select-map-prompt-right', 'right', 'Select a dataset'),
    _selectMapLeft: new Prompt('select-map-prompt-left', 'left', 'Select another dataset'),
    _pinMapRight: new Prompt('pin-map-prompt-right', 'bottom-right', 'Tap the button to make the dataset visible on both sides of the slider'),
    _pinMapLeft: new Prompt('pin-map-prompt-left', 'bottom-left', 'Tap the button to make the dataset visible on both sides of the slider'),
    
    init: function(){
        
        this.promptCallback(true);
        
    },
    
    switchPrompt: function(newPrompt, pulseDiv){
        
        var _this = this;
        this.setCurrentPrompt(newPrompt.ID);
       
        if(_this._pulseDiv !== undefined) _this._pulseDiv.removeClass('pulse');
        this._containerDiv.fadeOut(400, function(){
                 
            if(newPrompt.ID == "done") return;
            
            _this._pulseDiv = pulseDiv;
            _this._pulseDiv.addClass('pulse');
            
            if(newPrompt.arrowPos == "right") var imgName = "right";
            else if(newPrompt.arrowPos == "bottom-right" || newPrompt.arrowPos == "bottom-left") var imgName = "down";
            else var imgName = "left";
            
            _this._containerDiv.attr('id', newPrompt.ID).html(newPrompt.text + '<img class="prompt-arrow arrow-' + newPrompt.arrowPos + '" src="img/prompt-arrow-' + imgName + '.png" alt="Prompt arrow" />').fadeIn();
            
        });
    },
    
    getCurrentPrompt: function(){
        return localStorage['currentPrompt'];
    },
    
    setCurrentPrompt: function(promptID){
        localStorage['currentPrompt'] = promptID;
    },
    
    hideCurrentPrompt: function(){
        if(prompts.getCurrentPrompt() == "pin-map-prompt-left") this.switchPrompt(this._pinMapRight, buttons._pinDivs);
        else if(prompts.getCurrentPrompt() == "pin-map-prompt-right") this.switchPrompt(this._pinMapLeft, buttons._pinDivs);
        else this._containerDiv.fadeOut();
    },
    
    showCurrentPrompt: function(){
        this._containerDiv.fadeIn();
    },
    
    promptCallback: function(switchOverride){
    
        var currentPrompt = this.getCurrentPrompt();
        if(currentPrompt == "done") return;

        if(switchOverride){
            if(currentPrompt === undefined) this.switchPrompt(this._selectMapRight, buttons._rightSelectDiv);
            else if(currentPrompt == "select-map-prompt-right") this.switchPrompt(this._selectMapRight, buttons._rightSelectDiv);
            else if(currentPrompt == "slide-prompt") this.switchPrompt(this._slidePrompt, slider._rightArrowDiv);
            else if(currentPrompt == "select-map-prompt-left") this.switchPrompt(this._selectMapLeft, buttons._leftSelectDiv);
            else if(currentPrompt == "pin-map-prompt-right") this.switchPrompt(this._pinMapRight, buttons._pinDivs);
            else if(currentPrompt == "pin-map-prompt-left") this.switchPrompt(this._pinMapLeft, buttons._pinDivs);
        }
        else {
            if(currentPrompt === undefined) this.switchPrompt(this._selectMapRight, buttons._rightSelectDiv);
            else if(currentPrompt == "select-map-prompt-right") this.switchPrompt(this._slidePrompt, slider._rightArrowDiv);
            else if(currentPrompt == "slide-prompt") this.switchPrompt(this._selectMapLeft, buttons._leftSelectDiv);
            else if(currentPrompt == "select-map-prompt-left") this.switchPrompt(this._pinMapLeft, buttons._pinDivs);
            else if(currentPrompt == "pin-map-prompt-right" || currentPrompt == "pin-map-prompt-left") this.switchPrompt(new Prompt("done"));
        }
    }
}