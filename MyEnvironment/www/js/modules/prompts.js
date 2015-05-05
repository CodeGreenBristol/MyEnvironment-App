function Prompt(ID, arrowPos, text) {
    this.ID = ID;
    this.arrowPos = arrowPos;
    this.text = text;
}

var prompts = {

    _containerDiv: $('.user-prompt'),
    
    /* set prompts */
    
    _slidePrompt: new Prompt('slide-prompt', 'left', 'Slide to compare maps'),
    _selectMapRight: new Prompt('select-map-prompt-right', 'right', 'Select a dataset'),
    _selectMapLeft: new Prompt('select-map-prompt-left', 'left', 'Select another dataset'),
    _pinMapRight: new Prompt('pin-map-prompt-right', 'bottom-right', 'Tap the button to make the dataset visible on both sides of the slider'),
    _pinMapLeft: new Prompt('pin-map-prompt-left', 'bottom-left', 'Tap the button to make the dataset visible on both sides of the slider'),
    
    init: function(){
        
        this.promptCallback();
        
    },
    
    switchPrompt: function(newPrompt){
        
        var _this = this;
        this.setCurrentPrompt(newPrompt.ID);
        
        this._containerDiv.fadeOut(400, function(){
                 
            if(newPrompt.ID == "done") return;
            
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
        if(prompts.getCurrentPrompt() == "pin-map-prompt-left") this.switchPrompt(this._pinMapRight);
        else if(prompts.getCurrentPrompt() == "pin-map-prompt-right") this.switchPrompt(this._pinMapLeft);
        else this._containerDiv.fadeOut();
    },
    
    showCurrentPrompt: function(){
        this._containerDiv.fadeIn();
    },
    
    promptCallback: function(){
    
        var currentPrompt = this.getCurrentPrompt();
        if(currentPrompt == "done") return;

        if(currentPrompt === undefined) this.switchPrompt(this._selectMapRight);
        else if(currentPrompt == "select-map-prompt-right") this.switchPrompt(this._slidePrompt);
        else if(currentPrompt == "slide-prompt") this.switchPrompt(this._selectMapLeft);
        else if(currentPrompt == "select-map-prompt-left") this.switchPrompt(this._pinMapLeft);
        else if(currentPrompt == "pin-map-prompt-right" || currentPrompt == "pin-map-prompt-left") this.switchPrompt(new Prompt("done"));

    }
}